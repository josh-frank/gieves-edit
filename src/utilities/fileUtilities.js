// export const pathsToSvg = ( paths, dimensions ) => [
//     `<?xml version="1.0" encoding="utf-8"?>`,
//     `<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">`,
//     `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="${ dimensions[ 0 ] }px" height="${ dimensions[ 1 ] }px" viewBox="0 0 ${ dimensions[ 0 ] } ${ dimensions[ 1 ] }" enable-background="new 0 0 ${ dimensions[ 0 ] } ${ dimensions[ 1 ] }" xml:space="preserve">`,
//     ...paths.map( path => `<path d="${ path }" stroke="black" stroke-width="1" fill="white" />` ),
//     `</svg>`
// ];

export const downloadArtboardAsSvg = ( paths, dimensions ) => {
    var element = document.createElement( "a" );
    element.setAttribute( "href", "data:image/svg+xml;utf8," + encodeURIComponent( [
        `<?xml version="1.0" encoding="utf-8"?>`,
        `<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">`,
        `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="${ dimensions[ 0 ] }px" height="${ dimensions[ 1 ] }px" viewBox="0 0 ${ dimensions[ 0 ] } ${ dimensions[ 1 ] }" enable-background="new 0 0 ${ dimensions[ 0 ] } ${ dimensions[ 1 ] }" xml:space="preserve">`,
        ...paths.map( path => `<path d="${ path }" stroke="black" stroke-width="1" fill="white" />` ),
        `</svg>`
    ].join( "" ) ) );
    element.setAttribute( "download", `GievesEdit-${ Date.now() }` );
    element.style.display = "none";
    document.body.appendChild( element );
    element.click();
    document.body.removeChild( element );
}

export const parsePathsFromSvg = svg => {
    const matchPathTag = /<path[\s\S]*?\/>/gmi,
        matchDescriptor = /(?<=\sd=")[\s\S]*?(?=")/gmi,
        cleanUpWhiteSpace = /[\n\s]+/g;
    return svg.match( matchPathTag )
        .map( pathTag => pathTag.match( matchDescriptor )
            .join( "" )
            .replace( cleanUpWhiteSpace, " " )
        );
}
