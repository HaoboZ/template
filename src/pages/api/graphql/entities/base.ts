import { BaseEntity, PrimaryKey, Property, UuidType } from '@mikro-orm/core';
import { Field, ID, ObjectType } from 'type-graphql';
import { v4 } from 'uuid';

@ObjectType( { isAbstract: true } )
// @ts-ignore
export default abstract class Base<T> extends BaseEntity<T, 'id'> {
	
	static jsons: string[];
	
	_new?: boolean;
	
	@Field( () => ID )
	@PrimaryKey( { type: UuidType } )
	id: string = v4();
	
	@Field()
	@Property( { onCreate: () => new Date() } )
	createdAt: Date;
	
	@Field()
	@Property( { onCreate: () => new Date(), onUpdate: () => new Date() } )
	updatedAt: Date;
	
	constructor( _new?: boolean ) {
		super();
		this._new = _new;
	}
	
}
