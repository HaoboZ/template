import glob from 'fast-glob';
import 'reflect-metadata';
import { buildSchema, registerEnumType } from 'type-graphql';

export default async function loadSchema() {
	const enumPaths = await glob( `${process.cwd()}/src/pages/api/graphql/**/*.enum.ts` );
	for ( const enumPath of enumPaths ) {
		const enumObj = await import( `.${enumPath.split( 'graphql' )[ 1 ]}` );
		const name = Object.keys( enumObj )[ 0 ];
		registerEnumType( enumObj[ name ], { name } );
	}
	
	const resolverPaths = await glob( `${process.cwd()}/src/pages/api/graphql/**/*.resolver.ts` );
	const resolvers: any = await Promise.all( resolverPaths.map( ( resolverPath ) => import( `.${resolverPath.split( 'graphql' )[ 1 ]}` ) ) );
	
	return await buildSchema( {
		resolvers: resolvers.map( ( resolver ) => resolver.default )
		// automatically create `schema.gql` file with schema definition in current folder
		// emitSchemaFile: path.resolve( __dirname, 'schema.gql' )
	} );
}
