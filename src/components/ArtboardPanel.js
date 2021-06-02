import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components";
import { setArtboardDimensions, setZoom, setArtboardOffset, toggleGridDisplay, setGridInterval, toggleSnapToGrid } from "../redux/artboardSlice";

const StyledInput = styled.input.attrs( ( { characterLength } ) => ( {
    style: { width: `${ characterLength }ch` },
  } ) )``;


function roundAndClamp( payload ){
    return Math.min( Math.max( Math.round( payload * 4 ) / 4, 6.25 ), 625 );
}

export default function ArtboardPanel() {
    
    const dispatch = useDispatch();

    const { offsetX, offsetY, width, height, zoom, displayGrid, snapToGrid, gridInterval } = useSelector( state => state.artboard );

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
            case "gridInterval":
                dispatch( setGridInterval( activeInput.value ) );
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
            value={ activeInput.name === "offsetX" ? activeInput.value : Math.round( offsetX - 50 ) }
            onFocus={ () => setActiveInput( { name: "offsetX", value: Math.round( offsetX - 50 ) } ) }
            onChange={ changeEvent => setActiveInput( { name: "offsetX", value: parseInt( changeEvent.target.value ) || 0 } ) }
            onBlur={ dispatchinputStateChange }
            characterLength={ ( activeInput.name === "offsetX" ? activeInput.value : Math.round( offsetX - 50 ) ).toString().length }
        />
        ,
        <StyledInput
            type="number"
            name="offsetY"
            value={ activeInput.name === "offsetY" ? activeInput.value : Math.round( offsetY - 50 ) }
            onFocus={ () => setActiveInput( { name: "offsetY", value: Math.round( offsetY - 50 ) } ) }
            onChange={ changeEvent => setActiveInput( { name: "offsetY", value: parseInt( changeEvent.target.value ) || 0 } ) }
            onBlur={ dispatchinputStateChange }
            characterLength={ ( activeInput.name === "offsetY" ? activeInput.value : Math.round( offsetY - 50 ) ).toString().length }
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
        { " • " }
        <input
            type="checkbox"
            name="toggleGridDisplay"
            checked={ displayGrid }
            onChange={ () => dispatch( toggleGridDisplay() ) }
        />
        <label htmlFor="toggleGridDisplay">{ displayGrid ? "Hide grid" : "Show grid" }</label>
        { " • " }
        <input
            type="checkbox"
            name="toggleSnapToGrid"
            checked={ snapToGrid }
            onChange={ () => dispatch( toggleSnapToGrid() ) }
        />
        <label htmlFor="toggleSnapToGrid">{ snapToGrid ? "Don't snap to grid" : "Snap to grid" }</label>
        { " • " }
        Grid interval:
        <StyledInput
            type="number"
            name="gridInterval"
            value={ activeInput.name === "gridInterval" ? activeInput.value : gridInterval }
            onFocus={ () => setActiveInput( { name: "gridInterval", value: gridInterval } ) }
            onChange={ changeEvent => setActiveInput( { name: "gridInterval", value: parseInt( changeEvent.target.value ) || 5 } ) }
            onBlur={ dispatchinputStateChange }
            characterLength={ ( activeInput.name === "gridInterval" ? activeInput.value : gridInterval ).toString().length }
        />
        { " • " }
        <a href="https://github.com/josh-frank/gieves-edit" target="_blank" rel="noreferrer">
            <img src="githubLogo.svg" height="12.5rem" alt="View this project on GitHub" />
        </a>
    </div>;

}