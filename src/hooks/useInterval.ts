import { DependencyList, useEffect } from 'react';

export default function useInterval<TArgs extends any[]>(
	callback: ( ...args: TArgs ) => void,
	options: { ms?: number, args?: TArgs, disabled?: boolean },
	deps?: DependencyList
) {
	useEffect( () => {
		if ( options.disabled ) return;
		
		const interval = setInterval( callback, options.ms, ...options.args ?? [] );
		return () => clearInterval( interval );
	}, [ options.ms, options.disabled, ...options.args ?? [], ...deps ?? [] ] );
}
