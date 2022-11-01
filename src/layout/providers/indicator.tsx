import { CircularProgress, Fade } from '@mui/material';
import { createContext, useContext, useState } from 'react';

type C = <T>( promise?: Promise<T> ) => Promise<T>;
const IndicatorContext = createContext<C>( () => null );
IndicatorContext.displayName = 'Indicator';

export default function IndicatorProvider( { children } ) {
	const [ visible, setVisible ] = useState( false );
	
	return (
		<IndicatorContext.Provider value={async ( promise ) => {
			setVisible( true );
			if ( promise ) {
				promise.finally( () => setVisible( false ) );
			} else {
				setTimeout( () => setVisible( false ), 250 );
			}
			return await promise;
		}}>
			{children}
			<Fade mountOnEnter unmountOnExit in={visible}>
				<CircularProgress
					color='secondary'
					size={20}
					sx={{
						position: 'fixed',
						zIndex  : 'tooltip',
						bottom  : 'calc(env(safe-area-inset-bottom) + 10px)',
						right   : 'calc(env(safe-area-inset-right) + 10px)'
					}}
				/>
			</Fade>
		</IndicatorContext.Provider>
	);
}

export function useIndicator() {
	return useContext( IndicatorContext );
}

export function withIndicator( Component ) {
	return ( props ) => (
		<IndicatorContext.Consumer>
			{( indicator ) => <Component indicator={indicator} {...props}/>}
		</IndicatorContext.Consumer>
	);
}
