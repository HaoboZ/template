import type { DependencyList } from 'react';
import { useEffect } from 'react';

export default function useEventListener(
	event: { on: Function, off: Function }
	| { addListener: Function, removeListener: Function }
	| { addEventListener: Function, removeEventListener: Function },
	name: string | symbol | keyof WindowEventMap,
	listener: ( ...args: any[] ) => void,
	options?: {
		callOnce?: boolean,
		dependencies?: DependencyList
	}
) {
	useEffect( () => {
		// @ts-ignore
		const add = event.on || event.addListener || event.addEventListener;
		// @ts-ignore
		const remove = event.off || event.removeListener || event.removeEventListener;
		
		if ( options?.callOnce ) listener();
		add.bind( event )( name, listener );
		return () => {
			remove.bind( event )( name, listener );
		};
	}, options?.dependencies || [] );
}
