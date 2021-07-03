import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components";
import { setArtboardDimensions, setZoom, setArtboardOffset, toggleGridDisplay, setGridInterval } from "../../redux/artboardSlice";

const StyledInput = styled.input.attrs( ( { characterLength } ) => ( {
    style: { width: `${ characterLength }ch` },
} ) )``;

const GithubLogo = ( { dark } ) => <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
    <path
        d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
        fill={ dark ? "white" : "black" }
    />
</svg>;

function roundAndClamp( payload ){
    return Math.min( Math.max( Math.round( payload * 4 ) / 4, 6.25 ), 625 );
}

export default function ArtboardMenu() {
    
    const dispatch = useDispatch();

    const { offsetX, offsetY, width, height, zoom, displayGrid, gridInterval, dark } = useSelector( state => state.artboard );

    const [ activeInput, setActiveInput ] = useState( {} );
    
    function dispatchinputStateChange() {
        switch ( activeInput.name ) {
            case "offsetX":
                dispatch( setArtboardOffset( { offsetX: activeInput.value } ) );
                break;
            case "offsetY":
                dispatch( setArtboardOffset( { offsetY: activeInput.value } ) );
                break;
            case "width":
                dispatch( setArtboardDimensions( { width: activeInput.value } ) );
                break;
            case "height":
                dispatch( setArtboardDimensions( { height: activeInput.value } ) );
                break;
            case "pan":
                dispatch( setZoom( roundAndClamp( activeInput.value ) ) );
                break;
            case "gridInterval":
                dispatch( setGridInterval( activeInput.value ) );
                break;
            default: break;
        }
        setActiveInput( {} );
    }

    return <div className={ dark ? "artboard-panel dark" : "artboard-panel"}>
        🤚
        <StyledInput
            className={ dark ? "dark" : null }
            type="number"
            name="offsetX"
            value={ activeInput.name === "offsetX" ? activeInput.value : Math.round( offsetX ) }
            onFocus={ () => setActiveInput( { name: "offsetX", value: Math.round( offsetX ) } ) }
            onChange={ changeEvent => setActiveInput( { name: "offsetX", value: parseInt( changeEvent.target.value ) || 0 } ) }
            onBlur={ dispatchinputStateChange }
            characterLength={ ( activeInput.name === "offsetX" ? activeInput.value : Math.round( offsetX ) ).toString().length }
        />
        <span>,</span>
        <StyledInput
            className={ dark ? "dark" : null }
            type="number"
            name="offsetY"
            value={ activeInput.name === "offsetY" ? activeInput.value : Math.round( offsetY ) }
            onFocus={ () => setActiveInput( { name: "offsetY", value: Math.round( offsetY ) } ) }
            onChange={ changeEvent => setActiveInput( { name: "offsetY", value: parseInt( changeEvent.target.value ) || 0 } ) }
            onBlur={ dispatchinputStateChange }
            characterLength={ ( activeInput.name === "offsetY" ? activeInput.value : Math.round( offsetY ) ).toString().length }
        />
        <span>{ " • " }</span>
        📏
        <StyledInput
            className={ dark ? "dark" : null }
            type="number"
            name="width"
            value={ activeInput.name === "width" ? activeInput.value : width }
            onFocus={ () => setActiveInput( { name: "width", value: width } ) }
            onChange={ changeEvent => setActiveInput( { name: "width", value: parseInt( changeEvent.target.value ) || 1 } ) }
            onBlur={ dispatchinputStateChange }
            characterLength={ ( activeInput.name === "width" ? activeInput.value : width ).toString().length }
        />
        <span>{ " x " }</span>
        <StyledInput
            className={ dark ? "dark" : null }
            type="number"
            name="height"
            value={ activeInput.name === "height" ? activeInput.value : height }
            onFocus={ () => setActiveInput( { name: "height", value: height } ) }
            onChange={ changeEvent => setActiveInput( { name: "height", value: parseInt( changeEvent.target.value ) || 1 } ) }
            onBlur={ dispatchinputStateChange }
            characterLength={ ( activeInput.name === "height" ? activeInput.value : height ).toString().length }
        />
        <span>{ " • " }</span>
        🔎
        <StyledInput
            className={ dark ? "dark" : null }
            type="number"
            name="pan"
            value={ activeInput.name === "pan" ? activeInput.value : zoom }
            onFocus={ () => setActiveInput( { name: "pan", value: zoom } ) }
            onChange={ changeEvent => setActiveInput( { name: "pan", value: parseInt( changeEvent.target.value ) || 1 } ) }
            onBlur={ dispatchinputStateChange }
            characterLength={ ( activeInput.name === "pan" ? activeInput.value : zoom ).toString().length }
        />
        %
        <span>{ " • " }</span>
        <input
            type="checkbox"
            name="toggleGridDisplay"
            checked={ displayGrid }
            onChange={ () => dispatch( toggleGridDisplay() ) }
        />
        <label htmlFor="toggleGridDisplay">{ displayGrid ? "Hide grid" : "Show grid" }</label>
        <span>{ " • " }</span>
        Grid interval:
        <StyledInput
            className={ dark ? "dark" : null }
            type="number"
            name="gridInterval"
            value={ activeInput.name === "gridInterval" ? activeInput.value : gridInterval }
            onFocus={ () => setActiveInput( { name: "gridInterval", value: gridInterval } ) }
            onChange={ changeEvent => setActiveInput( { name: "gridInterval", value: parseInt( changeEvent.target.value ) || 5 } ) }
            onBlur={ dispatchinputStateChange }
            characterLength={ ( activeInput.name === "gridInterval" ? activeInput.value : gridInterval ).toString().length }
        />
        <span>{ " • " }</span>
        <a href="https://github.com/josh-frank/gieves-edit" target="_blank" rel="noreferrer">
            <GithubLogo dark={ dark } />
        </a>
    </div>;

}