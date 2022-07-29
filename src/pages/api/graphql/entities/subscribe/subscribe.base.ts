import { Enum, Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import { SubscriptionStatus } from '../../enums/subscriptionStatus.enum';
import { SubscriptionType } from '../../enums/subscriptionType.enum';
import SafeBase from '../safeBase';

@ObjectType()
export default class SubscribeBase<T = any> extends SafeBase<T> {
	
	@Field( () => SubscriptionType )
	@Enum( { items: () => SubscriptionType, type: 'string' } )
	external?: SubscriptionType = SubscriptionType.NONE;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	externalId?: string;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	externalKey?: string;
	
	@Field( () => SubscriptionStatus )
	@Enum( { items: () => SubscriptionStatus, type: 'string' } )
	status?: SubscriptionStatus = SubscriptionStatus.INCOMPLETE;
	
	@Field( { nullable: true } )
	@Property( { nullable: true } )
	endDate?: Date;
	
}
