import styled from "styled-components";

const StyledArtboard = styled.svg`
    position: absolute;
    top: ${ props => props.position.offsetX }%;
    left: ${ props => props.position.offsetY }%;
    transform: translate( -50%, -50% );
    box-shadow: 5px 5px 2px 1px rgba( 0, 0, 0, .2 );
`;

export default function Artboard( { width, height, position, shapes } ) {

    return <StyledArtboard
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        className="artboard"
        x={ 0 }
        y={ 0 }
        width={ width * position.zoom }
        height={ height * position.zoom }
        position={ position }
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