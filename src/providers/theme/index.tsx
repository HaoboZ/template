'use client';
import type { PaletteMode } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useAppSelector } from '../../store/hooks';
import NextAppDirEmotionCacheProvider from './emotionCache';
import { darkTheme, lightTheme } from './options';

export default function ThemeRegistry({ children }: { children: ReactNode }) {
	const light = useMediaQuery('(prefers-color-scheme: light)');
	const themeMode = useAppSelector(({ main }) => main.theme);

	const mode: PaletteMode = useMemo(() => {
		switch (themeMode) {
			case 'light':
			case 'dark':
				return themeMode;
			default:
				return light ? 'light' : 'dark';
		}
	}, [themeMode, light]);

	return (
		<NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
			<ThemeProvider theme={mode === 'dark' ? darkTheme : lightTheme}>
				{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
				<CssBaseline />
				{children}
			</ThemeProvider>
		</NextAppDirEmotionCacheProvider>
	);
}
