import { createSlice } from "@reduxjs/toolkit";

const shapesSlice = createSlice( {
    name: "shapes",
    initialState: {
        inactiveShapes: [],
        activeShapes: []
    },
    reducers: {
        addShape( state, action ) {
            return {
                inactiveShapes: [ ...state.inactiveShapes, action.payload ],
                activeShapes: state.activeShapes
            };
        },
        removeShape( state, action ) {
            return {
                inactiveShapes: state.inactiveShapes.filter( shape => shape !== action.payload ),
                activeShapes: state.activeShapes.filter( shape => shape !== action.payload )
            };
        },
        activateShape( state, action ) {
            return {
                inactiveShapes: state.inactiveShapes.filter( shape => shape !== action.payload ),
                activeShapes: [ ...state.activeShapes, action.payload ]
            };           
        },
        deactivateShape( state, action ) {
            return {
                inactiveShapes: [ ...state.inactiveShapes, action.payload ],
                activeShapes: state.activeShapes.filter( shape => shape !== action.payload )
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