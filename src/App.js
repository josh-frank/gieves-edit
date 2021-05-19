import './App.css';

import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import Artboard from './components/Artboard';
import { moveArtboardDown, moveArtboardLeft, moveArtboardRight, moveArtboardUp, zoomIn, zoomOut } from './redux/artboardSlice';

function App() {

  const dispatch = useDispatch();

  const [ clickActive, setClickActive ] = useState( false );
  const [ mouseDownCoordinates, setMouseDownCoordinates ] = useState( { x: null, y: null } );

  const handleMouseDown = useCallback( mouseDownEvent => {
    setClickActive( true );
    setMouseDownCoordinates( { x: mouseDownEvent.clientX, y: mouseDownEvent.clientY } );
  }, [] );

  const handleMouseUp = useCallback( () => setClickActive( false ), [] );

  const handleMouseMove = useCallback( mouseMoveEvent => {
    if ( clickActive && mouseMoveEvent.clientX < mouseDownCoordinates.x ) dispatch( moveArtboardLeft() ); 
    if ( clickActive && mouseMoveEvent.clientX > mouseDownCoordinates.x ) dispatch( moveArtboardRight() ); 
    if ( clickActive && mouseMoveEvent.clientY < mouseDownCoordinates.y ) dispatch( moveArtboardUp() ); 
    if ( clickActive && mouseMoveEvent.clientY > mouseDownCoordinates.y ) dispatch( moveArtboardDown() ); 
    setMouseDownCoordinates( { x: mouseMoveEvent.clientX, y: mouseMoveEvent.clientY } );
  }, [ clickActive, mouseDownCoordinates, dispatch ] );

  const handleZoom = useCallback( zoomEvent => {
    if ( zoomEvent.deltaY > 0 ) { dispatch( zoomIn() ); }
    else if ( zoomEvent.deltaY < 0 ) { dispatch( zoomOut() ); }
  }, [ dispatch ] );

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

  return (
    <>
      <Artboard
        shapes={ [
          "m 25 25 l 50 0 l 0 50 l -50 0 l 0 -50",
          "m 150, 150 a 25,25 0 1,1 50,0 a 25,25 0 1,1 -50,0"
        ] }
      />
    </>
  );

}

export default App;
