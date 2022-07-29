import { Property } from '@mikro-orm/core';
import { formatDistance } from 'date-fns';
import { customAlphabet } from 'nanoid';
import { Field, ObjectType } from 'type-graphql';
import SafeBase from '../safeBase';

const nanoid = customAlphabet( '23456789ABCDEFGHJKLMNPQRSTUVWXYZ', 8 );

@ObjectType()
export default class InventoryRunBase<T = any> extends SafeBase<T> {
	
	@Field( { nullable: true } )
	@Property()
	number?: string = nanoid();
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	end?: Date;
	
	@Field( () => String, { nullable: true } )
	get duration(): string {
		if ( !this.end ) return null;
		return formatDistance( this.createdAt, this.end, { includeSeconds: true } );
	}
	
}
