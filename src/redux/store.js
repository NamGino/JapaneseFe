import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import { persistStore, persistReducer } from 'redux-persist';
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const createBrowserStorage = () => {
  return {
    getItem(key) {
      return Promise.resolve(window.localStorage.getItem(key));
    },
    setItem(key, value) {
      window.localStorage.setItem(key, value);
      return Promise.resolve(value);
    },
    removeItem(key) {
      window.localStorage.removeItem(key);
      return Promise.resolve();
    },
  };
};

const storageAdapter =
  typeof window !== 'undefined' ? createBrowserStorage() : createNoopStorage();

const persistConfig = {
  key: 'root',
  storage: storageAdapter,
};

const rootReducer = combineReducers({
  user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);