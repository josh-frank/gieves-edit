import { arcToCubicBeziers } from "./arcToCubicBeziers";

const round = ( value, decimals ) => Math.round( value * ( decimals ** 100 ) ) / ( decimals ** 100 );

export class PathParser {

    static validCommand = /^[\t\n\f\r\s]*([achlmqstvz])[\t\n\f\r\s]*/i;
    static validFlag = /^[01]/;
    static validCoordinate = /^[+-]?((\d*\.\d+)|(\d+\.)|(\d+))(e[+-]?\d+)?/i;
    static validComma = /^(([\t\n\f\r\s]+,?[\t\n\f\r\s]*)|(,[\t\n\f\r\s]*))/;

    static pathGrammar = {
        m: [ this.validCoordinate, this.validCoordinate ],
        l: [ this.validCoordinate, this.validCoordinate ],
        h: [ this.validCoordinate ],
        v: [ this.validCoordinate ],
        z: [],
        c: [ this.validCoordinate, this.validCoordinate, this.validCoordinate, this.validCoordinate, this.validCoordinate, this.validCoordinate ],
        s: [ this.validCoordinate, this.validCoordinate, this.validCoordinate, this.validCoordinate ],
        q: [ this.validCoordinate, this.validCoordinate, this.validCoordinate, this.validCoordinate ],
        t: [ this.validCoordinate, this.validCoordinate ],
        a: [ this.validCoordinate, this.validCoordinate, this.validCoordinate, this.validFlag, this.validFlag, this.validCoordinate, this.validCoordinate ],
    };

    static pointGrammar = {
        z: () => [],
        Z: () => [],
        m: ( command, previousPoint ) => [ previousPoint[ 0 ] + command[ 1 ], previousPoint[ 1 ] + command[ 2 ] ],
        M: command => command.slice( 1 ),
        h: ( command, previousPoint ) => [ previousPoint[ 0 ] + command[ 1 ], previousPoint[ 1 ] ],
        H: ( command, previousPoint ) => [ command[ 1 ], previousPoint[ 1 ] ],
        v: ( command, previousPoint ) => [ previousPoint[ 0 ], previousPoint[ 1 ] + command[ 1 ] ],
        V: ( command, previousPoint ) => [ previousPoint[ 0 ], command[ 1 ] ],
        l: ( command, previousPoint ) => [ previousPoint[ 0 ] + command[ 1 ], previousPoint[ 1 ] + command[ 2 ] ],
        L: command => command.slice( 1 ),
        a: ( command, previousPoint ) => [ previousPoint[ 0 ] + command[ 6 ], previousPoint[ 1 ] + command[ 7 ] ],
        A: command => command.slice( 6 ),
        c: ( command, previousPoint ) => [ previousPoint[ 0 ] + command[ 5 ], previousPoint[ 1 ] + command[ 6 ] ],
        C: command => command.slice( 5 ),
        t: ( command, previousPoint ) => [ previousPoint[ 0 ] + command[ 1 ], previousPoint[ 1 ] + command[ 2 ] ],
        T: command => command.slice( 1 ),
        q: ( command, previousPoint ) => [ previousPoint[ 0 ] + command[ 3 ], previousPoint[ 1 ] + command[ 4 ] ],
        Q: command => command.slice( 3 ),
        s: ( command, previousPoint ) => [ previousPoint[ 0 ] + command[ 3 ], previousPoint[ 1 ] + command[ 4 ] ],
        S: command => command.slice( 3 )
    };

