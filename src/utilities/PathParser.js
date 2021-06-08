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
                    component.push( round( match[ 0 ], 1 ) );
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
        this.absolutePrevious = absolutePrevious.map( coordinate => round( coordinate, 1 ) );
        this.parse( parsedCommand );
    }

    setNext( nextPathCommand ) {
        this.next = nextPathCommand;
    }

    parse( parsedCommand ) {
        this.absoluteNext = PathParser.pointGrammar[ parsedCommand[ 0 ] ]( parsedCommand, this.absolutePrevious ).map( coordinate => round( coordinate, 1 ) );
        this.absoluteCommand = [ ...this.absoluteNext ];
        this.relativeCommand = [ round( this.absoluteNext[ 0 ] - this.absolutePrevious[ 0 ], 1 ), round( this.absoluteNext[ 1 ] - this.absolutePrevious[ 1 ], 1 ) ]
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

    absolute( gridInterval ) {
        const snappedCommand = gridInterval && this.absoluteCommand.map( parameter => round( parameter / gridInterval, 1 ) * gridInterval );
        return [ this.commandLetter.toUpperCase(), ...(
            this.commandLetter.toLowerCase() === "h" ? ( snappedCommand || this.absoluteCommand ).slice( 0, 1 ) : 
            this.commandLetter.toLowerCase() === "v" ? ( snappedCommand || this.absoluteCommand ).slice( 1 ) :
            this.commandLetter.toLowerCase() === "a" ? [ ...this.absoluteCommand.slice( 0, 6 ), ...( snappedCommand || this.absoluteCommand ).slice( 6, 8 ) ] :
            ( snappedCommand || this.absoluteCommand ) )
        ];
    }

    relative( gridInterval ) {
        const snappedCommand = gridInterval && this.relativeCommand.map( parameter => round( parameter / gridInterval, 1 ) * gridInterval );
        return [ this.commandLetter.toLowerCase(), ...(
            this.commandLetter.toLowerCase() === "h" ? ( snappedCommand || this.relativeCommand ).slice( 0, 1 ) : 
            this.commandLetter.toLowerCase() === "v" ? ( snappedCommand || this.relativeCommand ).slice( 1 ) :
            this.commandLetter.toLowerCase() === "a" ? [ ...this.relativeCommand.slice( 0, 6 ), ...( snappedCommand || this.relativeCommand ).slice( 6, 8 ) ] :
            ( snappedCommand || this.relativeCommand ) )
        ];
    }

    moveTo( absoluteX = this.absoluteCommand[ 0 ], absoluteY = this.absoluteCommand[ 1 ], adjustPointOnly ) {
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

    constructor( descriptor ) {
        this.descriptor = descriptor;
        this.parse( descriptor );
    }

    toString( relative ) { return relative ? this.relative() : this.absolute(); }

    absolute() {
        return this.parsedCommands.map( command => command.absolute().join( " " ) ).join( " " ) + " Z";
    }

    relative() {
        return this.parsedCommands.map( command => command.relative().join( " " ) ).join( " " ) + " z";
    }

    parse( descriptor ) {
        let previous = [ 0, 0 ], previousPathCommand = { next: null };
        this.parsedCommands = PathParser.parseRaw( descriptor ).reduce( ( result, command, index ) => {
            if ( command[ 0 ].toLowerCase() === "z" ) return result;
            const newPathCommand = new PathCommand( command, previous, index );
            previousPathCommand.next = newPathCommand;
            previous = newPathCommand.absoluteNext;
            previousPathCommand = newPathCommand;
            return [ ...result, newPathCommand ];
        }, [] );
    }

    adjustDescriptorPoint( index, absoluteX, absoluteY ) {
        this.parsedCommands[ index ].moveTo( absoluteX, absoluteY, true );
    }

    adjustStartHandlePoint( index, absoluteX, absoluteY ) {
        this.parsedCommands[ index ].moveStartHandleTo( absoluteX, absoluteY );
    }

    adjustEndHandlePoint( index, absoluteX, absoluteY ) {
        this.parsedCommands[ index ].moveEndHandleTo( absoluteX, absoluteY );
    }

    snapToGrid( gridInterval ) {
        this.parsedCommands.forEach( parsedCommand => parsedCommand.parse( parsedCommand.absolute( gridInterval ) ) );
    }

    translate( relativeX, relativeY ) {
        this.parsedCommands.forEach( parsedCommand => parsedCommand.moveTo(
            parsedCommand.absoluteCommand[ parsedCommand.absoluteCommand.length - 2 ] + relativeX,
            parsedCommand.absoluteCommand[ parsedCommand.absoluteCommand.length - 1 ] + relativeY,
        ) );
    }

}
