import { useCallback, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { setArtboardOffset, zoomInWheel, zoomOutWheel } from "../redux/artboardSlice";
import { updateActiveShape } from "../redux/shapesSlice";

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

export default function Artboard( { activePath, setActivePath } ) {

    const dispatch = useDispatch();

    const { width, height, zoom, offsetX, offsetY, displayGrid, /*snapToGrid, gridInterval*/ } = useSelector( state => state.artboard );

    const { activeShape, inactiveShapes } = useSelector( state => state.shapes );
    
    const editMode = useSelector( state => state.editMode );
  
    const [ mouseDown, setMouseDown ] = useState( null );
  
    const handleMouseDown = useCallback( mouseDownEvent => {
      setMouseDown( { x: mouseDownEvent.clientX, y: mouseDownEvent.clientY, target: mouseDownEvent.target } );
    }, [] );
  
    const handleMouseUp = useCallback( () => setMouseDown( null ), [] );
  
    const handleMouseMove = useCallback( mouseMoveEvent => {
      if ( mouseDown && editMode === "zoom" ) {
        dispatch( setArtboardOffset( {
          offsetX: offsetX + ( ( mouseMoveEvent.clientY - mouseDown.y ) / document.documentElement.clientHeight * 100 ),
          offsetY: offsetY + ( ( mouseMoveEvent.clientX - mouseDown.x ) / document.documentElement.clientWidth * 100 ),
        } ) );
      } else if ( mouseDown && editMode === "path" ) {
        if ( mouseDown.target.dataset.name === "point" ) {
          activePath.adjustDescriptorPoint(
            mouseDown.target.dataset.command,
            ( mouseMoveEvent.clientX - mouseDown.x ),
            ( mouseMoveEvent.clientY - mouseDown.y )
          );
          dispatch( updateActiveShape( activePath.toString() ) );
        } else if ( mouseDown.target.dataset.name === "startHandle" ) {
          activePath.adjustStartHandlePoint(
            mouseDown.target.dataset.command,
            ( mouseMoveEvent.clientX - mouseDown.x ),
            ( mouseMoveEvent.clientY - mouseDown.y )
          );
          dispatch( updateActiveShape( activePath.toString() ) );
        } else if ( mouseDown.target.dataset.name === "endHandle" ) {
          activePath.adjustEndHandlePoint(
            mouseDown.target.dataset.command,
            ( mouseMoveEvent.clientX - mouseDown.x ),
            ( mouseMoveEvent.clientY - mouseDown.y )
          );
          dispatch( updateActiveShape( activePath.toString() ) );
        };
      }
      if ( mouseDown ) setMouseDown( { x: mouseMoveEvent.clientX, y: mouseMoveEvent.clientY, target: mouseDown.target } );
    }, [ editMode, mouseDown, dispatch, offsetX, offsetY, activePath ] );
  
    const handleZoom = useCallback( zoomEvent => {
      if ( editMode === "zoom" && zoomEvent.deltaY > 0 ) dispatch( zoomInWheel() );
      if ( editMode === "zoom" && zoomEvent.deltaY < 0 ) dispatch( zoomOutWheel() );
    }, [ editMode, dispatch ] );
  
    useEffect( () => {
      window.addEventListener( "wheel", handleZoom );
      window.addEventListener( "mousedown", handleMouseDown );
      window.addEventListener( "mouseup", handleMouseUp );
      window.addEventListener( "mousemove", handleMouseMove );
      return () => {
        window.removeEventListener( "wheel", handleZoom );
        window.removeEventListener( "mousedown", handleMouseDown );
        window.removeEventListener( "mouseup", handleMouseUp );
        window.removeEventListener( "mousemove", handleMouseMove );
      };
    }, [ handleZoom, handleMouseDown, handleMouseUp, handleMouseMove ] );

    return <>
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
          { activeShape && <Shape
            descriptor={ activeShape }
            setActive={ setActivePath }
          /> }
          { inactiveShapes.map( ( shape, index ) => <Shape
            key={ index }
            descriptor={ shape }
            setActive={ setActivePath }
          /> ) }
      </StyledArtboard>
      { displayGrid && <ArtboardGrid /> }
    </>;

}