    static parseComponents( type, command, cursor ) {
        const expectedCommands = this.pathGrammar[ type.toLowerCase() ];
        const components = [];
        while ( cursor <= command.length ) {
            const component = [ type ];
            for ( const regex of expectedCommands ) {
                const match = command.slice( cursor ).match( regex );
                if ( match !== null ) {
                    component.push( round( match[ 0 ], 2 ) );
                    cursor += match[ 0 ].length;
                    const nextSlice = command.slice( cursor ).match( this.validComma );
                    if ( nextSlice !== null ) cursor += nextSlice[ 0 ].length;
                } else if ( component.length === 1 ) {
                    return [ cursor, components ];
                } else {
                    throw new Error( `Invalid path: first error at char ${ cursor }` );
                }
            }
            components.push( component );
            if ( expectedCommands.length === 0 ) return [ cursor, components ];
            if ( type === 'm' ) type = 'l';
            if ( type === 'M' ) type = 'L';
        }
        throw new Error( `Invalid path: first error at char ${ cursor }` );
    }

    static parseRaw( path ) {
        let cursor = 0, parsedComponents = [];
        while ( cursor < path.length ) {
            const match = path.slice( cursor ).match( this.validCommand );
            if ( match !== null ) {
                const command = match[ 1 ];
                cursor += match[ 0 ].length;
                const componentList = PathParser.parseComponents( command, path, cursor );
                cursor = componentList[ 0 ];
                parsedComponents = [ ...parsedComponents, ...componentList[1] ];
            } else {
                throw new Error(  `Invalid path: first error at char ${ cursor }`  );
            }
        }
        return parsedComponents;
    }

}

class PathCommand {

    constructor( parsedCommand, absolutePrevious, index ) {
        this.index = index;
        this.commandLetter = parsedCommand[ 0 ];
        this.absolutePrevious = absolutePrevious.map( coordinate => round( coordinate, 2 ) );
        this.parse( parsedCommand );
    }

    setNext( nextPathCommand ) { this.next = nextPathCommand; }

    setNormalized( normalizedCommand ) { this.normalizedCommand = normalizedCommand; }

    setAbsolute() { this.commandLetter = this.commandLetter.toUpperCase(); }

    setRelative() { this.commandLetter = this.commandLetter.toLowerCase(); }

    isRelative() { return this.commandLetter === this.commandLetter.toLowerCase(); }

