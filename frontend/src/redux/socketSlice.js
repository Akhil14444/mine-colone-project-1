import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  socketId: null, // Store only the socket ID, not the whole socket object
  userId: null,
};

const socketSlice = createSlice({
  name: "socketio",
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socketId = action.payload?.socketId || null;
      state.userId = action.payload?.userId || null;
    },
    clearSocket: (state) => {
      state.socketId = null;
      state.userId = null;
    },
  },
});

export const { setSocket, clearSocket } = socketSlice.actions;
export default socketSlice.reducer;
