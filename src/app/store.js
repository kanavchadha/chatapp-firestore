import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import threadReducer from '../features/thread/threadSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    thread: threadReducer
  },
});
