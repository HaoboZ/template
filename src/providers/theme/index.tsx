import { Experimental_CssVarsProvider, getInitColorSchemeScript } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import type { ReactNode } from 'react';
import NextAppDirEmotionCacheProvider from './emotionCache';
import theme from './theme';

export default function ThemeRegistry({ children }: { children: ReactNode }) {
	return (
		<NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
			{getInitColorSchemeScript({ defaultMode: 'system' })}
			<Experimental_CssVarsProvider theme={theme}>
				<CssBaseline />
				{children}
			</Experimental_CssVarsProvider>
		</NextAppDirEmotionCacheProvider>
	);
}
