import {
	colors,
	createTheme,
	CssBaseline,
	darkScrollbar,
	PaletteMode,
	responsiveFontSizes,
	ThemeOptions,
	ThemeProvider as MuiThemeProvider,
	useMediaQuery
} from '@mui/material';
import { merge } from 'lodash-es';
import Head from 'next/head';
import { useMemo } from 'react';
import { useAppSelector } from '../store/hooks';

const commonTheme: ThemeOptions = {
	palette   : {
		primary  : { main: colors.lightBlue[ '600' ] },
		secondary: { main: colors.red[ '900' ] }
	},
	typography: {
		h1: { fontSize: 28 },
		h2: { fontSize: 24 },
		h3: { fontSize: 22 },
		h4: { fontSize: 20 },
		h5: { fontSize: 18 },
		h6: { fontSize: 16 }
	},
	components: {
		MuiUseMediaQuery: {
			defaultProps: { noSsr: true }
		}
	}
};

const lightTheme = responsiveFontSizes( createTheme(
	merge( commonTheme, {
		palette: { mode: 'light' }
	} )
) );

const darkTheme = responsiveFontSizes( createTheme(
	merge( commonTheme, {
		palette   : { mode: 'dark' },
		components: {
			MuiCssBaseline: {
				styleOverrides: {
					body: darkScrollbar()
				}
			},
			MuiAppBar     : {
				styleOverrides: {
					root: { backgroundImage: 'none' }
				}
			}
		}
	} )
) );

export default function ThemeProvider( { children } ) {
	const dark = useMediaQuery( '(prefers-color-scheme: dark)' );
	const themeMode = useAppSelector( ( { main } ) => main.theme );
	
	const mode: PaletteMode = useMemo( () => {
		switch ( themeMode ) {
		case 'light':
		case 'dark':
			return themeMode;
		default:
			return dark ? 'dark' : 'light';
		}
	}, [ themeMode, dark ] );
	
	const theme = mode === 'dark' ? darkTheme : lightTheme;
	
	return (
		<MuiThemeProvider theme={theme}>
			<CssBaseline/>
			<Head>
				<meta key='theme' name='theme-color' content={theme.palette.primary.main}/>
			</Head>
			{children}
		</MuiThemeProvider>
	);
}
