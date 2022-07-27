import { throttle, ThrottleSettings } from 'lodash-es';
import { useCallback, useEffect, useState } from 'react';

export default function useThrottle<T extends ( ...args: any ) => any>(
	value: T,
	delay = 250,
	options?: ThrottleSettings ) {
	return useCallback( throttle( value, delay, options ), [ delay ] );
}

export function useThrottledValue<T>( value: T, delay = 250, options?: ThrottleSettings ) {
	const [ throttledValue, setThrottledValue ] = useState( value );
	
	const setValueThrottled = useCallback( throttle( setThrottledValue, delay, options ), [ delay ] );
	
	useEffect( () => {
		setValueThrottled( value );
	}, [ value ] );
	
	return throttledValue;
}
