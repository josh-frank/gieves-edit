function gridLineSpacing( range, unit ) {
    return [ ...Array( Math.floor( range / unit ) + 1 ).keys() ].map( i => i * unit );
}

function evenlySpacedGridLines( range, numberOfLines ) {
    return [ ...Array( numberOfLines ).keys() ].map( i => i * Math.ceil( range / numberOfLines ) );
}

export { gridLineSpacing, evenlySpacedGridLines };