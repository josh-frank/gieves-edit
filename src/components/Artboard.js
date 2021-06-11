import { useCallback, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { setArtboardOffset, zoomInWheel, zoomOutWheel } from "../redux/artboardSlice";
import { updateActiveShape } from "../redux/shapesSlice";

import styled from "styled-components";

import ArtboardGrid from "./ArtboardGrid";
import Shape from "./Shape";
import { Path } from "../utilities/PathParser";

const ArtboardFrame = styled.rect.attrs( ( { zoom } ) => ( {
  style: {
    outline: `${ zoom / 100 }px solid #999999`,
    // boxShadow: `${ zoom * 5 }px ${ zoom * 5 }px ${ zoom * 2 }px ${ zoom * 2 }px #999999`
  },
} ) )`position: absolute; top: 0; left: 0;`;

export default function Artboard() {

    const dispatch = useDispatch();

    const { width, height, zoom, offsetX, offsetY, displayGrid, dark } = useSelector( state => state.artboard );
    const { activeShape, inactiveShapes } = useSelector( state => state.shapes );
    const editMode = useSelector( state => state.editMode );

    const [ mouseDown, setMouseDown ] = useState( null );

    const [ clientDimensions, setClientDimensions ] = useState( { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight } );
    
    const handleMouseDown = useCallback( mouseDownEvent => {
      setMouseDown( { x: mouseDownEvent.clientX, y: mouseDownEvent.clientY, target: mouseDownEvent.target } );
    }, [] );
    
    const handleMouseUp = useCallback( () => setMouseDown( null ), [] );
    
    const handleMouseMove = useCallback( mouseMoveEvent => {
      if ( mouseDown && editMode === "pan" ) {
        dispatch( setArtboardOffset( {
          offsetX: offsetX + ( ( mouseMoveEvent.clientY - mouseDown.y ) ),
          offsetY: offsetY + ( ( mouseMoveEvent.clientX - mouseDown.x ) ),
        } ) );
      } else if ( mouseDown && editMode === "path" ) {
        const activePath = activeShape && new Path( activeShape );
        if ( mouseDown.target.dataset.name === "point" ) {
          activePath.adjustDescriptorPoint(
            mouseDown.target.dataset.commandIndex,
            ( mouseMoveEvent.clientX - offsetY ) / zoom * 100,
            ( mouseMoveEvent.clientY - offsetX ) / zoom * 100
          );
          dispatch( updateActiveShape( activePath.toString() ) );
        } else if ( mouseDown.target.dataset.name === "startHandle" ) {
          activePath.adjustStartHandlePoint(
            mouseDown.target.dataset.commandIndex,
            ( mouseMoveEvent.clientX - offsetY ) / zoom * 100,
            ( mouseMoveEvent.clientY - offsetX ) / zoom * 100
          );
          dispatch( updateActiveShape( activePath.toString() ) );
        } else if ( mouseDown.target.dataset.name === "endHandle" ) {
          activePath.adjustEndHandlePoint(
            mouseDown.target.dataset.commandIndex,
            ( mouseMoveEvent.clientX - offsetY ) / zoom * 100,
            ( mouseMoveEvent.clientY - offsetX ) / zoom * 100
          );
          dispatch( updateActiveShape( activePath.toString() ) );
        };
      }
      if ( mouseDown ) setMouseDown( { x: mouseMoveEvent.clientX, y: mouseMoveEvent.clientY, target: mouseDown.target } );
    }, [ editMode, mouseDown, dispatch, offsetX, offsetY, zoom, activeShape ] );
  
    const handleZoom = useCallback( zoomEvent => {
      if ( editMode === "pan" && zoomEvent.deltaY > 0 ) dispatch( zoomInWheel() );
      if ( editMode === "pan" && zoomEvent.deltaY < 0 ) dispatch( zoomOutWheel() );
    }, [ editMode, dispatch ] );
  
    const handleResize = useCallback( resizeEvent => {
      setClientDimensions( { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight } );
    }, [] );
  
    useEffect( () => {
      window.addEventListener( "wheel", handleZoom );
      window.addEventListener( "mousedown", handleMouseDown );
      window.addEventListener( "mouseup", handleMouseUp );
      window.addEventListener( "mousemove", handleMouseMove );
      window.addEventListener( "resize", handleResize );
      return () => {
        window.removeEventListener( "wheel", handleZoom );
        window.removeEventListener( "mousedown", handleMouseDown );
        window.removeEventListener( "mouseup", handleMouseUp );
        window.removeEventListener( "mousemove", handleMouseMove );
        window.removeEventListener( "resize", handleResize );
      };
    }, [ handleZoom, handleMouseDown, handleMouseUp, handleMouseMove, handleResize ] );

    return <>
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        className={ "artboard" + ( dark ? " dark" : "" ) }
        width={ clientDimensions.width }
        height={ clientDimensions.height }
        zoom={ zoom / 100 }
        viewBox={ `0 0 ${ clientDimensions.width } ${ clientDimensions.height }` }
      >
        { displayGrid && <ArtboardGrid /> }
        <ArtboardFrame
          className="artboard-frame"
          width={ width }
          height={ height }
          zoom={ zoom }
          transform={ `translate( ${ offsetY.toFixed( 2 ) } ${ offsetX.toFixed( 2 ) } ) scale( ${ zoom / 100 } ${ zoom / 100 } )` }
          fill="none"
        />
        { activeShape && <Shape
          descriptor={ activeShape }
        /> }
        { inactiveShapes.map( ( shape, index ) => <Shape
          key={ index }
          descriptor={ shape }
        /> ) }
      </svg>
    </>;

}
