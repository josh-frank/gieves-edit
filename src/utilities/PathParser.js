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
        m: ( previousPoint, command ) => [ previousPoint[ 0 ] + command[ 1 ], previousPoint[ 1 ] + command[ 2 ] ],
        M: ( previousPoint, command ) => command.slice( 1 ),
        h: ( previousPoint, command ) => [ previousPoint[ 0 ] + command[ 1 ], previousPoint[ 1 ] ],
        H: ( previousPoint, command ) => [ command[ 1 ], previousPoint[ 1 ] ],
        v: ( previousPoint, command ) => [ previousPoint[ 0 ], previousPoint[ 1 ] + command[ 1 ] ],
        V: ( previousPoint, command ) => [ previousPoint[ 0 ], command[ 1 ] ],
        l: ( previousPoint, command ) => [ previousPoint[ 0 ] + command[ 1 ], previousPoint[ 1 ] + command[ 2 ] ],
        L: ( previousPoint, command ) => command.slice( 1 ),
        a: ( previousPoint, command ) => [ previousPoint[ 0 ] + command[ 6 ], previousPoint[ 1 ] + command[ 7 ] ],
        A: ( previousPoint, command ) => command.slice( 6 ),
        c: ( previousPoint, command ) => [ previousPoint[ 0 ] + command[ 5 ], previousPoint[ 1 ] + command[ 6 ] ],
        C: ( previousPoint, command ) => command.slice( 5 ),
        t: ( previousPoint, command ) => [ previousPoint[ 0 ] + command[ 1 ], previousPoint[ 1 ] + command[ 2 ] ],
        T: ( previousPoint, command ) => command.slice( 1 ),
        q: ( previousPoint, command ) => [ previousPoint[ 0 ] + command[ 3 ], previousPoint[ 1 ] + command[ 4 ] ],
        Q: ( previousPoint, command ) => command.slice( 3 ),
        s: ( previousPoint, command ) => [ previousPoint[ 0 ] + command[ 3 ], previousPoint[ 1 ] + command[ 4 ] ],
        S: ( previousPoint, command ) => command.slice( 3 ),
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

export class PathCommand {

