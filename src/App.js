import './App.css';

import { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { addShape } from './redux/shapesSlice';
import { zoomInButton, zoomOutButton } from './redux/artboardSlice';

import Artboard from './components/Artboard';
import ArtboardPanel from './components/ArtboardPanel';
import Menu from './components/MenuPanel';

const testShapes = [
  "m 25,25 l 50,0 l 0,50 l -50,0 z",
  "m 150,150 a 25,25 0 1,1 50,0 a 25,25 0 1,1 -50,0 z",
  "m 372 68 h -101 c -5 0 -9 4 -9 9 h 119 c 0 -5 -4 -9 -9 -9 z",
  "m 120 100 v -10 a 10 10 0 1 1 20 20 l -20 -10 z",
  "m 40 254 s 35 -27 30 -69 s 33 -49 75 -25 z",
  "m 314 178 l 96 -112 l 48 -16 l -16 48 l -112 96 c 16 16 16 32 32 15 c 0 16 16 32 0 32 a 22.72 22.72 90 0 1 -16 16 a 80 80 90 0 0 -32 -48 q -8 -1.6 -8 8 t -24 20.8 t -12.8 -12.8 t 20.8 -24 t 8 -8 a 80 80 90 0 0 -48 -32 a 22.72 22.72 90 0 1 16 -16 c 0 -16 16 0 32 0 c -16 16 0 16 16 33 l 96 -112 l 0 32 l 32 0 l -28.8 -3.2 l -3.2 -28.8 z"
];

function App() {

  const dispatch = useDispatch();

  useEffect( () => testShapes.forEach( shape => dispatch( addShape( shape ) ) ), [ dispatch ] );

  const ZoomButtons = () => <div className="zoom-buttons">
    <button onClick={ () => dispatch( zoomInButton() ) }>➕</button>
    <button onClick={ () => dispatch( zoomOutButton() ) }>➖</button>
  </div>;

  return <>
    <Menu />
    <ZoomButtons />
    <Artboard />
    <ArtboardPanel />
  </>;

}

export default App;