    parse( parsedCommand ) {
        this.absoluteNext = PathParser.pointGrammar[ parsedCommand[ 0 ] ]( parsedCommand, this.absolutePrevious ).map( coordinate => round( coordinate, 2 ) );
        this.absoluteCommand = [ ...this.absoluteNext ];
        this.relativeCommand = [ round( this.absoluteNext[ 0 ] - this.absolutePrevious[ 0 ], 2 ), round( this.absoluteNext[ 1 ] - this.absolutePrevious[ 1 ], 2 ) ]
        switch( parsedCommand[ 0 ] ) {
            case "c":
                this.absoluteCommand = [
                    this.absolutePrevious[ 0 ] + parsedCommand[ 1 ],
                    this.absolutePrevious[ 1 ] + parsedCommand[ 2 ],
                    this.absolutePrevious[ 0 ] + parsedCommand[ 3 ],
                    this.absolutePrevious[ 1 ] + parsedCommand[ 4 ]
                ].concat( this.absoluteCommand );
                this.relativeCommand = [
                    this.absoluteCommand[ 0 ] - this.absolutePrevious[ 0 ],
                    this.absoluteCommand[ 1 ] - this.absolutePrevious[ 1 ],
                    this.absoluteCommand[ 2 ] - this.absolutePrevious[ 0 ],
                    this.absoluteCommand[ 3 ] - this.absolutePrevious[ 1 ],
                ].concat( this.relativeCommand );
                this.startHandle = [
                    this.absolutePrevious[ 0 ],
                    this.absolutePrevious[ 1 ],
                    this.absolutePrevious[ 0 ] + this.relativeCommand[ 0 ],
                    this.absolutePrevious[ 1 ] + this.relativeCommand[ 1 ]
                ];
                this.endHandle = [
                    this.absoluteNext[ 0 ],
                    this.absoluteNext[ 1 ],
                    this.absolutePrevious[ 0 ] + this.relativeCommand[ 2 ],
                    this.absolutePrevious[ 1 ] + this.relativeCommand[ 3 ]
                ];
                break;
            case "C":
                this.absoluteCommand = parsedCommand.slice( 1 );
                this.relativeCommand = [
                    this.absoluteCommand[ 0 ] - this.absolutePrevious[ 0 ],
                    this.absoluteCommand[ 1 ] - this.absolutePrevious[ 1 ],
                    this.absoluteCommand[ 2 ] - this.absolutePrevious[ 0 ],
                    this.absoluteCommand[ 3 ] - this.absolutePrevious[ 1 ]
                ].concat( this.relativeCommand );
                this.startHandle = [
                    this.absolutePrevious[ 0 ],
                    this.absolutePrevious[ 1 ],
                    this.absolutePrevious[ 0 ] + this.relativeCommand[ 0 ],
                    this.absolutePrevious[ 1 ] + this.relativeCommand[ 1 ]
                ];
                this.endHandle = [
                    this.absoluteNext[ 0 ],
                    this.absoluteNext[ 1 ],
                    this.absolutePrevious[ 0 ] + this.relativeCommand[ 2 ],
                    this.absolutePrevious[ 1 ] + this.relativeCommand[ 3 ]
                ];
                break;
            case "s":
            case "q":
                this.absoluteCommand = [
                    this.absolutePrevious[ 0 ] + parsedCommand[ 1 ],
                    this.absolutePrevious[ 1 ] + parsedCommand[ 2 ],
                ].concat( this.absoluteCommand );
                this.relativeCommand = [
                    this.absoluteCommand[ 0 ] - this.absolutePrevious[ 0 ],
                    this.absoluteCommand[ 1 ] - this.absolutePrevious[ 1 ]
                ].concat( this.relativeCommand );
                this.startHandle = [
                    this.absolutePrevious[ 0 ],
                    this.absolutePrevious[ 1 ],
                    this.absolutePrevious[ 0 ] + this.relativeCommand[ 0 ],
                    this.absolutePrevious[ 1 ] + this.relativeCommand[ 1 ]
                ];
                break;
            case "S":
            case "Q":
                this.absoluteCommand = parsedCommand.slice( 1 );
                this.relativeCommand = [
                    this.absoluteCommand[ 0 ] - this.absolutePrevious[ 0 ],
                    this.absoluteCommand[ 1 ] - this.absolutePrevious[ 1 ]
                ].concat( this.relativeCommand );
                this.startHandle = [
                    this.absolutePrevious[ 0 ],
                    this.absolutePrevious[ 1 ],
                    this.absolutePrevious[ 0 ] + this.relativeCommand[ 0 ],
                    this.absolutePrevious[ 1 ] + this.relativeCommand[ 1 ]
                ];
                break;
            case "a":
            case "A":
                this.absoluteCommand = parsedCommand.slice( 1, 6 ).concat( this.absoluteCommand );
                this.relativeCommand = parsedCommand.slice( 1, 6 ).concat( this.relativeCommand );
                break;
            default: break;
        }
    }

    toString() {
        let commandToStringify = this.commandLetter === this.commandLetter.toLowerCase() ? this.relativeCommand : this.absoluteCommand;
        if ( this.commandLetter.toLowerCase() === "h" ) commandToStringify = commandToStringify.slice( 0, 1 );
        if ( this.commandLetter.toLowerCase() === "v" ) commandToStringify = commandToStringify.slice( 1 );
        return [ this.commandLetter, ...commandToStringify ].join( " " );
    }
    
    absolute( gridInterval ) {
        const snappedCommand = gridInterval && this.absoluteCommand.map( parameter => Math.round( parameter / gridInterval ) * gridInterval );
        return [ this.commandLetter.toUpperCase(), ...(
            this.commandLetter.toLowerCase() === "h" ? ( snappedCommand || this.absoluteCommand ).slice( 0, 1 ) : 
            this.commandLetter.toLowerCase() === "v" ? ( snappedCommand || this.absoluteCommand ).slice( 1 ) :
            this.commandLetter.toLowerCase() === "a" ? [ ...this.absoluteCommand.slice( 0, 5 ), ...( snappedCommand || this.absoluteCommand ).slice( 5 ) ] :
            ( snappedCommand || this.absoluteCommand ) ) ];
    }

