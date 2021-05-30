import { createSlice } from "@reduxjs/toolkit";

const shapesSlice = createSlice( {
    name: "shapes",
    initialState: {
        inactiveShapes: [],
        activeShape: null
    },
    reducers: {
        addShape( state, action ) {
            return {
                inactiveShapes: [ ...state.inactiveShapes, action.payload ],
                activeShape: state.activeShape
            };
        },
        removeShape( state, action ) {
            return {
                inactiveShapes: state.inactiveShapes.filter( shape => shape !== action.payload ),
                activeShape: action.payload === state.activeShape ? null : state.activeShape
            };
        },
        activateShape( state, action ) {
            const filteredShapes = state.inactiveShapes.filter( shape => shape !== action.payload );
            return {
                inactiveShapes: state.activeShape ? [ ...filteredShapes, state.activeShape ] : filteredShapes,
                activeShape: action.payload
            };           
        },
        deactivateShape( state, action ) {
            return {
                inactiveShapes: [ ...state.inactiveShapes, action.payload ],
                activeShape: null
            };
        }
    }
} );

export const {
    addShape,
    removeShape,
    activateShape,
    deactivateShape
} = shapesSlice.actions;
export default shapesSlice.reducer;