import './App.css';

import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Artboard from './components/Artboard';
import { zoomIn, zoomOut } from './redux/artboardSlice';

function App() {

  const dispatch = useDispatch();

  // const handleClick = useCallback( clickEvent => {
  //   console.log( `x:${ clickEvent.clientX } y:${ clickEvent.clientY }` );
  // }, [] );

  // useEffect( () => {
  //   window.addEventListener( "click", handleClick );
  //   return () => window.removeEventListener( "click", handleClick );
  // }, [ handleClick ] );

  const handleZoom = useCallback( zoomEvent => {
    if ( zoomEvent.deltaY > 0 ) { dispatch( zoomIn() ); }
    else if ( zoomEvent.deltaY < 0 ) { dispatch( zoomOut() ); }
  }, [ dispatch ] );

  useEffect( () => {
    window.addEventListener( "wheel", handleZoom );
    return () => window.removeEventListener( "wheel", handleZoom );
  }, [ handleZoom ] );

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
