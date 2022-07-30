import type { EmotionCache } from '@emotion/cache';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { Close as CloseIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import type { ReactNode } from 'react';
import { useRef } from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import ComponentComposer, { component } from '../../helpers/componentComposer';
import EventsProvider from '../../providers/events';
import IndicatorProvider from '../../providers/indicator';
import ModalProvider from '../../providers/modal';
import ThemeProvider from '../../providers/theme';
import { persistor, store } from '../../store';

const clientCache = createCache( { key: 'css', prepend: true } );

export default function Providers( { emotionCache, children }: {
	emotionCache: EmotionCache,
	children: ReactNode
} ) {
	const snackbarRef = useRef<SnackbarProvider>();
	
	return (
		<ComponentComposer components={[
			// data
			component( StoreProvider, { store } ),
			component( PersistGate, { loading: null, persistor } ),
			// styling
			component( CacheProvider, { value: emotionCache || clientCache } ),
			component( ThemeProvider ),
			// static
			component( EventsProvider ),
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
			// dynamic
			component( ModalProvider )
		]}>
			{children}
		</ComponentComposer>
	);
}
