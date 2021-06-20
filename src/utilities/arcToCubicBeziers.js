const TAU = Math.PI * 2

const mapToEllipse = ( coordinates, rx, ry, cosPhi, sinPhi, centerX, centerY ) => {
    coordinates[ 0 ] *= rx;
    coordinates[ 1 ] *= ry;
    return [
        ( cosPhi * coordinates[ 0 ] - sinPhi * coordinates[ 1 ] ) + centerX,
        ( sinPhi * coordinates[ 0 ] + cosPhi * coordinates[ 1 ] ) + centerY
    ];
}

const approximateUnitArc = ( thisAngle, thatAngle ) => {
    // http://spencermortensen.com/articles/bezier-circle
    const a = thatAngle === 1.5707963267948966 ? 0.551915024494 : thatAngle === -1.5707963267948966 ? -0.551915024494 : 4 / 3 * Math.tan( thatAngle / 4 );
    const x1 = Math.cos( thisAngle );
    const y1 = Math.sin( thisAngle );
    const x2 = Math.cos( thisAngle + thatAngle );
    const y2 = Math.sin( thisAngle + thatAngle );
    return [
        [ x1 - y1 * a, y1 + x1 * a ],
        [ x2 + y2 * a, y2 - x2 * a ],
        [ x2, y2 ]
    ]
}

const vectorAngle = ( ux, uy, vx, vy ) => {
    const sign = ( ux * vy - uy * vx < 0 ) ? -1 : 1;
    let dot = ux * vx + uy * vy;
    dot = dot > 1 ? 1 : dot < -1 ? -1 : dot;
    return sign * Math.acos( dot );
}

const getArcCenter = ( previousPoint, cx, cy, rx, ry, largeArcFlag, sweepFlag, sinPhi, cosPhi, pxp, pyp ) => {
    const rxsq = Math.pow( rx, 2 );
    const rysq = Math.pow( ry, 2 );
    const pxpsq = Math.pow( pxp, 2 );
    const pypsq = Math.pow( pyp, 2 );
    let radicant = ( rxsq * rysq ) - ( rxsq * pypsq ) - ( rysq * pxpsq );
    if ( radicant < 0 ) radicant = 0;
    radicant /= ( rxsq * pypsq ) + ( rysq * pxpsq );
    radicant = Math.sqrt( radicant ) * ( largeArcFlag === sweepFlag ? -1 : 1 );
    const centerXp = radicant * rx / ry * pyp;
    const centerYp = radicant * -ry / rx * pxp;
    const centerX = cosPhi * centerXp - sinPhi * centerYp + ( previousPoint[ 0 ] + cx ) / 2;
    const centerY = sinPhi * centerXp + cosPhi * centerYp + ( previousPoint[ 1 ] + cy ) / 2;
    const vx1 = ( pxp - centerXp ) / rx;
    const vy1 = ( pyp - centerYp ) / ry;
    const vx2 = ( -pxp - centerXp ) / rx;
    const vy2 = ( -pyp - centerYp ) / ry;
    let thisAngle = vectorAngle( 1, 0, vx1, vy1 );
    let thatAngle = vectorAngle( vx1, vy1, vx2, vy2 );
    if ( sweepFlag === 0 && thatAngle > 0 ) thatAngle -= TAU;
    if ( sweepFlag === 1 && thatAngle < 0 ) thatAngle += TAU;
    return [ centerX, centerY, thisAngle, thatAngle ];
}

export const arcToCubicBeziers = ( previousPoint, [ ellipseRadiusX, ellipseRadiusY, xAxisRotation = 0, largeArcFlag = 0, sweepFlag = 0, nextPointX, nextPointY ] ) => {
    const curves = [];
    if ( ellipseRadiusX === 0 || ellipseRadiusY === 0 ) return curves;
    const sinPhi = Math.sin( xAxisRotation * TAU / 360 );
    const cosPhi = Math.cos( xAxisRotation * TAU / 360 );
    const pxp = cosPhi * ( previousPoint[ 0 ] - nextPointX ) / 2 + sinPhi * ( previousPoint[ 1 ] - nextPointY ) / 2;
    const pyp = -sinPhi * ( previousPoint[ 0 ] - nextPointX ) / 2 + cosPhi * ( previousPoint[ 1 ] - nextPointY ) / 2;
    if ( pxp === 0 && pyp === 0 ) return curves;
    ellipseRadiusX = Math.abs( ellipseRadiusX );
    ellipseRadiusY = Math.abs( ellipseRadiusY );
    const lambda = Math.pow( pxp, 2 ) / Math.pow( ellipseRadiusX, 2 ) + Math.pow( pyp, 2 ) / Math.pow( ellipseRadiusY, 2 );
    if ( lambda > 1 ) {
        ellipseRadiusX *= Math.sqrt( lambda );
        ellipseRadiusY *= Math.sqrt( lambda );
    }
    let [ centerX, centerY, thisAngle, thatAngle ] = getArcCenter( previousPoint, nextPointX, nextPointY, ellipseRadiusX, ellipseRadiusY, largeArcFlag, sweepFlag, sinPhi, cosPhi, pxp, pyp );
    let ratio = Math.abs( thatAngle ) / ( TAU / 4 ); // round to 1.0 when the ratio is close to 1.0
    if ( Math.abs( 1.0 - ratio ) < 0.0000001 ) ratio = 1.0;
    const segments = Math.max( Math.ceil( ratio ), 1 );
    thatAngle /= segments;
    for ( let i = 0; i < segments; i++ ) {
        curves.push( approximateUnitArc( thisAngle, thatAngle ) );
        thisAngle += thatAngle;
    }
    return curves.map( curve => [
        ...mapToEllipse( curve[ 0 ], ellipseRadiusX, ellipseRadiusY, cosPhi, sinPhi, centerX, centerY ),
        ...mapToEllipse( curve[ 1 ], ellipseRadiusX, ellipseRadiusY, cosPhi, sinPhi, centerX, centerY ),
        ...mapToEllipse( curve[ 2 ], ellipseRadiusX, ellipseRadiusY, cosPhi, sinPhi, centerX, centerY )
    ] );
}
