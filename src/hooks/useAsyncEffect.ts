import { DependencyList, useEffect } from 'react';

export default function useAsyncEffect( effect: () => Promise<void>, deps?: DependencyList ) {
	useEffect( () => {
		effect().then();
	}, deps );
}
