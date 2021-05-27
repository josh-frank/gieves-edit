const splitDescriptorByCommands = /\s(?=[AaCcHhLlMmQqSsTtVvZz])/;
const splitCommandByParameters = /[\s,]/;

function parseDescriptor( descriptor ) {
    const result = {};
    const splitDescriptor = descriptor.split( splitDescriptorByCommands );
    let currentPoint, nextPoint;
    splitDescriptor.forEach( command => {
        const splitCommand = command.split( splitCommandByParameters );
        switch ( command[ 0 ] ) {
            case "m":
            case "M":
                currentPoint = [ parseInt( splitCommand[ 1 ] ), parseInt( splitCommand[ 2 ] ) ];
                break;
            case "l":
                nextPoint = [ currentPoint[ 0 ] + parseInt( splitCommand[ 1 ] ), currentPoint[ 1 ] + parseInt( splitCommand[ 2 ] ) ];
                currentPoint = nextPoint;
                break;
            case "L":
                nextPoint = [ parseInt( splitCommand[ 1 ] ), parseInt( splitCommand[ 2 ] ) ];
                currentPoint = nextPoint;
                break;
            case "a":
                nextPoint = [
                    currentPoint[ 0 ] + parseInt( splitCommand[ splitCommand.length - 2 ] ),
                    currentPoint[ 1 ] + parseInt( splitCommand[ splitCommand.length - 1 ] )
                ];
                currentPoint = nextPoint;
                break;
            case "A":
                nextPoint = [ parseInt( splitCommand[ splitCommand.length - 2 ] ), parseInt( splitCommand[ splitCommand.length - 1 ] ) ];
                currentPoint = nextPoint;
                break;
            case "c":
                break;
            case "C":
                break;
            case "t":
                nextPoint = [
                    currentPoint[ 0 ] + parseInt( splitCommand[ splitCommand.length - 2 ] ),
                    currentPoint[ 1 ] + parseInt( splitCommand[ splitCommand.length - 1 ] )
                ];
                currentPoint = nextPoint;
                break;
            case "T":
                nextPoint = [ parseInt( splitCommand[ splitCommand.length - 2 ] ), parseInt( splitCommand[ splitCommand.length - 1 ] ) ];
                currentPoint = nextPoint;
                break;
            default: break;
        }
        result[ command ] = { ...result[ command ], point: currentPoint };
    } );
    // return [ ...new Set( result.map( coordinates => coordinates.toString() ) ) ].map( coordinates => coordinates.split( "," ).map( element => parseInt( element ) ) );
    return result;
}

export { parseDescriptor };