    relative( gridInterval ) {
        const snappedCommand = gridInterval && this.relativeCommand.map( parameter => Math.round( parameter / gridInterval ) * gridInterval );
        return [ this.commandLetter.toLowerCase(), ...(
            this.commandLetter.toLowerCase() === "h" ? ( snappedCommand || this.relativeCommand ).slice( 0, 1 ) : 
            this.commandLetter.toLowerCase() === "v" ? ( snappedCommand || this.relativeCommand ).slice( 1 ) :
            this.commandLetter.toLowerCase() === "a" ? [ ...this.relativeCommand.slice( 0, 5 ), ...( snappedCommand || this.relativeCommand ).slice( 5 ) ] :
            ( snappedCommand || this.relativeCommand ) ) ];
    }

    moveCommand( absoluteX = this.absoluteCommand[ 0 ], absoluteY = this.absoluteCommand[ 1 ], adjustPointOnly ) {
        switch ( this.commandLetter.toLowerCase() ) {
            case "h":
                this.absoluteCommand[ 1 ] = absoluteX;
                break;
            case "v":
                this.absoluteCommand[ 1 ] = absoluteY;
                break;
            case "m":
            case "l":
            case "t":
            case "a":
                this.absoluteCommand[ this.absoluteCommand.length - 2 ] = absoluteX;
                this.absoluteCommand[ this.absoluteCommand.length - 1 ] = absoluteY;
                break;
            case "s":
            case "q":
                if ( !adjustPointOnly ) {
                    this.absoluteCommand[ 0 ] = absoluteX - ( this.relativeCommand[ 2 ] - this.relativeCommand[ 0 ] );
                    this.absoluteCommand[ 1 ] = absoluteY - ( this.relativeCommand[ 3 ] - this.relativeCommand[ 1 ] );
                }
                this.absoluteCommand[ 2 ] = absoluteX;
                this.absoluteCommand[ 3 ] = absoluteY;
                break;
            case "c":
                if ( !adjustPointOnly ) {
                    this.absoluteCommand[ 0 ] = absoluteX - ( this.relativeCommand[ 4 ] - this.relativeCommand[ 0 ] );
                    this.absoluteCommand[ 1 ] = absoluteY - ( this.relativeCommand[ 5 ] - this.relativeCommand[ 1 ] );
                    this.absoluteCommand[ 2 ] = absoluteX - ( this.relativeCommand[ 4 ] - this.relativeCommand[ 2 ] );
                    this.absoluteCommand[ 3 ] = absoluteY - ( this.relativeCommand[ 5 ] - this.relativeCommand[ 3 ] );
                }
                this.absoluteCommand[ 4 ] = absoluteX;
                this.absoluteCommand[ 5 ] = absoluteY;
                break;
            case "z": break;
            default: break;
        }
        this.parse( PathParser.parseRaw( this.absolute().join( " " ) )[ 0 ] );
        if ( this.next ) {
            this.next.absolutePrevious = [ absoluteX, absoluteY ];
            this.next.parse( PathParser.parseRaw( this.next.absolute().join( " " ) )[ 0 ] );
        }
    }

    moveStartHandleTo( absoluteX, absoluteY ) {
        if ( this.startHandle ) {
            this.absoluteCommand[ 0 ] = absoluteX;
            this.absoluteCommand[ 1 ] = absoluteY;
            this.parse( PathParser.parseRaw( this.absolute().join( " " ) )[ 0 ] );
        }
    }

