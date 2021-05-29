import './App.css';

import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setArtboardOffset, zoomIn, zoomOut } from './redux/artboardSlice';
import { addShape } from './redux/shapesSlice';

import Artboard from './components/Artboard';
import ArtboardInfo from './components/ArtboardInfo';
import Menu from './components/Menu';

const testShapes = [
  "m 25,25 l 50,0 l 0,50 l -50,0 z",
  "m 150,150 a 25,25 0 1,1 50,0 a 25,25 0 1,1 -50,0 z",
];

function App() {

  const dispatch = useDispatch();

  const artboardDisplayOptions = useSelector( state => state.artboardDisplayOptions );

  const [ dragActive, setDragActive ] = useState( false );
  const [ mouseDownCoordinates, setMouseDownCoordinates ] = useState( { x: null, y: null } );

  const handleMouseDown = useCallback( mouseDownEvent => {
    setDragActive( true );
    setMouseDownCoordinates( { x: mouseDownEvent.clientX, y: mouseDownEvent.clientY } );
  }, [] );

  const handleMouseUp = useCallback( () => setDragActive( false ), [] );

  const handleMouseMove = useCallback( mouseMoveEvent => {
    if ( dragActive ) {
      dispatch( setArtboardOffset( {
        offsetX: artboardDisplayOptions.offsetX + ( ( mouseMoveEvent.clientY - mouseDownCoordinates.y ) / document.documentElement.clientHeight * 100 ),
        offsetY: artboardDisplayOptions.offsetY + ( ( mouseMoveEvent.clientX - mouseDownCoordinates.x ) / document.documentElement.clientWidth * 100 ),
      } ) );
      setMouseDownCoordinates( { x: mouseMoveEvent.clientX, y: mouseMoveEvent.clientY } );
    }
  }, [ dragActive, artboardDisplayOptions, mouseDownCoordinates, dispatch ] );

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
      <Artboard />
      <ArtboardInfo artboardDisplayOptions={ artboardDisplayOptions } />
    </>
  );

}

export default App;
