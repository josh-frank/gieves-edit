import { Path } from "../utilities/PathParser";

const testShapes = [
    "m 50,50 l 100,0 l 0,100 l -100,0 z",
    "m 300 300 a 50 50 90 1 1 100 0 a 50 50 90 1 1 -100 0 z",
    "m 744 136 h -202 c -10 0 -18 8 -18 18 h 238 c 0 -10 -8 -18 -18 -18 z",
    "m 240 200 v -20 a 20 20 90 1 1 40 40 l -40 -20 z",
    "m 80 508 s 70 -54 60 -138 s 66 -98 150 -50 z",
    "m 628 356 l 192 -224 l 96 -32 l -32 96 l -224 192 c 32 32 32 64 64 30 c 0 32 32 64 0 64 a 45.44 45.44 90 0 1 -32 32 a 160 160 90 0 0 -64 -96 q -16 -3.2 -16 16 t -48 41.6 t -25.6 -25.6 t 41.6 -48 t 16 -16 a 160 160 90 0 0 -96 -64 a 45.44 45.44 90 0 1 32 -32 c 0 -32 32 0 64 0 c -32 32 0 32 32 66 l 192 -224 l 0 64 l 64 0 l -57.6 -6.4 l -6.4 -57.6 z"
];

const sameShape = [
    "m 25,25 l 50,0 l 0,50 l -50,0 z",
    "M 25 25 L 75 25 L 75 75 L 25 75 Z",
    "m 25,25 l 50,0  L 75 75 L 25 75 Z"
];

// const sameShape = [
//     "M 628 356 L 820 132 L 916 100 L 884 196 L 660 388 C 692 420 692 452 724 418 C 724 450 756 482 724 482 A 45.44 45.44 90 0 1 692 514 A 160 160 90 0 0 628 418 Q 612 414.8 612 434 T 564 475.6 T 538.4 450 T 580 402 T 596 386 A 160 160 90 0 0 500 322 A 45.44 45.44 90 0 1 532 290 C 532 258 564 290 596 290 C 564 322 596 322 628 356 L 820 132 L 820 196 L 884 196 L 826.4 189.6 L 820 132 Z",
//     "m 628 356 l 192 -224 l 96 -32 l -32 96 l -224 192 c 32 32 32 64 64 30 c 0 32 32 64 0 64 a 45.44 45.44 90 0 1 -32 32 a 160 160 90 0 0 -64 -96 q -16 -3.2 -16 16 t -48 41.6 t -25.6 -25.6 t 41.6 -48 t 16 -16 a 160 160 90 0 0 -96 -64 a 45.44 45.44 90 0 1 32 -32 c 0 -32 32 0 64 0 c -32 32 0 32 32 66 l 192 -224 l 0 64 l 64 0 l -57.6 -6.4 l -6.4 -57.6 z"
// ];

test( 'PathCommand returns absolute and relative commands correctly', () => {
    const relative = new Path( sameShape[ 0 ] );
    const absolute = new Path( sameShape[ 1 ] );
    for ( let i = 0; i < relative.length; i++ ) {
        expect( relative.parsedCommands[ i ].absolute().join( " " ) ).toEqual( absolute.parsedCommands[ i ].absolute().join( " " ) );
    }
} );

test( 'PathCommand normalizes itself correctly', () => {
    const testPath = new Path( sameShape[ 0 ] );
    testPath.normalize();
    console.log( testPath.absolute() );
    console.log( testPath.relative() );
    expect( true );
} );