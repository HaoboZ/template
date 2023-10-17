import type { ThemeOptions } from '@mui/material';
import { colors, createTheme, darkScrollbar, responsiveFontSizes } from '@mui/material';
import { merge } from 'lodash';

const commonTheme: ThemeOptions = {
	palette: {
		primary: { main: colors.lightBlue['600'] },
		secondary: { main: colors.red['900'] },
	},
	typography: {
		h1: { fontSize: 28 },
		h2: { fontSize: 24 },
		h3: { fontSize: 22 },
		h4: { fontSize: 20 },
		h5: { fontSize: 18 },
		h6: { fontSize: 16 },
	},
};

export const lightTheme = responsiveFontSizes(
	createTheme(
		merge(commonTheme, {
			palette: {
				mode: 'light',
				background: { paper: colors.grey['100'] },
			},
		}),
	),
);

export const darkTheme = responsiveFontSizes(
	createTheme(
		merge(commonTheme, {
			palette: {
				mode: 'dark',
				background: { paper: colors.grey['900'] },
			},
			components: {
				MuiCssBaseline: {
					styleOverrides: {
						body: darkScrollbar(),
					},
				},
				MuiAppBar: {
					styleOverrides: {
						root: { backgroundImage: 'none' },
					},
				},
			},
		}),
	),
);
