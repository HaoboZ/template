/* eslint-disable react-hooks/rules-of-hooks */

import { DebouncedFunc, throttle, ThrottleSettings } from 'lodash-es';
import { useCallback, useEffect, useState } from 'react';

export default function useThrottle<T>( value: T,
	delay = 250,
	options?: ThrottleSettings ): T extends ( ...args: any ) => any ? DebouncedFunc<T> : T {
	if ( typeof value === 'function' ) return useCallback( throttle( value as any, delay, options ), [ delay ] ) as any;
	
	const [ throttledValue, setThrottledValue ] = useState( value );
	
	const setValueThrottled = useCallback( throttle( setThrottledValue, delay, options ), [ delay ] );
	
	useEffect( () => {
		setValueThrottled( value );
	}, [ value ] );
	
	return throttledValue as any;
}
