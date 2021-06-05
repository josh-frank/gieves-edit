const round = ( value, decimals ) => Number( Math.round( value + 'e' + decimals ) + 'e-' + decimals );

class PathParser {

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

    static parseDescriptor( path ) {
        let currentPoint = [ 0, 0 ], nextPoint;
        return PathParser.parseRaw( path ).reduce( ( result, command ) => {
            if ( command[ 0 ].toLowerCase() === "z" ) return result;
            nextPoint = this.pointGrammar[ command[ 0 ] ]( currentPoint, command );
            const relativeDistance = [ nextPoint[ 0 ] - currentPoint[ 0 ], nextPoint[ 1 ] - currentPoint[ 1 ] ];
            const coordinatesParsedFromCommand = {
                command: command.join( " " ),
                point: nextPoint,
                previousPoint: currentPoint,
                relative: relativeDistance,
            };
            switch ( command[ 0 ].toLowerCase() ) {
                case "c":
                    coordinatesParsedFromCommand.startHandle = [
                        currentPoint[ 0 ],
                        currentPoint[ 1 ],
                        currentPoint[ 0 ] + command[ 1 ],
                        currentPoint[ 1 ] + command[ 2 ]
                    ];
                    coordinatesParsedFromCommand.endHandle = [
                        nextPoint[ 0 ],
                        nextPoint[ 1 ],
                        currentPoint[ 0 ] + command[ 3 ],
                        currentPoint[ 1 ] + command[ 4 ]
                    ];
                    break;
                case "q":
                    coordinatesParsedFromCommand.startHandle = [
                        nextPoint[ 0 ],
                        nextPoint[ 1 ],
                        currentPoint[ 0 ] + command[ 1 ],
                        currentPoint[ 1 ] + command[ 2 ]
                    ];
                    break;
                case "s":
                    coordinatesParsedFromCommand.endHandle = [
                        nextPoint[ 0 ],
                        nextPoint[ 1 ],
                        currentPoint[ 0 ] + command[ 1 ],
                        currentPoint[ 1 ] + command[ 2 ]
                    ];
                    break;
                default: break;
            }
            currentPoint = nextPoint;
            return [ ...result, coordinatesParsedFromCommand ];
        }, [] );
    }

    static adjustDescriptorPoint( path, command, xChange, yChange ) {
        const parsedPath = PathParser.parseRaw( path );
        const parsedCommand = PathParser.parseRaw( command )[ 0 ];
        const commandIndex = parsedPath.findIndex( otherCommand => otherCommand.join( " " ) === parsedCommand.join( " " ) );
        for ( let indexToAdjust of [ commandIndex, parsedCommand[ 0 ] === "z" ? 0 : commandIndex + 1 ] ) {
            switch ( parsedPath[ indexToAdjust ][ 0 ].toLowerCase() ) {
                case "h":
                    parsedPath[ indexToAdjust ][ 1 ] += indexToAdjust === commandIndex ? xChange : -xChange;
                    break;
                case "v":
                    parsedPath[ indexToAdjust ][ 1 ] += indexToAdjust === commandIndex ? yChange : -yChange;
                    break;
                case "m":
                case "l":
                case "a":
                case "c":
                case "t":
                case "q":
                case "s":
                    parsedPath[ indexToAdjust ][ parsedPath[ indexToAdjust ].length - 2 ] += indexToAdjust === commandIndex ? xChange : -xChange;
                    parsedPath[ indexToAdjust ][ parsedPath[ indexToAdjust ].length - 1 ] += indexToAdjust === commandIndex ? yChange : -yChange;
                    break;
                case "z": break;
                default: break;
            }
        };
        return parsedPath.flat().join( " " );
    }

    static adjustStartHandlePoint( path, command, xChange, yChange ) {
        const parsedPath = PathParser.parseRaw( path );
        const parsedCommand = PathParser.parseRaw( command )[ 0 ];
        const commandIndex = parsedPath.findIndex( otherCommand => otherCommand.join( " " ) === parsedCommand.join( " " ) );
        parsedPath[ commandIndex ][ 1 ] += xChange;
        parsedPath[ commandIndex ][ 2 ] += yChange;
        return parsedPath.flat().join( " " );
    }

    static adjustEndHandlePoint( path, command, xChange, yChange ) {
        const parsedPath = PathParser.parseRaw( path );
        const parsedCommand = PathParser.parseRaw( command )[ 0 ];
        const commandIndex = parsedPath.findIndex( otherCommand => otherCommand.join( " " ) === parsedCommand.join( " " ) );
        switch ( command[ 0 ] ) {
            case "s":
                parsedPath[ commandIndex ][ 1 ] += xChange;
                parsedPath[ commandIndex ][ 2 ] += yChange;
                break;
            case "c":
                parsedPath[ commandIndex ][ 3 ] += xChange;
                parsedPath[ commandIndex ][ 4 ] += yChange;
                break;
            default:
                break;
        }
        return parsedPath.flat().join( " " );
    }

    static snapPathToGrid( path, gridInterval ) {
        return PathParser.parseRaw( path ).map( command => 
            command[ 0 ] === "a" ? command.map( ( element, index ) => [ 4, 5 ].includes( index ) ? element.toString() : element ) : command
        ).flat().map( commandElement => 
            typeof commandElement === "string" ? commandElement : Math.round( commandElement / gridInterval ) * gridInterval
        ).join( " " );
    }

}

