import { Close as CloseIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import type { ReactNode } from 'react';
import { useMemo, useRef } from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import ComponentComposer, { component } from '../../helpers/componentComposer';
import EventsProvider from '../../providers/events';
import IndicatorProvider from '../../providers/indicator';
import ModalProvider from '../../providers/modal';
import ThemeProvider from '../../providers/theme';
import { persistor, store } from '../../store';

export default function Providers( { children }: { children: ReactNode } ) {
	const queryClient = useMemo( () => new QueryClient( {
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false
				// staleTime           : 60 * 1000
			}
		}
	} ), [] );
	const snackbarRef = useRef<SnackbarProvider>();
	
	return (
		<ComponentComposer components={[
			// data
			component( StoreProvider, { store } ),
			component( PersistGate, { loading: null, persistor } ),
			component( EventsProvider ),
			component( QueryClientProvider, { client: queryClient } ),
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
