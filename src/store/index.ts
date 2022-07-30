import { configureStore } from '@reduxjs/toolkit';
import {
	createMigrate,
	FLUSH,
	PAUSE,
	PERSIST,
	persistReducer,
	persistStore,
	PURGE,
	REGISTER,
	REHYDRATE
} from 'redux-persist';
import createCompressor from 'redux-persist-transform-compress';
import type { PersistedState } from 'redux-persist/es/types';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import { rootReducer } from './reducers';

type State = ReturnType<typeof rootReducer>;
export type RootState = State & PersistedState;

const migrations: Record<string, ( state: RootState ) => RootState> = {};

const persistedReducer = persistReducer<State>( {
	key            : 'root',
	version        : 11,
	storage,
	stateReconciler: autoMergeLevel2,
	migrate        : createMigrate( migrations, { debug: false } ),
	transforms     : [ createCompressor() ]
}, rootReducer );

export const store = configureStore( {
	reducer   : persistedReducer,
	devTools  : process.env.NODE_ENV === 'development',
	middleware: ( getDefaultMiddleware ) => getDefaultMiddleware( {
		serializableCheck: {
			ignoredActions: [ FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER ]
		}
	} )
} );

export const persistor = persistStore( store );

export type AppDispatch = typeof store.dispatch;
