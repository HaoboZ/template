import { Property } from '@mikro-orm/core';
import { SoftDeletable } from 'mikro-orm-soft-delete';
import { ObjectType } from 'type-graphql';
import Base from './base';

// @ts-ignore
@SoftDeletable( () => SafeBase, 'deletedAt', () => new Date() )
@ObjectType( { isAbstract: true } )
export default abstract class SafeBase<T> extends Base<T> {
	
	@Property( { nullable: true } )
	deletedAt?: Date;
	
}
