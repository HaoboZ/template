import { Close as CloseIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useSnackbar } from 'notistack';

export default function SnackbarAction( id ) {
	const { closeSnackbar } = useSnackbar();
	
	return (
		<IconButton color='inherit' onClick={() => closeSnackbar( id )}>
			<CloseIcon/>
		</IconButton>
	);
}
