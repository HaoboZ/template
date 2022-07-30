import type { DependencyList } from 'react';
import { useEffect } from 'react';

export default function useAsyncEffect( effect: () => Promise<void>, deps?: DependencyList ) {
	useEffect( () => {
		effect().then();
	}, deps );
}
