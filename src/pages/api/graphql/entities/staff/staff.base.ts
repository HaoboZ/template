import { Enum, Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import { Permissions } from '../../enums/permissions.enum';
import SafeBase from '../safeBase';

@ObjectType()
export default class StaffBase<T = any> extends SafeBase<T> {
	
	@Field( () => [ Permissions ] )
	@Enum( { items: () => Permissions, type: 'string', array: true } )
	permissions?: Permissions[] = [];
	
	@Field()
	@Property()
	email: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	code?: string;
	
}
