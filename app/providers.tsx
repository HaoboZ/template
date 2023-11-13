import ComponentComposer, { component } from '@/src/helpers/componentComposer';
import EventsProvider from '@/src/providers/events';
import ThemeRegistry from '@/src/providers/theme';
import ModalProvider from '@/src/providers/modal';
import type { ReactNode } from 'react';
import StoreProvider from '@/src/store/provider';
import ClientSnackbarProvider from '@/src/providers/snackbar';

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<ComponentComposer
			components={[
				// data
				component(EventsProvider),
				component(ThemeRegistry),
				component(StoreProvider),
				// components
				component(ClientSnackbarProvider),
				component(ModalProvider),
			]}>
			{children}
		</ComponentComposer>
	);
}
