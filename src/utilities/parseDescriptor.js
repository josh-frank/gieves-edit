const splitDescriptorByCommands = /\s(?=[AaCcHhLlMmQqSsTtVvZz])/;
const splitCommandByParameters = /[\s,]/;

function pointsFromDescriptor( descriptor ) {
    const result = [];
    const splitDescriptor = descriptor.split( splitDescriptorByCommands );
    let currentPoint, nextPoint;
    splitDescriptor.forEach( command => {
        const splitCommand = command.split( splitCommandByParameters );
        switch ( command[ 0 ] ) {
            case "m":
            case "M":
                currentPoint = [ parseInt( splitCommand[ 1 ] ), parseInt( splitCommand[ 2 ]) ];
                result.push( currentPoint );
                break;
            case "l":
                nextPoint = [ currentPoint[ 0 ] + parseInt( splitCommand[ 1 ] ), currentPoint[ 1 ] + parseInt( splitCommand[ 2 ] ) ];
                currentPoint = nextPoint;
                result.push( currentPoint );
                break;
            case "a":
                nextPoint = [
                    currentPoint[ 0 ] + parseInt( splitCommand[ splitCommand.length - 2 ] ),
                    currentPoint[ 1 ] + parseInt( splitCommand[ splitCommand.length - 1 ] )
                ];
                currentPoint = nextPoint;
                result.push( currentPoint );
                break;
            default: break;
        }
    } );
    return [ ...new Set( result.map( coordinates => coordinates.toString() ) ) ].map( coordinates => coordinates.split( "," ).map( element => parseInt( element ) ) );
}

export { pointsFromDescriptor };