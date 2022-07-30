import { Box } from '@mui/material';
import type { ReactNode } from 'react';
import useLoading from '../../hooks/useLoading';

export default function Loading( { isLoading, delay, children }: {
	isLoading?: boolean,
	delay?: number,
	children: ReactNode
} ) {
	const loading = useLoading( isLoading, delay );
	
	return (
		<Box sx={{
			opacity   : loading ? 0 : 1,
			transition: ( { transitions } ) => transitions.create( 'opacity' )
		}}>
			{children}
		</Box>
	);
}
