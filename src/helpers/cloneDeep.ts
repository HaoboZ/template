import { flatten } from 'underscore';

export default function cloneDeep<T>( ...objects: T[] ) {
	const isObject = ( obj ) => obj && typeof obj === 'object';
	
	if ( !isObject( objects[ 0 ] ) ) return objects[ 0 ];
	
	if ( Array.isArray( objects[ 0 ] ) ) {
		return flatten( objects, 1 ).map( ( a ) => cloneDeep( a ) );
	}
	
	return objects.reduce( ( prev, obj ) => {
		for ( const key of Object.keys( obj ) ) {
			const pVal = prev[ key ];
			const oVal = obj[ key ];
			
			if ( Array.isArray( pVal ) && Array.isArray( oVal ) ) {
				prev[ key ] = flatten( [ pVal, oVal ], 1 ).map( ( a ) => cloneDeep( a ) );
			} else if ( isObject( pVal ) && isObject( oVal ) ) {
				prev[ key ] = cloneDeep( pVal, oVal );
			} else {
				prev[ key ] = oVal;
			}
		}
		
		return prev;
	}, {} as T );
}
