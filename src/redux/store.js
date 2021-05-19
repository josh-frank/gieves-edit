import { configureStore } from "@reduxjs/toolkit";
import artboardReducer from "./artboardSlice"
import shapesReducer from "./shapesSlice"

const store = configureStore( {
    reducer: {
        artboardDisplayOptions: artboardReducer,
        shapes: shapesReducer
    }
  } );

export default store;
