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

    static components( type, path, cursor ) {
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

    static parse( path ) {
        let cursor = 0, parsedComponents = [];
        while ( cursor < path.length ) {
            const match = path.slice( cursor ).match( this.validCommand );
            if ( match !== null ) {
                const command = match[ 1 ];
                cursor += match[ 0 ].length;
                const componentList = PathParser.components( command, path, cursor );
                cursor = componentList[ 0 ];
                parsedComponents = [ ...parsedComponents, ...componentList[1] ];
            } else {
                throw new Error(  `Invalid path: first error at char ${ cursor }`  );
            }
        }
        return parsedComponents;
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
//   ];

// testShapes.forEach( shape => console.log( PathParser.parse( shape ) ) );

// console.log( PathParser.parse( "m l 250 a -400, -350 ." ) );