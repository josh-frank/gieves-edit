import { useSelector } from "react-redux";

import styled from "styled-components";

function gridLineSpacing( range, unit ) {
  return [ ...Array( Math.floor( range / unit ) + 1 ).keys() ].map( i => i * unit );
}

const StyledGrid = styled.svg.attrs( ( { offsetX, offsetY } ) => ( {
    style: {
      top: `${ offsetX }%`,
      left: `${ offsetY }%`,
    },
  } ) )`position: absolute; transform: translate( -50%, -50% ); z-index: -1000;`;

const gridLineStyle = { stroke: "lightgray", strokeWidth: 0.5 };

export default function ArtboardGrid() {

  const { width, height, zoom, offsetX, offsetY, gridInterval } = useSelector( state => state.artboardDisplayOptions );

  const HorizontalLines = () => gridLineSpacing( height, gridInterval ).map( line => {
    return <line
      x1="0"
      y1={ line }
      x2={ width }
      y2={ line }
      style={ gridLineStyle }
    />;
  } );

  const VerticalLines = () => gridLineSpacing( width, gridInterval ).map( line => {
    return <line
      x1={ line }
      y1="0"
      x2={ line }
      y2={ height }
      style={ gridLineStyle }
    />;
  } );

  return <StyledGrid
    x={ 0 }
    y={ 0 }
    width={ width * zoom / 100 }
    height={ height * zoom / 100 }
    offsetX={ offsetX }
    offsetY={ offsetY }
    viewBox={ `0 0 ${ width } ${ height }` }
  >
    <HorizontalLines />
    <VerticalLines />
  </StyledGrid>;

}