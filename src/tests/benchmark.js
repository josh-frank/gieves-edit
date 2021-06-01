const testPath = "m 314 178 l 96 -112 l 48 -16 l -16 48 l -112 96 c 16 16 16 32 32 15 c 0 16 16 32 0 32 a 22.72 22.72 90 0 1 -16 16 a 80 80 90 0 0 -32 -48 q -8 -1.6 -8 8 t -24 20.8 t -12.8 -12.8 t 20.8 -24 t 8 -8 a 80 80 90 0 0 -48 -32 a 22.72 22.72 90 0 1 16 -16 c 0 -16 16 0 32 0 c -16 16 0 16 16 33 l 96 -112 l 0 32 l 32 0 l -28.8 -3.2 l -3.2 -28.8 z";

const splitDescriptorByCommands = /\s(?=[achlmqstvz])/i;
const validCommand = /[achlmqstvz]((\s*)([-\d],*))*/ig;

let matchTest = new Date();
for ( let i = 0; i < 1_000_000; i++ ) { testPath.match( validCommand ); }
matchTest -= new Date();

let splitTest = new Date();
for ( let i = 0; i < 1_000_000; i++ ) { testPath.split( splitDescriptorByCommands ); }
splitTest -= new Date();

console.log('matchTest: ', matchTest);
console.log('splitTest: ', splitTest);
