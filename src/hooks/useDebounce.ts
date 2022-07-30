import type { DebounceSettings } from 'lodash-es';
import { debounce } from 'lodash-es';
import { useCallback, useEffect, useState } from 'react';

export default function useDebounce<T extends ( ...args: any ) => any>(
	value: T,
	delay = 250,
	options?: DebounceSettings ) {
	return useCallback( debounce( value, delay, options ), [ delay ] );
}

export function useDebouncedValue<T>( value: T, delay = 250, options?: DebounceSettings ) {
	const [ debouncedValue, setDebouncedValue ] = useState( value );
	
	const setValueDebounced = useCallback( debounce( setDebouncedValue, delay, options ), [ delay ] );
	
	useEffect( () => {
		setValueDebounced( value );
	}, [ value ] );
	
	return debouncedValue;
}
