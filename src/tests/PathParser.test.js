import { Path } from "../utilities/PathParser";

// const testShapes = [
//     "m 50,50 l 100,0 l 0,100 l -100,0 z",
//     "m 300 300 a 50 50 90 1 1 100 0 a 50 50 90 1 1 -100 0 z",
//     "m 744 136 h -202 c -10 0 -18 8 -18 18 h 238 c 0 -10 -8 -18 -18 -18 z",
//     "m 240 200 v -20 a 20 20 90 1 1 40 40 l -40 -20 z",
//     "m 80 508 s 70 -54 60 -138 s 66 -98 150 -50 z",
//     "m 628 356 l 192 -224 l 96 -32 l -32 96 l -224 192 c 32 32 32 64 64 30 c 0 32 32 64 0 64 a 45.44 45.44 90 0 1 -32 32 a 160 160 90 0 0 -64 -96 q -16 -3.2 -16 16 t -48 41.6 t -25.6 -25.6 t 41.6 -48 t 16 -16 a 160 160 90 0 0 -96 -64 a 45.44 45.44 90 0 1 32 -32 c 0 -32 32 0 64 0 c -32 32 0 32 32 66 l 192 -224 l 0 64 l 64 0 l -57.6 -6.4 l -6.4 -57.6 z"
// ];

const sameShape = [
    "m 25,25 l 50,0 l 0,50 l -50,0 z",
    "M 25 25 L 75 25 L 75 75 L 25 75 Z",
    "m 25,25 l 50,0  L 75 75 L 25 75 Z"
];

const normalizedShape = [
    "M 25 25 H 75 V 75 H 25 Z",
    "M 25 25 C 25 25 75 25 75 25 C 75 25 75 75 75 75 C 75 75 25 75 25 75 Z"
];

test( "PathCommand returns absolute and relative commands correctly", () => {
    const relative = new Path( sameShape[ 0 ] );
    const absolute = new Path( sameShape[ 1 ] );
    for ( let i = 0; i < relative.length; i++ ) {
        expect( relative.parsedCommands[ i ].absolute().join( " " ) ).toEqual( absolute.parsedCommands[ i ].absolute().join( " " ) );
    }
} );

test( "PathCommand normalizes itself correctly", () => {
    const testPath = new Path( normalizedShape[ 0 ] ).normalized();
    expect( testPath.toString() ).toEqual( normalizedShape[ 1 ] );
    const testPath1 = new Path( "m 0 0 q 60 0 60 40 q -60 0 -60 -40 z" ).normalized();
    // console.log( "testPath1: ", testPath1 );
    expect( true );
} );

test( "PathCommands index themselves correctly", () => {
    const elevenCommands = "M83.3,141.501c-2.035,0.603-4.071,1.732-5.979,3.64c-9.47,9.469-4.208,13.678-1.578,13.678 c2.63,0,5.824-1.876,4.208-6.313c-0.453-1.247,1.026-5.191,3.349-7.14V141.501z M76.069,156.812c-1.012,0-1.832-0.82-1.832-1.832 s0.82-1.832,1.832-1.832s1.833,0.82,1.833,1.832S77.081,156.812,76.069,156.812z";
    const testPath = new Path( elevenCommands );
    expect( testPath.parsedCommands.length ).toEqual( 11 );
} );

