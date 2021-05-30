import { configureStore } from "@reduxjs/toolkit";
import artboardReducer from "./artboardSlice"
import shapesReducer from "./shapesSlice"
import modeReducer from "./modeSlice"

const store = configureStore( {
    reducer: {
        artboardDisplayOptions: artboardReducer,
        shapes: shapesReducer,
        editMode: modeReducer
    }
  } );

export default store;
