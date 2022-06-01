import os from 'os';

type Options = {
	// Maximum line width before wrapping. Use false to never wrap, true to always wrap. default: 80
	wrap?: boolean | number,
	// Whitespace used to indent each level when wrapping. default: "\t" (tab)
	indent?: string,
	// Newline character(s) to use when wrapping. default: os.EOL
	newline?: string,
	// Indent the closing bracket/brace for arrays and objects? default: false
	indentLast?: boolean,
	// Put opening brackets on the same line as the first value, closing brackets on the same line as the last? default: false
	// This causes the indent and indent_last options to be ignored, instead basing indentation on array and object padding.
	short?: boolean,
	// Sort objects' keys in alphabetical order (true), or supply a lambda for custom sorting. default: false
	// If you supply a lambda to the sort option, it will be passed three values: the (string) name of the key, the associated value, and the object being sorted, e.g. { sort:->(key,value,hash){ Float(value) rescue Float::MAX } }
	sort?: boolean | ( ( a: string, b: string ) => number ),
	// When wrapping objects, line up the colons (per object)? default: false
	aligned?: boolean,
	// Decimal precision for non-integer numbers. default: undefined
	precision?: number,
	
	// Number of spaces to put inside brackets for arrays and braces for objects. default: 1
	padding?: number,
	// Number of spaces to put inside brackets for arrays. default: 1
	arrayPadding?: number,
	// Number of spaces to put inside braces for objects. default: 1
	objectPadding?: number,
	
	// Number of spaces to put before and after commas (for both arrays and objects). default: undefined
	aroundComma?: number,
	// Number of spaces to put before commas (for both arrays and objects). default: 0
	beforeComma?: number,
	// Number of spaces to put after commas (for both arrays and objects). default: 1
	afterComma?: number,
	
	// Number of spaces before and after a colon. default: 0
	aroundColon?: number,
	// Number of spaces before a colon. default: 0
	beforeColon?: number,
	// Number of spaces after a colon. default: 1
	afterColon?: number,
	
	// Number of spaces before and after a colon when the object is on one line. default: 0
	aroundColon1?: number,
	//Number of spaces before a colon when the object is on one line. default: 0
	beforeColon1?: number,
	// Number of spaces after a colon when the object is on one line. default: 1
	afterColon1?: number,
	
	// Number of spaces before and after a colon when the object is on multiple lines. default: 0
	aroundColonN?: number,
	// Number of spaces before a colon when the object is on multiple lines. default: 0
	beforeColonN?: number,
	// Number of spaces after a colon when the object is on multiple lines. default: 1
	afterColonN?: number
};

