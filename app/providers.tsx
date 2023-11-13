import ComponentComposer, { component } from '@/src/helpers/componentComposer';
import EventsProvider from '@/src/providers/events';
import ThemeRegistry from '@/src/providers/theme';
import { store } from '@/src/store';
import SnackbarAction from '@/src/providers/snackbar/action';
import ModalProvider from '@/src/providers/modal';
import { SnackbarProvider } from 'notistack';
import { Provider as StoreProvider } from 'react-redux';
import type { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<ComponentComposer
			components={[
				// data
				component(EventsProvider),
				component(ThemeRegistry),
				component(StoreProvider, { store }),
				// components
				component(SnackbarProvider, { preventDuplicate: true, action: SnackbarAction }),
				component(ModalProvider),
			]}>
			{children}
		</ComponentComposer>
	);
}
