import { useSelector } from "react-redux";
import styled from "styled-components";

import Shape from "./Shape";

const StyledArtboard = styled.svg.attrs( ( { offsetX, offsetY, zoom } ) => ( {
    style: {
      top: `${ offsetX }%`,
      left: `${ offsetY }%`,
      outline: `${ 2 * zoom }px solid #999999`,
      boxShadow: `${ zoom * 5 }px ${ zoom * 5 }px ${ zoom * 2 }px ${ zoom * 2 }px #999999`
    },
  } ) )`position: absolute; transform: translate( -50%, -50% );`;

export default function Artboard( { shapes } ) {

    const { width, height, zoom, offsetX, offsetY } = useSelector( state => state.artboardDisplayOptions );
    const { activeShape, inactiveShapes } = useSelector( state => state.shapes );

    return <StyledArtboard
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        className="artboard"
        x={ 0 }
        y={ 0 }
        width={ width * zoom }
        height={ height * zoom }
        offsetX={ offsetX }
        offsetY={ offsetY }
        zoom={ zoom }
        viewBox={ `0 0 ${ width } ${ height }` }
        enableBackground={ `new 0 0 ${ width } ${ height }` }
    >
        { activeShape && <Shape descriptor={ activeShape } active={ true } /> }
        { inactiveShapes.map( ( shape, index ) => <Shape key={ index } descriptor={ shape } active={ false } /> ) }
    </StyledArtboard>;

}