import { useSelector } from "react-redux";
import styled from "styled-components";

const StyledArtboard = styled.svg`
    position: absolute;
    top: ${ props => props.offsetX }%;
    left: ${ props => props.offsetY }%;
    transform: translate( -50%, -50% );
    outline: 2px solid #999999;
    box-shadow: 5px 5px 2px 1px #999999;
`;

export default function Artboard( { shapes } ) {

    const { width, height, zoom, offsetX, offsetY } = useSelector( state => state.artboardDisplayOptions );

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
        { shapes.map( ( shape, index ) => {
            return <path
                key={ index }
                d={ shape }
                stroke="black"
                strokeWidth="4"
                fill="white"
            />;
        } ) }
    </StyledArtboard>;

}