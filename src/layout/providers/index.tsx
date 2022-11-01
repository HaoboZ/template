'use client';
import { Close as CloseIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import type { ReactNode } from 'react';
import { useRef } from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import ComponentComposer, { component } from '../../helpers/componentComposer';
import { persistor, store } from '../../store';
import EventsProvider from './events';
import IndicatorProvider from './indicator';
import ModalProvider from './modal';
import ThemeProvider from './theme';

export default function Providers( { children }: { children: ReactNode } ) {
	const snackbarRef = useRef<SnackbarProvider>();
	
	return (
		<ComponentComposer components={[
			// data
			component( StoreProvider, { store } ),
			component( PersistGate, { loading: null, persistor } ),
			component( EventsProvider ),
			// styling
			component( ThemeProvider ),
			// visual
			component( SnackbarProvider, {
				ref             : snackbarRef,
				preventDuplicate: true,
				action          : ( key ) => (
					<IconButton onClick={() => snackbarRef.current.closeSnackbar( key )}>
						<CloseIcon/>
					</IconButton>
				)
			} ),
			component( IndicatorProvider ),
			component( ModalProvider )
		]}>
			{children}
		</ComponentComposer>
	);
}
