const splitDescriptorByCommands = /\s(?=[AaCcHhLlMmQqSsTtVvZz])/;
const splitCommandByParameters = /[\s,]/;

function absoluteToRelative( descriptor ) {}

function relativeToAbsolute( descriptor ) {}

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
    const splitDescriptor = descriptor.split( splitDescriptorByCommands );
    const commandIndex = splitDescriptor.findIndex( descriptorCommand => descriptorCommand === command );
    let adjustedDescriptor = splitDescriptor.slice( 0, commandIndex ).join( " " );
    splitDescriptor.slice( commandIndex, commandIndex + 2 ).forEach( ( commandToAdjust, index ) => {
        const splitCommand = commandToAdjust.split( splitCommandByParameters ).map( i => parseInt( i ) );
        switch ( commandToAdjust[ 0 ] ) {
            case "m":
                adjustedDescriptor += ( !commandIndex ? "m " : " m " ) + (
                    !index ? [ splitCommand[ 1 ] + xChange, splitCommand[ 2 ] + yChange ].join( " " ) : 
                    [ splitCommand[ 1 ] - xChange, splitCommand[ 2 ] - yChange ].join( " " )
                );
                break;
            case "h":
                adjustedDescriptor += " h " + ( 
                    !index ? splitCommand[ 1 ] + xChange :
                    splitCommand[ 1 ] - xChange
                );
                break;
            case "v":
                adjustedDescriptor += " v " + (
                    !index ? splitCommand[ 1 ] + yChange :
                    splitCommand[ 1 ] - yChange
                );
                break;
            case "l":
                adjustedDescriptor += " l " + (
                    !index ? [ splitCommand[ 1 ] + xChange, splitCommand[ 2 ] + yChange ].join( " " ) : 
                    [ splitCommand[ 1 ] - xChange, splitCommand[ 2 ] - yChange ].join( " " )
                );
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
                adjustedDescriptor += " z";
                break;
            case "Z":
                adjustedDescriptor += " Z";
                break;
            default:
                break;
        }
    } );
    adjustedDescriptor += " " + splitDescriptor.slice( commandIndex + 2 ).join( " " );
    return adjustedDescriptor;
}

export {
    absoluteToRelative,
    relativeToAbsolute,
    parseDescriptor,
    adjustDescriptorPoint
};