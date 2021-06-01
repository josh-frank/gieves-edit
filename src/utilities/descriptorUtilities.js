/* eslint-disable no-useless-escape */

const splitDescriptorByCommands = /\s(?=[achlmqstvz])/i;
const splitCommandByParameters = /[\s,]/;

// const anyValidCommand = /[achlmqstvz]((\s*)([-\d],*))*/ig;

// const validCoordinate = "0([.]\d+)?|-?\d+([.]\d+)?";
// const validFirstCommand = "^m\s?(0([.]\d+)?|-?\d+([.]\d+)?)[,\s]+(0([.]\d+)?|-?\d+([.]\d+)?)";
// const validMoveCommand = "m\s?(0([.]\d+)?|-?\d+([.]\d+)?)[,\s]+(0([.]\d+)?|-?\d+([.]\d+)?)";
// const validLineCommand = "l\s?(0([.]\d+)?|-?\d+([.]\d+)?)[,\s]+(0([.]\d+)?|-?\d+([.]\d+)?)";
// const validHorizontalCommand = "h\s?(0([.]\d+)?|-?\d+([.]\d+)?)";
// const validVerticalCommand = "v\s?(0([.]\d+)?|-?\d+([.]\d+)?)";
// const validCubicCurveCommand = "c\s?((0([.]\d+)?|-?\d+([.]\d+)?)[,\s]+){5}(0([.]\d+)?|-?\d+([.]\d+)?)";
// const validSmoothCubicCurveCommand = "s\s?((0([.]\d+)?|-?\d+([.]\d+)?)[,\s]+){3}(0([.]\d+)?|-?\d+([.]\d+)?)";
// const validQuadCurveCommand = "q\s?((0([.]\d+)?|-?\d+([.]\d+)?)[,\s]+){3}(0([.]\d+)?|-?\d+([.]\d+)?)";
// const validSmoothQuadCurveCommand = "t(\s?(0([.]\d+)?|-?\d+([.]\d+)?))+";
// const validArcCurveCommand = "a\s?((0([.]\d+)?|-?\d+([.]\d+)?)[,\s]+){6}(0([.]\d+)?|-?\d+([.]\d+)?)";

function absoluteToRelative( descriptor ) {}

function relativeToAbsolute( descriptor ) {}

function parseDescriptor( descriptor ) {
    const splitDescriptor = descriptor.split( splitDescriptorByCommands );
    let currentPoint = [ 0, 0 ], nextPoint;
    const result = splitDescriptor.reduce( ( result, command, index ) => {
        const splitCommand = command.split( splitCommandByParameters );
        let startHandle, endHandle;
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
                startHandle = [
                    currentPoint[ 0 ],
                    currentPoint[ 1 ],
                    currentPoint[ 0 ] + parseInt( splitCommand[ 1 ] ),
                    currentPoint[ 1 ] + parseInt( splitCommand[ 2 ] )                    
                ];
                endHandle = [
                    currentPoint[ 0 ] + parseInt( splitCommand[ 3 ] ),
                    currentPoint[ 1 ] + parseInt( splitCommand[ 4 ] )                    
                ];
                nextPoint = [
                    currentPoint[ 0 ] + parseInt( splitCommand[ 5 ] ),
                    currentPoint[ 1 ] + parseInt( splitCommand[ 6 ] )
                ];
                endHandle.unshift( nextPoint[ 1 ] );
                endHandle.unshift( nextPoint[ 0 ] );
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
                endHandle = [
                    currentPoint[ 0 ] + parseInt( splitCommand[ 1 ] ),
                    currentPoint[ 1 ] + parseInt( splitCommand[ 2 ] )                    
                ];
                nextPoint = [
                    currentPoint[ 0 ] + parseInt( splitCommand[ 3 ] ),
                    currentPoint[ 1 ] + parseInt( splitCommand[ 4 ] )
                ];
                endHandle.unshift( nextPoint[ 1 ] );
                endHandle.unshift( nextPoint[ 0 ] );
                currentPoint = nextPoint;
                break;
            case "z":
            case "Z":
            default:
                break;
        }
        return [ ...result, { index: index, command: command, point: currentPoint, startHandle: startHandle, endHandle: endHandle } ]
    }, [] );
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
            case "a":
            case "c":
            case "t":
            case "q":
            case "s":
                splitCommand[ splitCommand.length - 2 ]  += !index ? xChange : -xChange; 
                splitCommand[ splitCommand.length - 1 ]  += !index ? yChange : -yChange;
                adjustedDescriptor += ` ${ commandToAdjust[ 0 ] } ` + splitCommand.slice( 1 ).join( " " );
                break;
            case "z":
            case "Z":
                adjustedDescriptor += ` ${ commandToAdjust[ 0 ] } `;
                break;
            default:
                break;
        }
    } );
    adjustedDescriptor += " " + splitDescriptor.slice( commandIndex + 2 ).join( " " );
    return adjustedDescriptor;
}

// function adjustHandlePoint( descriptor, command, xChange, yChange ) {}

export {
    absoluteToRelative,
    relativeToAbsolute,
    parseDescriptor,
    adjustDescriptorPoint
};