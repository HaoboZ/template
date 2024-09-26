import { Box, CircularProgress } from '@mui/material';

export default function Loading() {
	return (
		<Box display='flex' justifyContent='center' pt={5}>
			<CircularProgress />
		</Box>
	);
}
