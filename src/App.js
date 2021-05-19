// import { useCallback, useEffect } from 'react';
import './App.css';
import Artboard from './components/Artboard';

function App() {

  // const handleClick = useCallback( clickEvent => {
  //   console.log( `x:${ clickEvent.clientX } y:${ clickEvent.clientY }` );
  // }, [] );

  // useEffect( () => {
  //   window.addEventListener( "click", handleClick );
  //   return () => window.removeEventListener( "click", handleClick );
  // }, [ handleClick ] );

  return (
    <>
      <Artboard
        width="300"
        height="300"
        shapes={ [
          "m 0 0 l 50 0 l 0 50 l -50 0 l 0 -50",
          "m 150, 150 a 25,25 0 1,1 50,0 a 25,25 0 1,1 -50,0"
        ] }
      />
    </>
  );

}

export default App;