    moveEndHandleTo( absoluteX, absoluteY ) {
        if ( this.endHandle ) {
            switch ( this.commandLetter.toLowerCase() ) {
                case "s":
                    this.absoluteCommand[ 0 ] = absoluteX;
                    this.absoluteCommand[ 1 ] = absoluteY;
                    break;
                case "c":
                    this.absoluteCommand[ 2 ] = absoluteX;
                    this.absoluteCommand[ 3 ] = absoluteY;
                    break;
                default:
                    break;
            }
            this.parse( PathParser.parseRaw( this.absolute().join( " " ) )[ 0 ] );
        }
    }

    scaleCommand( scaleX = 1, scaleY = 1 ) {
        switch ( this.commandLetter.toLowerCase() ) {
            case "h":
                this.absoluteCommand[ 1 ] *= scaleX;
                break;
            case "v":
                this.absoluteCommand[ 1 ] *= scaleY;
                break;
            case "m":
            case "l":
            case "t":
            case "a":
                // this.absoluteCommand[ 0 ] *= scaleX;
                // this.absoluteCommand[ 1 ] *= scaleY;
                this.absoluteCommand[ this.absoluteCommand.length - 2 ] *= scaleX;
                this.absoluteCommand[ this.absoluteCommand.length - 1 ] *= scaleY;
                break;
            case "s":
            case "q":
                this.absoluteCommand[ 0 ] *= scaleX;
                this.absoluteCommand[ 1 ] *= scaleY;
                this.absoluteCommand[ 2 ] *= scaleX;
                this.absoluteCommand[ 3 ] *= scaleY;
                break;
            case "c":
                this.absoluteCommand[ 0 ] *= scaleX;
                this.absoluteCommand[ 1 ] *= scaleY;
                this.absoluteCommand[ 2 ] *= scaleX;
                this.absoluteCommand[ 3 ] *= scaleY;
                this.absoluteCommand[ 4 ] *= scaleX;
                this.absoluteCommand[ 5 ] *= scaleY;
                break;
            case "z": break;
            default: break;
        }
        this.parse( PathParser.parseRaw( this.absolute().join( " " ) )[ 0 ] );
        if ( this.next ) {
            this.next.absolutePrevious = [ this.next.absolutePrevious[ 0 ] * scaleX, this.next.absolutePrevious[ 1 ] * scaleY ];
            this.next.parse( PathParser.parseRaw( this.next.absolute().join( " " ) )[ 0 ] );
        }
    }

    quadPolyLine() {
        const polyLineCoordinates = [];
        let currentNode = this;
        if ( this.commandLetter.toLowerCase() !== "q" ) return polyLineCoordinates;
        let start = [
            currentNode.absolutePrevious[ 0 ] + currentNode.relativeCommand[ 0 ],
            currentNode.absolutePrevious[ 1 ] + currentNode.relativeCommand[ 1 ]
        ];
        while ( currentNode.next && currentNode.next.commandLetter.toLowerCase() === "t" ) {
            const distance = [
                currentNode.absoluteCommand[ currentNode.absoluteCommand.length - 2 ] - start[ 0 ],
                currentNode.absoluteCommand[ currentNode.absoluteCommand.length - 1 ] - start[ 1 ]
            ];
            const end = [
                currentNode.absoluteCommand[ currentNode.absoluteCommand.length - 2 ] + distance[ 0 ],
                currentNode.absoluteCommand[ currentNode.absoluteCommand.length - 1 ] + distance[ 1 ]
            ];
            polyLineCoordinates.push( [ start, end ] );
            currentNode = currentNode.next;
            start = end;
        }
        polyLineCoordinates.push( currentNode.absoluteCommand.slice( currentNode.absoluteCommand.length - 2 ) );
        return polyLineCoordinates;
    }

}

export class Path {

    static quadratic( x1, y1, cx, cy, x2, y2 ){
        return [
          ( x1 / 3 ) + ( cx / 3 * 2 ),
          ( y1 / 3 ) + ( cy / 3 * 2 ),
          ( x2 / 3 ) + ( cx / 3 * 2 ),
          ( y2 / 3 ) + ( cy / 3 * 2 ),
          x2,
          y2
        ]
    }

