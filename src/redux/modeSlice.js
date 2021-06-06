import { createSlice } from "@reduxjs/toolkit";

const modeSlice = createSlice( {
    name: "editMode",
    initialState: "pan",
    reducers: {
        panMode() { return "pan"; },
        pathMode() { return "path"; }
    }
} );

export const { panMode, pathMode } = modeSlice.actions;
export default modeSlice.reducer;