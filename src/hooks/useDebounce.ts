/* eslint-disable react-hooks/rules-of-hooks */

import { debounce, DebouncedFunc, DebounceSettings } from 'lodash-es';
import { useCallback, useEffect, useState } from 'react';

export default function useDebounce<T>( value: T,
	delay = 250,
	options?: DebounceSettings ): T extends ( ...args: any ) => any ? DebouncedFunc<any> : T {
	if ( typeof value === 'function' ) return useCallback( debounce( value as any, delay, options ), [ delay ] ) as any;
	
	const [ debouncedValue, setDebouncedValue ] = useState( value );
	
	const setValueDebounced = useCallback( debounce( setDebouncedValue, delay, options ), [ delay ] );
	
	useEffect( () => {
		setValueDebounced( value );
	}, [ value ] );
	
	return debouncedValue as any;
}