class PathCommand {

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
                break;
            case "C":
                this.absoluteCommand = parsedCommand.slice( 1 );
                this.relativeCommand = [
                    this.absoluteCommand[ 0 ] - absolutePrevious[ 0 ],
                    this.absoluteCommand[ 1 ] - absolutePrevious[ 1 ],
                    this.absoluteCommand[ 2 ] - absolutePrevious[ 0 ],
                    this.absoluteCommand[ 3 ] - absolutePrevious[ 1 ]
                ].concat( this.relativeCommand );
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
                break;
            case "S":
            case "Q":
                this.absoluteCommand = parsedCommand.slice( 1 );
                this.relativeCommand = [
                    this.absoluteCommand[ 0 ] - absolutePrevious[ 0 ],
                    this.absoluteCommand[ 1 ] - absolutePrevious[ 1 ]
                ].concat( this.relativeCommand );
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

class Path {

    constructor( descriptor ) {
        this.descriptor = descriptor;
        this.rawCommands = PathParser.parseRaw( descriptor );
        this.parse();
    }

    toString() { return this.rawCommands.flat().join( " " ); }

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
                return !index || ( rawCommand[ 0 ] === "a" && index < 6 ) ? parameter : round( parameter / gridInterval, 0 ) * gridInterval;
            } );
        } );
        this.parse();
    }

}

// export default PathParser;

// const testShapes = [
//     "m 50,50 l 100,0 l 0,100 l -100,0 z",
//     "m 300 300 a 50 50 90 1 1 100 0 a 50 50 90 1 1 -100 0 z",
//     "m 744 136 h -202 c -10 0 -18 8 -18 18 h 238 c 0 -10 -8 -18 -18 -18 z",
//     "m 240 200 v -20 a 20 20 90 1 1 40 40 l -40 -20 z",
//     "m 80 508 s 70 -54 60 -138 s 66 -98 150 -50 z",
//     "m 628 356 l 192 -224 l 96 -32 l -32 96 l -224 192 c 32 32 32 64 64 30 c 0 32 32 64 0 64 a 45.44 45.44 90 0 1 -32 32 a 160 160 90 0 0 -64 -96 q -16 -3.2 -16 16 t -48 41.6 t -25.6 -25.6 t 41.6 -48 t 16 -16 a 160 160 90 0 0 -96 -64 a 45.44 45.44 90 0 1 32 -32 c 0 -32 32 0 64 0 c -32 32 0 32 32 66 l 192 -224 l 0 64 l 64 0 l -57.6 -6.4 l -6.4 -57.6 z"
// ];

// const sameShape = [
//     "m 25,25 l 50,0 l 0,50 l -50,0 z",
//     "M 25 25 L 75 25 L 75 75 L 25 75 Z",
//     "m 25,25 l 50,0  L 75 75 L 25 75 Z"
// ];

// const sameShape = [
//     "M 628 356 L 820 132 L 916 100 L 884 196 L 660 388 C 692 420 692 452 724 418 C 724 450 756 482 724 482 A 45.44 45.44 90 0 1 692 514 A 160 160 90 0 0 628 418 Q 612 414.8 612 434 T 564 475.6 T 538.4 450 T 580 402 T 596 386 A 160 160 90 0 0 500 322 A 45.44 45.44 90 0 1 532 290 C 532 258 564 290 596 290 C 564 322 596 322 628 356 L 820 132 L 820 196 L 884 196 L 826.4 189.6 L 820 132 Z",
//     "m 628 356 l 192 -224 l 96 -32 l -32 96 l -224 192 c 32 32 32 64 64 30 c 0 32 32 64 0 64 a 45.44 45.44 90 0 1 -32 32 a 160 160 90 0 0 -64 -96 q -16 -3.2 -16 16 t -48 41.6 t -25.6 -25.6 t 41.6 -48 t 16 -16 a 160 160 90 0 0 -96 -64 a 45.44 45.44 90 0 1 32 -32 c 0 -32 32 0 64 0 c -32 32 0 32 32 66 l 192 -224 l 0 64 l 64 0 l -57.6 -6.4 l -6.4 -57.6 z"
// ];

// testShapes.forEach( shape => console.log( PathParser.parseRaw( shape ) ) );

// console.log( PathParser.parseRaw( "m l 250 a -400, -350 ." ) );

// console.log( PathParser.parseDescriptor( sameShape[ 0 ] ) );
// console.log( PathParser.parseDescriptor( sameShape[ 1 ] ) );

// console.log( PathParser.adjustDescriptorPoint( testShapes[ 5 ], "l -224 192", 10, 10 ) );

// const test = new PathCommand( PathParser.parseRaw("c 32 32 32 64 64 30 ")[0], [660, 388] );
// const test = new PathCommand( PathParser.parseRaw("c 0 32 32 64 0 64")[0], [724, 418] );
// const test = new PathCommand( PathParser.parseRaw("m 10 10")[0], [0, 0] );

// const testShape = new Path( testShapes[ 2 ] );
// console.log( testShape.toString() );
// testShape.snapToGrid( 5 )
// console.log( testShape.toString() );

// console.log( test );
