import { Entity, ManyToOne } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import ModifierGroup from '../modifierGroup/modifierGroup.entity';
import ModifierBase from './modifier.base';

@ObjectType()
@Entity()
export default class Modifier extends ModifierBase<Modifier> {
	
	@Field( () => ModifierGroup, { nullable: true } )
	@ManyToOne( () => ModifierGroup, { onDelete: 'cascade', nullable: true } )
	modifierGroup: ModifierGroup;
	
}
