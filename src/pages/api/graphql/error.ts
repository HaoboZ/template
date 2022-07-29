import { MiddlewareFn } from 'type-graphql';

export const ErrorInterceptor: MiddlewareFn<any> = async ( { context, info }, next ) => {
	try {
		return await next();
	} catch ( err ) {
		// write error to file log
		if ( process.env.NODE_ENV === 'development' ) {
			console.log( err );
		}
		
		// rethrow the error
		throw err;
	}
};
