import { useDebouncedValue } from './useDebounce';

export default function useLoading( isLoading?: boolean, delay?: number ) {
	const isLoadingDebounced = useDebouncedValue( isLoading, delay );
	return isLoading && isLoadingDebounced;
}
