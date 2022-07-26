import { Field, InputType } from 'type-graphql';
import { Recipe } from '../entities/recipe.entity';

@InputType()
export class RecipeInput implements Partial<Recipe> {
	@Field()
		title: string;
	
	@Field( { nullable: true } )
		description?: string;
}
