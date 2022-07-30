import type { Theme } from '@mui/material';
import { useMediaQuery } from '@mui/material';

export function useWideMedia() {
	return useMediaQuery<Theme>( ( { breakpoints } ) => breakpoints.up( 'sm' ) );
}
