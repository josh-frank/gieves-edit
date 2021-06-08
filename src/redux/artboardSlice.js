import { createSlice } from "@reduxjs/toolkit";

const artboardSlice = createSlice( {
    name: "artboard",
    initialState: {
        width: 1000,
        height: 800,
        zoom: 100,
        offsetX: ( document.documentElement.clientHeight - 800 ) / 2,
        offsetY: ( document.documentElement.clientWidth - 1000 ) / 2,
        displayGrid: true,
        gridInterval: 10,
        dark: false
    },
    reducers: {
        setArtboardDimensions( state, action ) {
            return { ...state, width: action.payload.width || state.width, height: action.payload.height || state.height };
        },
        setZoom( state, action ) {
            return { ...state, zoom: action.payload };
        },
        zoomInWheel( state ) {
            return { ...state, zoom: Math.min( state.zoom + 6.25, 625 ) };
        },
        zoomOutWheel( state ) {
            return { ...state, zoom: Math.max( state.zoom - 6.25, 6.25 ) };
        },
        zoomInButton( state ) {
            return { ...state, zoom: Math.min( state.zoom + 10, 625 ) };
        },
        zoomOutButton( state ) {
            return { ...state, zoom: Math.max( state.zoom - 10, 6.25 ) };
        },
        setArtboardOffset( state, action ) {
            return { ...state, offsetX: action.payload.offsetX || state.offsetX, offsetY: action.payload.offsetY || state.offsetY };
        },
        moveArtboardLeft( state ) {
            return { ...state, offsetY: state.offsetY - 0.5 };
        },
        moveArtboardRight( state ) {
            return { ...state, offsetY: state.offsetY + 0.5 };
        },
        moveArtboardUp( state ) {
            return { ...state, offsetX: state.offsetX - 0.5 };
        },
        moveArtboardDown( state ) {
            return { ...state, offsetX: state.offsetX + 0.5 };
        },
        toggleGridDisplay( state ) {
            return { ...state, displayGrid: !state.displayGrid };
        },
        setGridInterval( state, action ) {
            return { ...state, gridInterval: Math.min( Math.max( Math.round( action.payload ), 5 ), 100 ) };
        },
        toggleDark( state ) {
            return { ...state, dark: !state.dark };
        }
    }
} );

export const {
    setArtboardDimensions,
    setZoom,
    zoomInWheel,
    zoomOutWheel,
    zoomInButton,
    zoomOutButton,
    setArtboardOffset,
    moveArtboardLeft,
    moveArtboardRight,
    moveArtboardUp,
    moveArtboardDown,
    toggleGridDisplay,
    setGridInterval,
    toggleDark
} = artboardSlice.actions;
export default artboardSlice.reducer;
