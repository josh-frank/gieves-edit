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
        const expectedRegexList = this.pathGrammar[ type.toLowerCase() ];
        const components = [];
        while ( cursor <= path.length ) {
            const component = [ type ];
            for ( const regex of expectedRegexList ) {
                const match = path.slice( cursor ).match( regex );
                if ( match !== null ) {
                    component.push( match[ 0 ] );
                    cursor += match[ 0 ].length;
                    const ws = path.slice( cursor ).match( this.validComma );
                    if ( ws !== null ) cursor += ws[ 0 ].length;
                } else if ( component.length === 1 ) {
                    return [ cursor, components ];
                } else {
                    throw new Error( 'malformed path (first error at ' + cursor + ')' );
                }
            }
            components.push( component );
            if ( expectedRegexList.length === 0 ) return [ cursor, components ];
            if ( type === 'm' ) type = 'l';
            if ( type === 'M' ) type = 'L';
        }
        throw new Error('malformed path (first error at ' + cursor + ')');
    }

    static parse( path ) {
        let cursor = 0, tokens = [];
        while ( cursor < path.length ) {
            const match = path.slice( cursor ).match( this.validCommand );
            if ( match !== null ) {
                const command = match[ 1 ];
                cursor += match[ 0 ].length;
                const componentList = PathParser.components( command, path, cursor );
                cursor = componentList[ 0 ];
                tokens = [ ...tokens, ...componentList[1] ];
            } else {
                throw new Error( 'malformed path (first error at ' + cursor + ')' );
            }
        }
        return tokens;
    }

}

export default PathParser;
