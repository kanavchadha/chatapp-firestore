import { createSlice } from '@reduxjs/toolkit';

export const threadSlice = createSlice({
  name: 'thread',
  initialState: {
    threadId: null,
    threadName: null,
    threadAvatar: ''
  },
  reducers: {
    setThread : (state,action) => {
      state.threadId = action.payload.threadId;
      state.threadName = action.payload.threadName;
      state.threadAvatar = action.payload.threadAvatar;
    }
  },
});

export const { setThread } = threadSlice.actions;

export const selectThreadId = state => state.thread.threadId;
export const selectThreadName = state => state.thread.threadName;
export const selectThreadAvatar = state => state.thread.threadAvatar;

export default threadSlice.reducer;
