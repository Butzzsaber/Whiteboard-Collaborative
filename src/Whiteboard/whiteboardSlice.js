import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tool: null,
  elements: []
};

const whiteboardSlice = createSlice({
  name: 'whiteboard',
  initialState,
  reducers: {
    setToolType: (state, action) => {
      state.tool = action.payload;
    },
    updateElements: (state, action) => {
      const {id} = action.payload;

      const index = state.elements.findIndex((element)=> element.id === id);

      if(index === -1){
        state.elements.push(action.payload);
      }
      else{

      }
    },
  },
  setElements: (state, action) => {
    state.elements = action.payload;
  },
});

export const { setToolType, updateElements,setElements} = whiteboardSlice.actions;

export default whiteboardSlice.reducer;