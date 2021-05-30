import { useSelector } from "react-redux";
import styled from "styled-components";
import ArtboardGrid from "./ArtboardGrid";

import Shape from "./Shape";

const StyledArtboard = styled.svg.attrs( ( { offsetX, offsetY, zoom } ) => ( {
    style: {
      top: `${ offsetX }%`,
      left: `${ offsetY }%`,
      outline: `${ zoom }px solid #999999`,
      boxShadow: `${ zoom * 5 }px ${ zoom * 5 }px ${ zoom * 2 }px ${ zoom * 2 }px #999999`
    },
  } ) )`position: absolute; transform: translate( -50%, -50% );`;

export default function Artboard() {

    const { width, height, zoom, offsetX, offsetY, displayGrid } = useSelector( state => state.artboardDisplayOptions );
    const { activeShape, inactiveShapes } = useSelector( state => state.shapes );

    return <>
      { displayGrid && <ArtboardGrid /> }
      <StyledArtboard
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          className="artboard"
          x={ 0 }
          y={ 0 }
          width={ width * zoom / 100 }
          height={ height * zoom / 100 }
          offsetX={ offsetX }
          offsetY={ offsetY }
          zoom={ zoom / 100 }
          viewBox={ `0 0 ${ width } ${ height }` }
      >
          { activeShape && <Shape descriptor={ activeShape } active={ true } /> }
          { inactiveShapes.map( ( shape, index ) => <Shape key={ index } descriptor={ shape } active={ false } /> ) }
      </StyledArtboard>
    </>;

}