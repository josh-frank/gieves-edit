import './App.css';

import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setArtboardOffset, zoomIn, zoomOut } from './redux/artboardSlice';
import { addShape } from './redux/shapesSlice';

import Artboard from './components/Artboard';
import ArtboardInfo from './components/ArtboardInfo';
import Menu from './components/Menu';
import ZoomButtons from './components/ZoomButtons';

const testShapes = [
  "m 25,25 l 50,0 l 0,50 l -50,0 z",
  "m 150,150 a 25,25 0 1,1 50,0 a 25,25 0 1,1 -50,0 z",
  "m 372 68 h -101 c -5 0 -9 4 -9 9 h 119 c 0 -5 -4 -9 -9 -9 z",
  "m 120 100 v -10 a 10 10 0 1 1 20 20 l -20 -10 z",
  "m 40 254 s 35 -27 30 -69 s 33 -49 75 -25 z",
  "m 314 178 l 96 -112 l 48 -16 l -16 48 l -112 96 c 16 16 16 32 32 15 c 0 16 16 32 0 32 a 22.72 22.72 90 0 1 -16 16 a 80 80 90 0 0 -32 -48 q -8 -1.6 -8 8 t -24 20.8 t -12.8 -12.8 t 20.8 -24 t 8 -8 a 80 80 90 0 0 -48 -32 a 22.72 22.72 90 0 1 16 -16 c 0 -16 16 0 32 0 c -16 16 0 16 16 33 l 96 -112 l 0 32 l 32 0 l -28.8 -3.2 l -3.2 -28.8"
];

function App() {

  const dispatch = useDispatch();

  const artboardDisplayOptions = useSelector( state => state.artboardDisplayOptions );

  const [ mouseDownCoordinates, setMouseDownCoordinates ] = useState( null );

  const handleMouseDown = useCallback( mouseDownEvent => {
    setMouseDownCoordinates( { x: mouseDownEvent.clientX, y: mouseDownEvent.clientY } );
  }, [] );

  const handleMouseUp = useCallback( () => setMouseDownCoordinates( null ), [] );

  const handleMouseMove = useCallback( mouseMoveEvent => {
    if ( mouseDownCoordinates ) {
      dispatch( setArtboardOffset( {
        offsetX: artboardDisplayOptions.offsetX + ( ( mouseMoveEvent.clientY - mouseDownCoordinates.y ) / document.documentElement.clientHeight * 100 ),
        offsetY: artboardDisplayOptions.offsetY + ( ( mouseMoveEvent.clientX - mouseDownCoordinates.x ) / document.documentElement.clientWidth * 100 ),
      } ) );
      setMouseDownCoordinates( { x: mouseMoveEvent.clientX, y: mouseMoveEvent.clientY } );
    }
  }, [ mouseDownCoordinates, artboardDisplayOptions, dispatch ] );

  const handleZoom = useCallback( zoomEvent => {
    if ( zoomEvent.deltaY > 0 ) dispatch( zoomIn() );
    if ( zoomEvent.deltaY < 0 ) dispatch( zoomOut() );
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
      <Menu />
      <ZoomButtons />
      <Artboard />
      <ArtboardInfo />
    </>
  );

}

export default App;
