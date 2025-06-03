import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice.js';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { combineReducers } from 'redux';

// Combine reducers if you plan to have more slices later
const rootReducer = combineReducers({
  auth: authSlice
});

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // only persist the 'auth' slice
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
const store = configureStore({
  reducer: persistedReducer
});

// Create the persistor
export const persistor = persistStore(store);

export default store;
