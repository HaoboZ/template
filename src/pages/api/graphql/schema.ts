import { buildSchemaSync } from 'type-graphql';
import { RecipeResolver } from './resolvers/recipe.resolver';

export default function loadSchema() {
	return buildSchemaSync( {
		resolvers: [ RecipeResolver ]
		// automatically create `schema.gql` file with schema definition in current folder
		// emitSchemaFile: path.resolve( __dirname, 'schema.gql' )
	} );
}