    constructor( descriptor ) {
        this.parse( descriptor );
    }

    toString() {
        return this.parsedCommands.map( command => command.toString() ).join( " " ) + " Z";
    }

    absolute() {
        return this.parsedCommands.map( command => command.absolute().join( " " ) ).join( " " ) + " Z";
    }

    relative() {
        return this.parsedCommands.map( command => command.relative().join( " " ) ).join( " " ) + " z";
    }

    normalized() {
        return this.parsedCommands.map( command => command.normalizedCommand ).join( " " ) + " Z";
    }

    parse( descriptor ) {
        let quadX, quadY, 
            bezierX, bezierY,
            previous = [ 0, 0 ],
            previousPathCommand = { next: null };
        this.parsedCommands = PathParser.parseRaw( descriptor ).reduce( ( result, command, index ) => {
            if ( command[ 0 ].toLowerCase() === "z" ) return result;
            const newPathCommand = new PathCommand( command, previous, index );
            previousPathCommand.next = newPathCommand;
            previous = newPathCommand.absoluteNext;
            let normalizedCommand;
            switch ( command[ 0 ].toLowerCase() ) {
                case "h":
                    normalizedCommand = [
                        ...newPathCommand.absolutePrevious,
                        newPathCommand.absoluteCommand[ 0 ], newPathCommand.absolutePrevious[ 1 ],
                        newPathCommand.absoluteCommand[ 0 ], newPathCommand.absolutePrevious[ 1 ],
                    ];
                    break;
                case "v":
                    normalizedCommand = [
                        ...newPathCommand.absolutePrevious,
                        newPathCommand.absolutePrevious[ 0 ], newPathCommand.absoluteCommand[ 1 ],
                        newPathCommand.absolutePrevious[ 0 ], newPathCommand.absoluteCommand[ 1 ],
                    ];
                    break;
                case "m":
                case "l":
                    normalizedCommand = [
                        ...newPathCommand.absolutePrevious,
                        ...newPathCommand.absoluteCommand,
                        ...newPathCommand.absoluteCommand
                    ];
                    break;
                case "s":
                    let cx = newPathCommand.absolutePrevious[ 0 ], cy = newPathCommand.absolutePrevious[ 1 ];
                    if ( [ "c", "s" ].includes( previousPathCommand.commandLetter.toLowerCase() ) ) {
                        cx += cx - bezierX;
                        cy += cy - bezierY;
                    }
                    normalizedCommand = [
                        cx,
                        cy,
                        newPathCommand.absoluteCommand[ 0 ],
                        newPathCommand.absoluteCommand[ 1 ],
                        newPathCommand.absoluteCommand[ 2 ],
                        newPathCommand.absoluteCommand[ 3 ]
                    ];
                    break;
                case "q":
                    quadX = newPathCommand.absoluteCommand[ 0 ];
                    quadY = newPathCommand.absoluteCommand[ 1 ];
                    normalizedCommand = [
                        newPathCommand.absolutePrevious[ 0 ] / 3 + ( 2 / 3 ) * newPathCommand.absoluteCommand[ 0 ],
                        newPathCommand.absolutePrevious[ 1 ] / 3 + ( 2 / 3 ) * newPathCommand.absoluteCommand[ 1 ],
                        newPathCommand.absoluteCommand[ 2 ] / 3 + ( 2 / 3 ) * newPathCommand.absoluteCommand[ 0 ],
                        newPathCommand.absoluteCommand[ 3 ] / 3 + ( 2 / 3 ) * newPathCommand.absoluteCommand[ 1 ],
                        newPathCommand.absoluteCommand[ 2 ],
                        newPathCommand.absoluteCommand[ 3 ]
                    ];
                    break;
                case "t":
                    if ( [ "q", "t" ].includes( previousPathCommand.commandLetter.toLowerCase() ) ) {
                        quadX = newPathCommand.absolutePrevious[ 0 ] * 2 - quadX;
                        quadY = newPathCommand.absolutePrevious[ 1 ] * 2 - quadY;
                    } else {
                        quadX = newPathCommand.absolutePrevious[ 0 ];
                        quadY = newPathCommand.absolutePrevious[ 1 ];
                    }
                    normalizedCommand = [
                        newPathCommand.absolutePrevious[ 0 ] / 3 + ( 2 / 3 ) * quadX,
                        newPathCommand.absolutePrevious[ 1 ] / 3 + ( 2 / 3 ) * quadY,
                        newPathCommand.absoluteCommand[ 0 ] / 3 + ( 2 / 3 ) * quadX,
                        newPathCommand.absoluteCommand[ 1 ] / 3 + ( 2 / 3 ) * quadY,
                        newPathCommand.absoluteCommand[ 0 ],
                        newPathCommand.absoluteCommand[ 1 ]
                    ];
                    break;
                case "a":
                    normalizedCommand = arcToCubicBeziers( newPathCommand.absolutePrevious, newPathCommand.absoluteCommand );
                    break;
                case "c":
                    normalizedCommand = newPathCommand.absoluteCommand;
                    break;
                default: break;
            }
            newPathCommand.setNormalized( index ? "C " + normalizedCommand.flat().join( " " ) : "M " + newPathCommand.absoluteCommand.join( " " ) );
            previousPathCommand = newPathCommand;
            if ( newPathCommand.absoluteCommand.length > 3 ) {
                bezierX = newPathCommand.absoluteCommand[ newPathCommand.absoluteCommand.length - 4 ];
                bezierY = newPathCommand.absoluteCommand[ newPathCommand.absoluteCommand.length - 3 ];
            } else {
                bezierX = newPathCommand.absolutePrevious[ 0 ];
                bezierY = newPathCommand.absolutePrevious[ 1 ];
            }
            return [ ...result, newPathCommand ];
        }, [] );
    }

