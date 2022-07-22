/* eslint-disable */
import { Field, Float, Int, ObjectType } from 'type-graphql';

@ObjectType( { description: 'Object representing cooking recipe' } )
export class Recipe {
	
	@Field( () => String )
	title: string;
	@Field( () => String, { nullable: true, description: 'The recipe description with preparation info' } )
	description?: string;
	@Field( () => [ Int ] )
	ratings: number[];
	@Field( () => Date )
	creationDate: Date;
	@Field( () => Int )
	ratingsCount: number;
	
	@Field( () => String, { nullable: true, deprecationReason: 'Use `description` field instead' } )
	get specification(): string | undefined {
		return this.description;
	}
	
	@Field( () => Float, { nullable: true } )
	get averageRating(): number | null {
		const ratingsCount = this.ratings.length;
		if ( ratingsCount === 0 ) {
			return null;
		}
		const ratingsSum = this.ratings.reduce( ( a, b ) => a + b, 0 );
		return ratingsSum / ratingsCount;
	}
	
}