export default function neatJSON( value, opts: Options = {} ) {
	if ( !( 'wrap' in opts ) ) opts.wrap = 80;
	if ( opts.wrap === true ) opts.wrap = -1;
	if ( !( 'indent' in opts ) ) opts.indent = '\t';
	if ( !( 'newline' in opts ) ) opts.newline = os.EOL;
	if ( !( 'arrayPadding' in opts ) ) opts.arrayPadding = opts.padding ?? 1;
	if ( !( 'objectPadding' in opts ) ) opts.objectPadding = opts.padding ?? 1;
	if ( !( 'beforeComma' in opts ) ) opts.beforeComma = opts.aroundComma ?? 0;
	if ( !( 'afterComma' in opts ) ) opts.afterComma = opts.aroundComma ?? 1;
	if ( !( 'beforeColon' in opts ) ) opts.beforeColon = opts.aroundColon ?? 0;
	if ( !( 'afterColon' in opts ) ) opts.afterColon = opts.aroundColon ?? 1;
	if ( !( 'beforeColon1' in opts ) ) opts.beforeColon1 = opts.aroundColon1 ?? opts.beforeColon ?? 0;
	if ( !( 'afterColon1' in opts ) ) opts.afterColon1 = opts.aroundColon1 ?? opts.afterColon ?? 0;
	if ( !( 'beforeColonN' in opts ) ) opts.beforeColonN = opts.aroundColonN ?? opts.beforeColon ?? 0;
	if ( !( 'afterColonN' in opts ) ) opts.afterColonN = opts.aroundColonN ?? opts.afterColon ?? 0;
	
	const apad   = ' '.repeat( opts.arrayPadding ),
	      opad   = ' '.repeat( opts.objectPadding ),
	      comma  = `${' '.repeat( opts.beforeComma )},${' '.repeat( opts.afterComma )}`,
	      colon1 = `${' '.repeat( opts.beforeColon1 )}:${' '.repeat( opts.afterColon1 )}`,
	      colonN = `${' '.repeat( opts.beforeColonN )}:${' '.repeat( opts.afterColonN )}`;
	
	const memo = new Map();
	
	function build( o, indent ) {
		let byIndent = memo.get( o );
		if ( !byIndent ) memo.set( o, byIndent = {} );
		if ( !byIndent[ indent ] ) byIndent[ indent ] = rawBuild( o, indent );
		return byIndent[ indent ];
	}
	
	function rawBuild( o, indent ) {
		if ( o === null || o === undefined ) return `${indent}null`;
		else {
			if ( typeof o === 'number' ) {
				if ( o === Infinity ) {
					return `${indent}9e9999`;
				} else if ( o === -Infinity ) {
					return `${indent}-9e9999`;
				} else if ( Number.isNaN( o ) ) {
					return `${indent}"NaN"`;
				} else {
					const isFloat = o === +o && o !== ( o | 0 );
					return `${indent}${isFloat && opts.precision === undefined ? `${o}` : o.toFixed( +opts.precision )}`;
				}
			} else if ( o instanceof Array ) {
				if ( !o.length ) return `${indent}[]`;
				let pieces = o.map( ( v ) => build( v, '' ) );
				const oneLine = `${indent}[${apad}${pieces.join( comma )}${apad}]`;
				if ( opts.wrap === false || oneLine.length <= opts.wrap ) return oneLine;
				if ( opts.short ) {
					const indent2 = `${indent} ${apad}`;
					pieces = o.map( ( v ) => build( v, indent2 ) );
					pieces[ 0 ] = pieces[ 0 ].replace( indent2, `${indent}[${apad}` );
					pieces[ pieces.length - 1 ] = `${pieces[ pieces.length - 1 ]}${apad}]`;
					return pieces.join( `,${opts.newline}` );
				} else {
					const indent2 = `${indent}${opts.indent}`;
					return `${indent}[
${o.map( ( v ) => build( v, indent2 ) ).join( `,${opts.newline}` )}
${opts.indentLast ? indent2 : indent}]`;
				}
			} else if ( o instanceof Object ) {
				let sortedKV = [], i = 0;
				for ( const k in o ) {
					sortedKV[ i++ ] = [ k, o[ k ] ];
				}
				if ( !sortedKV.length ) return `${indent}{}`;
				if ( opts.sort ) sortedKV = sortedKV.sort( ( a, b ) => {
					a = a[ 0 ];
					b = b[ 0 ];
					return typeof opts.sort === 'function' ? opts.sort( a, b ) : a < b ? -1 : a > b ? 1 : 0;
				} );
				const keyVals = sortedKV.map( ( kv ) => [ JSON.stringify( kv[ 0 ] ),
					build( kv[ 1 ], '' ) ].join( colon1 ) ).join( comma );
				let oneLine = `${indent}{${opad}${keyVals}${opad}}`;
				if ( opts.wrap === false || oneLine.length < opts.wrap ) return oneLine;
				if ( opts.short ) {
					const keyVals = sortedKV.map( ( kv ) => [
						`${indent} ${opad}${JSON.stringify( kv[ 0 ] )}`,
						kv[ 1 ]
					] );
					keyVals[ 0 ][ 0 ] = keyVals[ 0 ][ 0 ].replace( `${indent} `, `${indent}{` );
					if ( opts.aligned ) {
						let longest = 0;
						for ( let i = keyVals.length; i--; )
							if ( keyVals[ i ][ 0 ].length > longest )
								longest = keyVals[ i ][ 0 ].length;
						for ( let i = keyVals.length; i--; )
							keyVals[ i ][ 0 ] = keyVals[ i ][ 0 ].padEnd( longest );
					}
					const wrappedKeyVals = keyVals.map( ( [ k, v ] ) => {
						const indent2 = ' '.repeat( ( k + colonN ).length );
						oneLine = `${k}${colonN}${build( v, '' )}`;
						return oneLine.length <= opts.wrap || !v || typeof v !== 'object'
							? oneLine
							: `${k}${colonN}${build( v, indent2 ).replace( /^\s+/, '' )}`;
					} );
					return `${wrappedKeyVals.join( `,${opts.newline}` )}${opad}}`;
				} else {
					const keyVals = sortedKV.map( ( kvs ) => {
						kvs[ 0 ] = `${indent}${opts.indent}${JSON.stringify( kvs[ 0 ] )}`;
						return kvs;
					} );
					if ( opts.aligned ) {
						let longest = 0;
						for ( let i = keyVals.length; i--; )
							if ( keyVals[ i ][ 0 ].length > longest )
								longest = keyVals[ i ][ 0 ].length;
						for ( let i = keyVals.length; i--; )
							keyVals[ i ][ 0 ] = keyVals[ i ][ 0 ].padEnd( longest );
					}
					const indent2 = `${indent}${opts.indent}`;
					
					const wrappedKeyVals = keyVals.map( ( [ k, v ] ) => {
						oneLine = `${k}${colonN}${build( v, '' )}`;
						return oneLine.length <= opts.wrap || !v || typeof v !== 'object'
							? oneLine
							: `${k}${colonN}${build( v, indent2 ).replace( /^\s+/, '' )}`;
					} );
					return `${indent}{
${wrappedKeyVals.join( `,${opts.newline}` )}
${opts.indentLast ? indent2 : indent}}`;
				}
			} else {
				return `${indent}${JSON.stringify( o )}`;
			}
		}
	}
	
	return `${build( value, '' )}
`;
}
