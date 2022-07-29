import { GraphQLScalarType } from 'graphql';

const JsonScalar = new GraphQLScalarType( {
	name       : 'JSON',
	description: 'JSON object scalar type',
	serialize( value: string ): any {
		return typeof value === 'string' ? JSON.parse( value ) : value;
	}
} );
export default JsonScalar;
