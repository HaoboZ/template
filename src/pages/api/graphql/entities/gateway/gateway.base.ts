import { Enum, Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import { GatewayType } from '../../enums/gatewayType.enum';
import Base from '../base';

@ObjectType()
export default class GatewayBase<T = any> extends Base<T> {
	
	@Field( () => GatewayType )
	@Enum( { items: () => GatewayType, type: 'string' } )
	external: GatewayType;
	
	@Field()
	@Property()
	active?: boolean = false;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	externalId?: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	externalKey?: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	externalRefresh?: string;
	
}
