import type { DependencyList, EffectCallback } from 'react';
import { useEffect, useRef } from 'react';

export default function useAfterEffect( effect: EffectCallback, deps?: DependencyList ) {
	const didMountRef = useRef( false );
	
	useEffect( () => {
		if ( didMountRef.current )
			return effect();
		else
			didMountRef.current = true;
	}, deps );
}
