import useDebounce from './useDebounce';

export default function useLoading( isLoading?: boolean, delay?: number ) {
	const isLoadingDebounced = useDebounce( isLoading, delay );
	return isLoading && isLoadingDebounced;
}
