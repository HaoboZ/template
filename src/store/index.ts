import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { debounce } from '../helpers/delay';
import { loadState, saveState } from './persist';
import main from './reducers/mainReducer';

const rootReducer = combineReducers({ main });

export const store = configureStore({
	reducer: rootReducer,
	devTools: process.env.NODE_ENV === 'development',
	preloadedState: loadState(),
});

store.subscribe(debounce(() => saveState(store.getState()), 500));

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