    constructor( parsedCommand, absolutePrevious ) {
        this.parsedCommand = parsedCommand;
        this.absolutePrevious = absolutePrevious.map( coordinate => round( coordinate, 1 ) );
        this.absoluteNext = PathParser.pointGrammar[ parsedCommand[ 0 ] ]( absolutePrevious, parsedCommand ).map( coordinate => round( coordinate, 1 ) );
        this.absoluteCommand = [ ...this.absoluteNext ];
        this.relativeCommand = [ round( this.absoluteNext[ 0 ] - absolutePrevious[ 0 ], 1 ), round( this.absoluteNext[ 1 ] - absolutePrevious[ 1 ], 1 ) ]
        switch( parsedCommand[ 0 ] ) {
            case "c":
                this.absoluteCommand = [
                    absolutePrevious[ 0 ] + parsedCommand[ 1 ],
                    absolutePrevious[ 1 ] + parsedCommand[ 2 ],
                    absolutePrevious[ 0 ] + parsedCommand[ 3 ],
                    absolutePrevious[ 1 ] + parsedCommand[ 4 ]
                ].concat( this.absoluteCommand );
                this.relativeCommand = [
                    this.absoluteCommand[ 0 ] - absolutePrevious[ 0 ],
                    this.absoluteCommand[ 1 ] - absolutePrevious[ 1 ],
                    this.absoluteCommand[ 2 ] - absolutePrevious[ 0 ],
                    this.absoluteCommand[ 3 ] - absolutePrevious[ 1 ],
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
                    this.absoluteCommand[ 0 ] - absolutePrevious[ 0 ],
                    this.absoluteCommand[ 1 ] - absolutePrevious[ 1 ],
                    this.absoluteCommand[ 2 ] - absolutePrevious[ 0 ],
                    this.absoluteCommand[ 3 ] - absolutePrevious[ 1 ]
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
                    absolutePrevious[ 0 ] + parsedCommand[ 1 ],
                    absolutePrevious[ 1 ] + parsedCommand[ 2 ],
                ].concat( this.absoluteCommand );
                this.relativeCommand = [
                    this.absoluteCommand[ 0 ] - absolutePrevious[ 0 ],
                    this.absoluteCommand[ 1 ] - absolutePrevious[ 1 ]
                ].concat( this.relativeCommand );
                this.startHandle = [
                    this.absoluteNext[ 0 ],
                    this.absoluteNext[ 1 ],
                    this.absolutePrevious[ 0 ] + this.relativeCommand[ 0 ],
                    this.absolutePrevious[ 1 ] + this.relativeCommand[ 1 ]
                ];
                break;
            case "S":
            case "Q":
                this.absoluteCommand = parsedCommand.slice( 1 );
                this.relativeCommand = [
                    this.absoluteCommand[ 0 ] - absolutePrevious[ 0 ],
                    this.absoluteCommand[ 1 ] - absolutePrevious[ 1 ]
                ].concat( this.relativeCommand );
                this.startHandle = [
                    this.absoluteNext[ 0 ],
                    this.absoluteNext[ 1 ],
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

}

export class Path {

    constructor( descriptor ) {
        this.descriptor = descriptor;
        this.rawCommands = PathParser.parseRaw( descriptor );
        this.parse();
    }

    toString() { return this.rawCommands.flat().join( " " ); }

    absolute() {
        return this.parsedCommands.map( command => {
            return `${ command.parsedCommand[ 0 ].toUpperCase() } ` + (
                command.parsedCommand[ 0 ].toLowerCase() === "h" ? command.absoluteCommand.slice( 0, 1 ).join( " " ) : 
                command.parsedCommand[ 0 ].toLowerCase() === "v" ? command.absoluteCommand.slice( 1 ).join( " " ) :
                command.absoluteCommand.join( " " ) );
        } ).join( " " ) + " Z";
    }

    relative() {
        return this.parsedCommands.map( command => {
            return `${ command.parsedCommand[ 0 ].toLowerCase() } ` + (
                command.parsedCommand[ 0 ].toLowerCase() === "h" ? command.relativeCommand.slice( 0, 1 ).join( " " ) : 
                command.parsedCommand[ 0 ].toLowerCase() === "v" ? command.relativeCommand.slice( 1 ).join( " " ) :
                command.relativeCommand.join( " " ) );
        } ).join( " " ) + " z";
    }

    parse() {
        let previous = [ 0, 0 ];
        this.parsedCommands = this.rawCommands.reduce( ( result, command ) => {
            if ( command[ 0 ].toLowerCase() === "z" ) return result;
            const newPathCommand = new PathCommand( command, previous );
            previous = newPathCommand.absoluteNext;
            return [ ...result, newPathCommand ];
        }, [] );
    }

    adjustDescriptorPoint( command, xChange, yChange ) {
        const parsedCommand = PathParser.parseRaw( command )[ 0 ];
        const commandIndex = this.rawCommands.findIndex( otherCommand => otherCommand.join( " " ) === parsedCommand.join( " " ) );
        for ( let indexToAdjust of [ commandIndex, parsedCommand[ 0 ] === "z" ? 0 : commandIndex + 1 ] ) {
            switch ( this.rawCommands[ indexToAdjust ][ 0 ].toLowerCase() ) {
                case "h":
                    this.rawCommands[ indexToAdjust ][ 1 ] += indexToAdjust === commandIndex ? xChange : -xChange;
                    break;
                case "v":
                    this.rawCommands[ indexToAdjust ][ 1 ] += indexToAdjust === commandIndex ? yChange : -yChange;
                    break;
                case "m":
                case "l":
                case "a":
                case "c":
                case "t":
                case "q":
                case "s":
                    this.rawCommands[ indexToAdjust ][ this.rawCommands[ indexToAdjust ].length - 2 ] += indexToAdjust === commandIndex ? xChange : -xChange;
                    this.rawCommands[ indexToAdjust ][ this.rawCommands[ indexToAdjust ].length - 1 ] += indexToAdjust === commandIndex ? yChange : -yChange;
                    break;
                case "z": break;
                default: break;
            }
        };
        this.parse();
    }

    adjustStartHandlePoint( command, xChange, yChange ) {
        const parsedCommand = PathParser.parseRaw( command )[ 0 ];
        const commandIndex = this.rawCommands.findIndex( otherCommand => otherCommand.join( " " ) === parsedCommand.join( " " ) );
        this.rawCommands[ commandIndex ][ 1 ] += xChange;
        this.rawCommands[ commandIndex ][ 2 ] += yChange;
        this.parse();
    }

    adjustEndHandlePoint( command, xChange, yChange ) {
        const parsedCommand = PathParser.parseRaw( command )[ 0 ];
        const commandIndex = this.rawCommands.findIndex( otherCommand => otherCommand.join( " " ) === parsedCommand.join( " " ) );
        switch ( command[ 0 ] ) {
            case "s":
                this.rawCommands[ commandIndex ][ 1 ] += xChange;
                this.rawCommands[ commandIndex ][ 2 ] += yChange;
                break;
            case "c":
                this.rawCommands[ commandIndex ][ 3 ] += xChange;
                this.rawCommands[ commandIndex ][ 4 ] += yChange;
                break;
            default:
                break;
        }
        this.parse();
    }

    snapToGrid( gridInterval ) {
        this.rawCommands = this.rawCommands.map( rawCommand => {
            return rawCommand.map( ( parameter, index ) => {
                return !index || ( rawCommand[ 0 ] === "a" && index < 6 ) ? parameter : round( parameter / gridInterval, 1 ) * gridInterval;
            } );
        } );
        this.parse();
    }

}
