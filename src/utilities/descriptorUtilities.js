/* eslint-disable no-useless-escape */

// const splitDescriptorByCommands = /\s(?=[achlmqstvz])/i;
// const splitCommandByParameters = /[\s,]/;
// const validCoordinate = /(-?\.\d+)|(-?\d+(\.\d+)?)/ig;
// const upToTwoValidCoordinates = /(-?\d+\.\d+\s*-?,?\.\d+)|(-?\.\d+\s*-?,?\.\d+)|(-?\d+(\.\d+)?,?\s*-?\d+(\.\d+)?)/ig;
// const validFirstCommand = /^m\s?((-?\.\d+)|(-?\d+(\.\d+)?))((-?\.\d+)|(,?\s?-?\d+(\.\d+)?))/ig;
// const validMoveCommand = /m\s?((-?\.\d+)|(-?\d+(\.\d+)?))((-?\.\d+)|(,?\s?-?\d+(\.\d+)?))/ig;
// const validLineCommand = /l\s?((-?\.\d+)|(-?\d+(\.\d+)?))((-?\.\d+)|(,?\s?-?\d+(\.\d+)?))/ig;
// const validHorizontalCommand = /h\s?((-?\.\d+)|(-?\d+(\.\d+)?))/ig;
// const validVerticalCommand = /v\s?((-?\.\d+)|(-?\d+(\.\d+)?))/ig;
// const validCubicCurveCommand = /c\s?((-?\.\d+)|(-?\d+(\.\d+)?))((-?\.\d+)|(,?\s?-?\d+(\.\d+)?)){5}/ig;
// const validSmoothCubicCurveCommand = /s\s?((-?\.\d+)|(-?\d+(\.\d+)?))((-?\.\d+)|(,?\s?-?\d+(\.\d+)?)){3}/ig;
// const validQuadCurveCommand = /q\s?((-?\.\d+)|(-?\d+(\.\d+)?))((-?\.\d+)|(,?\s?-?\d+(\.\d+)?)){3}/ig;
// const validContinuousQuadCurveCommand = /q\s?((-?\.\d+)|(-?\d+(\.\d+)?))((-?\.\d+)|(,?\s?-?\d+(\.\d+)?)){3}([\s,]?t\s?((-?\.\d+)|(-?\d+(\.\d+)?))((-?\.\d+)|(,?\s?-?\d+(\.\d+)?)))*/ig;
// const validSmoothQuadCurveCommand = /t\s?((-?\.\d+)|(-?\d+(\.\d+)?))((-?\.\d+)|(,?\s?-?\d+(\.\d+)?))/ig;
// const validArcCurveCommand = /a\s?((-?\.\d+)|(-?\d+(\.\d+)?))((-?\.\d+)|(,?\s?-?\d+(\.\d+)?)){2}[,\s]?[01][,\s]+[01][,\s]+((-?\.\d+)|(,?\s?-?\d+(\.\d+)?)){2}/ig;

