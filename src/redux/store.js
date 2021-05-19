import { configureStore } from "@reduxjs/toolkit";
import artboardReducer from "./artboardSlice"

const store = configureStore( {
    reducer: {
        artboardDisplayOptions: artboardReducer,
    }
  } );

export default store;
