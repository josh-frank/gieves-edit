const validCoordinate = /(-?\.\d+)|(-?\d+(\.\d+)?)/ig;
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
