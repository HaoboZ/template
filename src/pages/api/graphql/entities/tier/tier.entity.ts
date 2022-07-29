import { Entity } from '@mikro-orm/core';
import { ObjectType } from 'type-graphql';
import TierBase from './tier.base';

@ObjectType()
@Entity()
export default class Tier extends TierBase<Tier> {
}
