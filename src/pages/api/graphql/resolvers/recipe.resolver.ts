import { Arg, FieldResolver, Int, Mutation, Query, Resolver, ResolverInterface, Root } from 'type-graphql';
import { Recipe } from '../entities/recipe.entity';
import { RecipeInput } from '../inputs/recipe.input';
import { createRecipeSamples } from '../seed';

@Resolver( () => Recipe )
export class RecipeResolver implements ResolverInterface<Recipe> {
	private readonly items: Recipe[] = createRecipeSamples();
	
	@Query( () => Recipe, { nullable: true } )
	async recipe(
		@Arg( 'title', () => String ) title: string
	): Promise<Recipe | undefined> {
		return await this.items.find( ( recipe ) => recipe.title === title );
	}
	
	@Query( () => [ Recipe ], { description: 'Get all the recipes from around the world ' } )
	async recipes(): Promise<Recipe[]> {
		return await this.items;
	}
	
	@Mutation( () => Recipe )
	async addRecipe(
		@Arg( 'recipe', () => RecipeInput ) recipeInput: RecipeInput
	): Promise<Recipe> {
		const recipe = Object.assign( new Recipe(), {
			description : recipeInput.description,
			title       : recipeInput.title,
			ratings     : [],
			creationDate: new Date()
		} );
		await this.items.push( recipe );
		return recipe;
	}
	
	@FieldResolver()
	ratingsCount(
		@Root() recipe: Recipe,
		@Arg( 'minRate', () => Int, { defaultValue: 0.0 } ) minRate: number
	): number {
		return recipe.ratings.filter( ( rating ) => rating >= minRate ).length;
	}
}