    // parse( descriptor ) {
    //     let previous = [ 0, 0 ], previousPathCommand = { next: null };
    //     this.parsedCommands = PathParser.parseRaw( descriptor ).reduce( ( result, command, index ) => {
    //         if ( command[ 0 ].toLowerCase() === "z" ) return result;
    //         const newPathCommand = new PathCommand( command, previous, index );
    //         previousPathCommand.next = newPathCommand;
    //         previous = newPathCommand.absoluteNext;
    //         previousPathCommand = newPathCommand;
    //         return [ ...result, newPathCommand ];
    //     }, [] );
    // }

    adjustDescriptorPoint( index, absoluteX, absoluteY ) {
        this.parsedCommands[ index ].moveCommand( absoluteX, absoluteY, true );
    }

    adjustStartHandlePoint( index, absoluteX, absoluteY ) {
        this.parsedCommands[ index ].moveStartHandleTo( absoluteX, absoluteY );
    }

    adjustEndHandlePoint( index, absoluteX, absoluteY ) {
        this.parsedCommands[ index ].moveEndHandleTo( absoluteX, absoluteY );
    }

    snapToGrid( gridInterval ) {
        this.parsedCommands.forEach( parsedCommand => parsedCommand.parse( parsedCommand.isRelative() ? parsedCommand.relative( gridInterval ) : parsedCommand.absolute( gridInterval ) ) );
    }

    translate( relativeX, relativeY ) {
        this.parsedCommands.forEach( parsedCommand => parsedCommand.moveCommand(
            parsedCommand.absoluteCommand[ parsedCommand.absoluteCommand.length - 2 ] + relativeX,
            parsedCommand.absoluteCommand[ parsedCommand.absoluteCommand.length - 1 ] + relativeY,
        ) );
    }

    scale( scaleX, scaleY ) {
        this.parsedCommands.forEach( parsedCommand => parsedCommand.scaleCommand( scaleX, scaleY ) );
    }

    // boundingBox() {
    // }

}
