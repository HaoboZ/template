'use client';
import { colors, createTheme } from '@mui/material';

export default createTheme({
	cssVariables: { colorSchemeSelector: 'class' },
	colorSchemes: {
		light: {
			palette: { primary: { main: colors.blue[700] }, background: { paper: colors.grey[100] } },
		},
		dark: {
			palette: { primary: { main: colors.blue[700] }, background: { paper: colors.grey[900] } },
		},
	},
	typography: {
		h1: { fontSize: 28, fontWeight: 'bold' },
		h2: { fontSize: 26 },
		h3: { fontSize: 24 },
		h4: { fontSize: 22 },
		h5: { fontSize: 20 },
		h6: { fontSize: 18 },
		fontFamily: 'var(--font-roboto)',
	},
	components: {
		MuiTextField: { defaultProps: { size: 'small', fullWidth: true } },
		MuiTable: { defaultProps: { size: 'small' } },
		MuiFormControl: { defaultProps: { fullWidth: true } },
	},
});
