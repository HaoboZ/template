import { Field, ObjectType } from 'type-graphql';
import Tier from '../tier/tier.entity';
import SubscribeBase from './subscribe.base';

@ObjectType()
export default class SubscribeWithTier extends SubscribeBase {
	
	@Field( () => Tier )
	tier: Tier;
	
}
