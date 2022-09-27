import { LinearProgress, linearProgressClasses } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Progress from '../../components/loaders/progress';
import useEventListener from '../../hooks/useEventListener';

export default function RouterProgress( { showOnShallow = true }: {
	showOnShallow?: boolean
} ) {
	const router = useRouter();
	
	const [ isActive, setIsActive ] = useState( false );
	
	const routeChangeStart = ( _, { shallow } ) => {
		if ( !shallow || showOnShallow ) {
			setIsActive( true );
		}
	};
	
	const routeChangeEnd = ( _, { shallow } ) => {
		if ( !shallow || showOnShallow ) {
			setIsActive( false );
		}
	};
	
	useEventListener( router.events, 'routeChangeStart', routeChangeStart );
	useEventListener( router.events, 'routeChangeComplete', routeChangeEnd );
	useEventListener( router.events, 'routeChangeError', routeChangeEnd );
	
	return (
		<Progress isLoading={isActive}>
			{( progress ) => (
				<LinearProgress
					aria-label='progress'
					variant='determinate'
					color='secondary'
					value={progress * 100}
					sx={{
						'position'            : 'absolute',
						'width'               : '100%',
						'&[aria-valuenow="0"]': {
							[ `.${linearProgressClasses.bar}` ]: { transition: 'none' }
						}
					}}
				/>
			)}
		</Progress>
	);
}
