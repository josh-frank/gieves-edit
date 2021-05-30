import { createSlice } from "@reduxjs/toolkit";

const modeSlice = createSlice( {
    name: "editMode",
    initialState: "zoom",
    reducers: {
        zoomMode() { return "zoom"; },
        pathMode() { return "path"; }
    }
} );

export const { zoomMode, pathMode } = modeSlice.actions;
export default modeSlice.reducer;