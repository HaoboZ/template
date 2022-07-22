import { Field, InputType } from 'type-graphql';
import { Recipe } from '../entities/recipe.entity';

@InputType()
export class RecipeInput implements Partial<Recipe> {
	@Field( () => String )
	title: string;
	
	@Field( () => String, { nullable: true } )
	description?: string;
}
