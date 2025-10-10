import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import thunk from 'redux-thunk';
import authReducer from './slices/authSlices';
import interviewReducer from './slices/interviewSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    interview: interviewReducer,
})

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'interview'], // only auth and interview will be persisted
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({ serializableCheck: false })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);