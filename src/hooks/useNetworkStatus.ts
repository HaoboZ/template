import { useState } from 'react';
import useEventListener from './useEventListener';

export default function useNetworkStatus() {
	const [ networkStatus, setNetworkStatus ] = useState( navigator.onLine );
	
	useEventListener( window, 'online', () => setNetworkStatus( navigator.onLine ) );
	useEventListener( window, 'offline', () => setNetworkStatus( navigator.onLine ) );
	
	return networkStatus;
}
