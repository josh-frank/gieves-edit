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
        m: ( point, command ) => [ point[ 0 ] + command[ 1 ], point[ 1 ] + command[ 2 ] ],
        M: ( point, command ) => command.slice( 1 ),
        h: ( point, command ) => [ point[ 0 ] + command[ 1 ], point[ 1 ] ],
        H: ( point, command ) => [ command[ 1 ], point[ 1 ] ],
        v: ( point, command ) => [ point[ 0 ], point[ 1 ] + command[ 1 ] ],
        V: ( point, command ) => [ point[ 0 ], command[ 1 ] ],
        l: ( point, command ) => [ point[ 0 ] + command[ 1 ], point[ 1 ] + command[ 2 ] ],
        L: ( point, command ) => command.slice( 1 ),
        a: ( point, command ) => [ point[ 0 ] + command[ 6 ], point[ 1 ] + command[ 7 ] ],
        A: ( point, command ) => command.slice( 6 ),
        c: ( point, command ) => [ point[ 0 ] + command[ 5 ], point[ 1 ] + command[ 6 ] ],
        C: ( point, command ) => command.slice( 5 ),
        t: ( point, command ) => [ point[ 0 ] + command[ 1 ], point[ 1 ] + command[ 2 ] ],
        T: ( point, command ) => command.slice( 1 ),
        q: ( point, command ) => [ point[ 0 ] + command[ 3 ], point[ 1 ] + command[ 4 ] ],
        Q: ( point, command ) => command.slice( 3 ),
        s: ( point, command ) => [ point[ 0 ] + command[ 3 ], point[ 1 ] + command[ 4 ] ],
        S: ( point, command ) => command.slice( 3 ),
    };

    static parseComponents( type, path, cursor ) {
        const expectedCommands = this.pathGrammar[ type.toLowerCase() ];
        const components = [];
        while ( cursor <= path.length ) {
            const component = [ type ];
            for ( const regex of expectedCommands ) {
                const match = path.slice( cursor ).match( regex );
                if ( match !== null ) {
                    component.push( parseInt( match[ 0 ] ) );
                    cursor += match[ 0 ].length;
                    const nextSlice = path.slice( cursor ).match( this.validComma );
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
            const coordinatesParsedFromCommand = {
                command: command.join( " " ),
                absolute: nextPoint,
                relative: [ nextPoint[ 0 ] - currentPoint[ 0 ], nextPoint[ 1 ] - currentPoint[ 1 ] ]
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

}

export default PathParser;

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

// testShapes.forEach( shape => console.log( PathParser.parseRaw( shape ) ) );

// console.log( PathParser.parseRaw( "m l 250 a -400, -350 ." ) );

// console.log( PathParser.parseDescriptor( sameShape[ 0 ] ) );
// console.log( PathParser.parseDescriptor( sameShape[ 1 ] ) );

// console.log( PathParser.parseDescriptor( testShapes[ 1 ] ) );
