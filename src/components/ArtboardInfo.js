import { useState } from "react";
import { useDispatch } from "react-redux";

import styled from "styled-components";
import { setArtboardDimensions, setZoom, setArtboardOffset } from "../redux/artboardSlice";

const StyledInput = styled.input.attrs( ( { characterLength } ) => ( {
    style: { width: `${ characterLength }ch` },
  } ) )``;


function roundAndClamp( payload ){
    return Math.min( Math.max( Math.round( payload * 4 ) / 4, 6.25 ), 625 );
}

export default function ArtboardInfo( { artboardDisplayOptions } ) {
    
    const dispatch = useDispatch();

    const { offsetX, offsetY, width, height, zoom } = artboardDisplayOptions;

    const [ activeInput, setActiveInput ] = useState( {} );
    
    function dispatchinputStateChange() {
        switch ( activeInput.name ) {
            case "offsetX":
                dispatch( setArtboardOffset( { offsetX: activeInput.value + 50 } ) );
                break;
            case "offsetY":
                dispatch( setArtboardOffset( { offsetY: activeInput.value + 50 } ) );
                break;
            case "width":
                dispatch( setArtboardDimensions( { width: activeInput.value } ) );
                break;
            case "height":
                dispatch( setArtboardDimensions( { height: activeInput.value } ) );
                break;
            case "zoom":
                dispatch( setZoom( roundAndClamp( activeInput.value ) ) );
                break;
            default: break;
        }
        setActiveInput( {} );
    }

    return <div className="artboard-info">
        🤚
        <StyledInput
            type="number"
            name="offsetX"
            value={ activeInput.name === "offsetX" ? activeInput.value : offsetX - 50 }
            onFocus={ () => setActiveInput( { name: "offsetX", value: offsetX - 50 } ) }
            onChange={ changeEvent => setActiveInput( { name: "offsetX", value: parseInt( changeEvent.target.value ) || 0 } ) }
            onBlur={ dispatchinputStateChange }
            characterLength={ ( activeInput.name === "offsetX" ? activeInput.value : offsetX - 50 ).toString().length }
        />
        ,
        <StyledInput
            type="number"
            name="offsetY"
            value={ activeInput.name === "offsetY" ? activeInput.value : offsetY - 50 }
            onFocus={ () => setActiveInput( { name: "offsetY", value: offsetY - 50 } ) }
            onChange={ changeEvent => setActiveInput( { name: "offsetY", value: parseInt( changeEvent.target.value ) || 0 } ) }
            onBlur={ dispatchinputStateChange }
            characterLength={ ( activeInput.name === "offsetY" ? activeInput.value : offsetY - 50 ).toString().length }
        />
        { " • " }
        📏
        <StyledInput
            type="number"
            name="width"
            value={ activeInput.name === "width" ? activeInput.value : width }
            onFocus={ () => setActiveInput( { name: "width", value: width } ) }
            onChange={ changeEvent => setActiveInput( { name: "width", value: parseInt( changeEvent.target.value ) || 1 } ) }
            onBlur={ dispatchinputStateChange }
            characterLength={ ( activeInput.name === "width" ? activeInput.value : width ).toString().length }
        />
        { " x " }
        <StyledInput
            type="number"
            name="height"
            value={ activeInput.name === "height" ? activeInput.value : height }
            onFocus={ () => setActiveInput( { name: "height", value: height } ) }
            onChange={ changeEvent => setActiveInput( { name: "height", value: parseInt( changeEvent.target.value ) || 1 } ) }
            onBlur={ dispatchinputStateChange }
            characterLength={ ( activeInput.name === "height" ? activeInput.value : height ).toString().length }
        />
        { " • " }
        🔎
        <StyledInput
            type="number"
            name="zoom"
            value={ activeInput.name === "zoom" ? activeInput.value : zoom }
            onFocus={ () => setActiveInput( { name: "zoom", value: zoom } ) }
            onChange={ changeEvent => setActiveInput( { name: "zoom", value: parseInt( changeEvent.target.value ) || 1 } ) }
            onBlur={ dispatchinputStateChange }
            characterLength={ ( activeInput.name === "zoom" ? activeInput.value : zoom ).toString().length }
        />
        %
    </div>;

}