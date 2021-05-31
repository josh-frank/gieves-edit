const splitDescriptorByCommands = /\s(?=[AaCcHhLlMmQqSsTtVvZz])/;
const splitCommandByParameters = /[\s,]/;

function parseDescriptor( descriptor ) {
    const result = {};
    const splitDescriptor = descriptor.split( splitDescriptorByCommands );
    let currentPoint = [ 0, 0 ], nextPoint;
    splitDescriptor.forEach( command => {
        const splitCommand = command.split( splitCommandByParameters );
        switch ( command[ 0 ] ) {
            case "m":
                nextPoint = [
                    currentPoint[ 0 ] + parseInt( splitCommand[ 1 ] ),
                    currentPoint[ 1 ] + parseInt( splitCommand[ 2 ] )
                ];
                currentPoint = nextPoint;
                break;
            case "h":
                nextPoint = [ currentPoint[ 0 ] + parseInt( splitCommand[ 1 ] ), currentPoint[ 1 ] ];
                currentPoint = nextPoint;
                break;
            case "v":
                nextPoint = [ currentPoint[ 0 ], currentPoint[ 1 ] + parseInt( splitCommand[ 1 ] ) ];
                currentPoint = nextPoint;
                break;
            case "l":
                nextPoint = [
                    currentPoint[ 0 ] + parseInt( splitCommand[ 1 ] ),
                    currentPoint[ 1 ] + parseInt( splitCommand[ 2 ] )
                ];
                currentPoint = nextPoint;
                break;
            case "a":
                nextPoint = [
                    currentPoint[ 0 ] + parseInt( splitCommand[ splitCommand.length - 2 ] ),
                    currentPoint[ 1 ] + parseInt( splitCommand[ splitCommand.length - 1 ] )
                ];
                currentPoint = nextPoint;
                break;
            case "c":
                result[ command ] = { startHandle: [
                    currentPoint[ 0 ],
                    currentPoint[ 1 ],
                    currentPoint[ 0 ] + parseInt( splitCommand[ 1 ] ),
                    currentPoint[ 1 ] + parseInt( splitCommand[ 2 ] )                    
                ] }
                result[ command ] = { ...result[ command ], endHandle: [
                    currentPoint[ 0 ] + parseInt( splitCommand[ 3 ] ),
                    currentPoint[ 1 ] + parseInt( splitCommand[ 4 ] )                    
                ] }
                nextPoint = [
                    currentPoint[ 0 ] + parseInt( splitCommand[ 5 ] ),
                    currentPoint[ 1 ] + parseInt( splitCommand[ 6 ] )
                ];
                result[ command ].endHandle.unshift( nextPoint[ 1 ] );
                result[ command ].endHandle.unshift( nextPoint[ 0 ] );
                currentPoint = nextPoint;
                break;
            case "t":
                nextPoint = [
                    currentPoint[ 0 ] + parseInt( splitCommand[ splitCommand.length - 2 ] ),
                    currentPoint[ 1 ] + parseInt( splitCommand[ splitCommand.length - 1 ] )
                ];
                currentPoint = nextPoint;
                break;
            case "q":
                nextPoint = [
                    currentPoint[ 0 ] + parseInt( splitCommand[ splitCommand.length - 2 ] ),
                    currentPoint[ 1 ] + parseInt( splitCommand[ splitCommand.length - 1 ] )
                ];
                currentPoint = nextPoint;
                break;
            case "s":
                result[ command ] = { endHandle: [
                    currentPoint[ 0 ] + parseInt( splitCommand[ 1 ] ),
                    currentPoint[ 1 ] + parseInt( splitCommand[ 2 ] )                    
                ] }
                nextPoint = [
                    currentPoint[ 0 ] + parseInt( splitCommand[ 3 ] ),
                    currentPoint[ 1 ] + parseInt( splitCommand[ 4 ] )
                ];
                result[ command ].endHandle.unshift( nextPoint[ 1 ] );
                result[ command ].endHandle.unshift( nextPoint[ 0 ] );
                currentPoint = nextPoint;
                break;
            case "z":
            case "Z":
            default:
                break;
        }
        result[ command ] = { ...result[ command ], point: currentPoint };
    } );
    // return [ ...new Set( result.map( coordinates => coordinates.toString() ) ) ].map( coordinates => coordinates.split( "," ).map( element => parseInt( element ) ) );
    // console.log('result: ', result);
    return result;
}

function adjustDescriptorPoint( descriptor, command, xChange, yChange ) {
    const splitCommand = command.split( splitCommandByParameters ).map( i => parseInt( i ) );
    let updatedPoint, adjustedCommand;
    switch ( command[ 0 ] ) {
        case "m":
            updatedPoint = [ splitCommand[ 1 ] + xChange, splitCommand[ 2 ] + yChange ];
            adjustedCommand = "m " + updatedPoint.join( "," );
            break;
        case "h":
            updatedPoint = [ splitCommand[ 1 ] + xChange, splitCommand[ 2 ] ];
            adjustedCommand = "h " + updatedPoint[ 0 ];
            break;
        case "v":
            updatedPoint = [ splitCommand[ 1 ], splitCommand[ 2 ] + yChange ];
            adjustedCommand = "h " + updatedPoint[ 1 ];
            break;
        case "l":
            updatedPoint = [ splitCommand[ 1 ] + xChange, splitCommand[ 2 ] + yChange ];
            adjustedCommand = "l " + updatedPoint.join( "," );
            break;
        case "a":
            break;
        case "c":
            break;
        case "t":
            break;
        case "q":
            break;
        case "s":
            break;
        case "z":
            adjustedCommand = "z";
            break;
        case "Z":
            adjustedCommand = "Z";
            break;
        default:
            break;
    }
    return descriptor.replace( command, adjustedCommand );
}

export { parseDescriptor, adjustDescriptorPoint };