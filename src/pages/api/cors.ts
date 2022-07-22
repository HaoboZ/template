import Cors from 'cors';

const cors = Cors( { methods: [ 'GET', 'POST' ] } );

export async function runCors( req, res ) {
	await runMiddleware( req, res, cors );
}

export function runMiddleware( req, res, fn ) {
	return new Promise( ( resolve, reject ) => {
		fn( req, res, ( result ) => {
			if ( result instanceof Error ) return reject( result );
			return resolve( result );
		} );
	} );
}
