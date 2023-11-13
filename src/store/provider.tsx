'use client';
import { store } from '.';
import { Provider } from 'react-redux';
import type { ReactNode } from 'react';

export default function StoreProvider({ children }: { children: ReactNode }) {
	return <Provider store={store}>{children}</Provider>;
}
