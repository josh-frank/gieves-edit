import { useSelector } from "react-redux";

import styled from "styled-components";

function gridLineSpacing( range, unit ) {
  return [ ...Array( Math.floor( range / unit ) + 1 ).keys() ].slice( 1, Math.floor( range / unit ) ).map( i => i * unit );
}

const StyledGrid = styled.svg.attrs( ( { offsetX, offsetY } ) => ( {
    style: {
      top: `${ offsetX }%`,
      left: `${ offsetY }%`,
    },
  } ) )`position: absolute; transform: translate( -50%, -50% ); z-index: -1000;`;

export default function ArtboardGrid() {

  const { width, height, zoom, offsetX, offsetY, gridInterval } = useSelector( state => state.artboardDisplayOptions );

  const HorizontalLines = () => gridLineSpacing( height, gridInterval ).map( line => {
    return <g key={ line }>
      <text
        x="0.25"
        y={ line }
        fill="lightgray"
        fontFamily="Arial Narrow"
        fontSize="3px"
        letterSpacing="-0.2px"
        transform="translate( 0, -0.5 )"
      >
        { line }
      </text> 
      <line
        x1="0"
        y1={ line }
        x2={ width }
        y2={ line }
        stroke="lightgray"
        strokeWidth="0.5"
      />
    </g>;
  } );

  const VerticalLines = () => gridLineSpacing( width, gridInterval ).map( line => {
    return <g key={ line }>
      <text
        x={ line }
        y="0.25"
        fill="lightgray"
        writingMode="vertical-rl"
        fontFamily="Arial Narrow"
        fontSize="3px"
        letterSpacing="-0.2px"
        transform="translate( 2 )"
      >
        { line }
      </text> 
      <line
        x1={ line }
        y1="0"
        x2={ line }
        y2={ height }
        stroke="lightgray"
        strokeWidth="0.5"
      />
    </g>;
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
