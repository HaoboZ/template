import { useState } from 'react';
import useEventListener from './useEventListener';

export default function usePageHeight() {
	const [ height, setHeight ] = useState( window.innerHeight );
	
	// window event listener resize event
	useEventListener( window, 'resize', () => setHeight( window.innerHeight ) );
	
	return height;
}
