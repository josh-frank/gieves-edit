import { useCallback, useEffect, useState } from 'react';
import './App.css';
import Artboard from './components/Artboard';

function App() {

  const [ artboardPosition, setArtboardPosition ] = useState( {
    zoom: 1.0,
    offsetX: 50.0,
    offsetY: 50.0
  } );

  // const handleClick = useCallback( clickEvent => {
  //   console.log( `x:${ clickEvent.clientX } y:${ clickEvent.clientY }` );
  // }, [] );

  // useEffect( () => {
  //   window.addEventListener( "click", handleClick );
  //   return () => window.removeEventListener( "click", handleClick );
  // }, [ handleClick ] );

  // const handleScroll = useCallback( scrollEvent => {
  //   console.log('scrollEvent: ', scrollEvent);
  // }, [] );

  // useEffect( () => {
  //   window.addEventListener( "scroll", handleScroll );
  //   return () => window.removeEventListener( "scroll", handleScroll );
  // }, [ handleScroll ] );

  return (
    <>
      <Artboard
        width={ 300 }
        height={ 300 }
        position={ artboardPosition }
        shapes={ [
          "m 0 0 l 50 0 l 0 50 l -50 0 l 0 -50",
          "m 150, 150 a 25,25 0 1,1 50,0 a 25,25 0 1,1 -50,0"
        ] }
      />
    </>
  );

}

export default App;
