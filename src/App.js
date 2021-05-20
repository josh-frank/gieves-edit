import './App.css';

import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { moveArtboardDown, moveArtboardLeft, moveArtboardRight, moveArtboardUp, zoomIn, zoomOut } from './redux/artboardSlice';
import { addShape } from './redux/shapesSlice';

import Artboard from './components/Artboard';
import ArtboardViewInfo from './components/ArtboardViewInfo';

const testShapes = [
  "m 25,25 l 50,0 l 0,50 l -50,0 z",
  "m 150,150 a 25,25 0 1,1 50,0 a 25,25 0 1,1 -50,0 z"
];

function App() {

  const dispatch = useDispatch();

  const [ dragActive, setDragActive ] = useState( false );
  const [ mouseDownCoordinates, setMouseDownCoordinates ] = useState( { x: null, y: null } );

  const handleMouseDown = useCallback( mouseDownEvent => {
    setDragActive( true );
    setMouseDownCoordinates( { x: mouseDownEvent.clientX, y: mouseDownEvent.clientY } );
  }, [] );

  const handleMouseUp = useCallback( () => setDragActive( false ), [] );

  const handleMouseMove = useCallback( mouseMoveEvent => {
    if ( dragActive && mouseMoveEvent.clientX < mouseDownCoordinates.x ) dispatch( moveArtboardLeft() ); 
    if ( dragActive && mouseMoveEvent.clientX > mouseDownCoordinates.x ) dispatch( moveArtboardRight() ); 
    if ( dragActive && mouseMoveEvent.clientY < mouseDownCoordinates.y ) dispatch( moveArtboardUp() ); 
    if ( dragActive && mouseMoveEvent.clientY > mouseDownCoordinates.y ) dispatch( moveArtboardDown() ); 
    setMouseDownCoordinates( { x: mouseMoveEvent.clientX, y: mouseMoveEvent.clientY } );
  }, [ dragActive, mouseDownCoordinates, dispatch ] );

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

  useEffect( () => testShapes.forEach( shape => dispatch( addShape( shape ) ) ), [ dispatch ] );

  return (
    <>
      <Artboard />
      <ArtboardViewInfo />
    </>
  );

}

export default App;