// const validCommand = /z|([hv]\s?((-?\.\d+)|(-?\d+(\.\d+)?)))|([ml]\s?((-?\.\d+)|(-?\d+(\.\d+)?))((-?\.\d+)|(,?\s?-?\d+(\.\d+)?)))|(s\s?((-?\.\d+)|(-?\d+(\.\d+)?))((-?\.\d+)|(,?\s?-?\d+(\.\d+)?)){3})|(c\s?((-?\.\d+)|(-?\d+(\.\d+)?))((-?\.\d+)|(,?\s?-?\d+(\.\d+)?)){5})|(q\s?((-?\.\d+)|(-?\d+(\.\d+)?))((-?\.\d+)|(,?\s?-?\d+(\.\d+)?)){3}([\s,]?t\s?((-?\.\d+)|(-?\d+(\.\d+)?))((-?\.\d+)|(,?\s?-?\d+(\.\d+)?)))*)|(a\s?((-?\.\d+)|(-?\d+(\.\d+)?))((-?\.\d+)|(,?\s?-?\d+(\.\d+)?)){2}[,\s]?[01][,\s]+[01][,\s]+((-?\.\d+)|(,?\s?-?\d+(\.\d+)?)){2})/ig;
// const isValidDescriptor = /^m\s?((-?\.\d+)|(-?\d+(\.\d+)?))((-?\.\d+)|(,?\s?-?\d+(\.\d+)?))[\s,]?((([hv]\s?((-?\.\d+)|(-?\d+(\.\d+)?)))|([ml]\s?((-?\.\d+)|(-?\d+(\.\d+)?))((-?\.\d+)|(,?\s?-?\d+(\.\d+)?)))|(s\s?((-?\.\d+)|(-?\d+(\.\d+)?))((-?\.\d+)|(,?\s?-?\d+(\.\d+)?)){3})|(c\s?((-?\.\d+)|(-?\d+(\.\d+)?))((-?\.\d+)|(,?\s?-?\d+(\.\d+)?)){5})|(q\s?((-?\.\d+)|(-?\d+(\.\d+)?))((-?\.\d+)|(,?\s?-?\d+(\.\d+)?)){3}([\s,]?t\s?((-?\.\d+)|(-?\d+(\.\d+)?))((-?\.\d+)|(,?\s?-?\d+(\.\d+)?)))*)|(a\s?((-?\.\d+)|(-?\d+(\.\d+)?))((-?\.\d+)|(,?\s?-?\d+(\.\d+)?)){2}[,\s]?[01][,\s]+[01][,\s]+((-?\.\d+)|(,?\s?-?\d+(\.\d+)?)){2}))[\s,]?)*z/i;

// function convertToRelative( descriptor ) {}

// function convertToAbsolute( descriptor ) {}

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
                startHandle = [
                    currentPoint[ 0 ],
                    currentPoint[ 1 ],
                    currentPoint[ 0 ] + parseInt( splitCommand[ 1 ] ),
                    currentPoint[ 1 ] + parseInt( splitCommand[ 2 ] )                    
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
        return [ ...result, { index, command, point: currentPoint, startHandle, endHandle } ]
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

function adjustStartHandlePoint( descriptor, command, xChange, yChange ) {
    const splitCommand = command.split( splitCommandByParameters ).map( i => parseInt( i ) );
    splitCommand[ 0 ] = command[ 0 ];
    splitCommand[ 1 ] += xChange;
    splitCommand[ 2 ] += yChange;
    return descriptor.replace( command, splitCommand.join( " " ) );
}

function adjustEndHandlePoint( descriptor, command, xChange, yChange ) {
    const splitCommand = command.split( splitCommandByParameters ).map( i => parseInt( i ) );
    splitCommand[ 0 ] = command[ 0 ];
    switch ( command[ 0 ] ) {
        case "s":
            splitCommand[ 1 ] += xChange;
            splitCommand[ 2 ] += yChange;
            break;
        case "c":
            splitCommand[ 3 ] += xChange;
            splitCommand[ 4 ] += yChange;
            break;
        default:
            break;
    }
    return descriptor.replace( command, splitCommand.join( " " ) );
}

function snapPathToGrid( descriptor, gridInterval ) {
    return descriptor.split( splitDescriptorByCommands ).map( command =>
        command.split( splitCommandByParameters ).map( ( element, index ) =>
            !parseInt( element ) || ( command[ 0 ] === "a" && [ 4, 5 ].includes( index ) ) ? element : parseInt( element )
        )
    ).flat().map( commandElement => 
        typeof commandElement === "string" ? commandElement : Math.round( commandElement / gridInterval ) * gridInterval
    ).join( " " );
}

export {

    splitDescriptorByCommands,
    splitCommandByParameters,
    // validCoordinate,
    // upToTwoValidCoordinates,
    // validFirstCommand,
    // validMoveCommand,
    // validLineCommand,
    // validHorizontalCommand,
    // validVerticalCommand,
    // validCubicCurveCommand,
    // validSmoothCubicCurveCommand,
    // validQuadCurveCommand,
    // validContinuousQuadCurveCommand,
    // validSmoothQuadCurveCommand,
    // validArcCurveCommand,
    // validCommand,
    isValidDescriptor,

    convertToRelative,
    convertToAbsolute,
    parseDescriptor,
    adjustDescriptorPoint,
    adjustStartHandlePoint,
    adjustEndHandlePoint,
    snapPathToGrid

};