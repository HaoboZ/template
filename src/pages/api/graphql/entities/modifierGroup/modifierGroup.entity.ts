import { Cascade, Collection, Entity, ManyToOne, OneToMany } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import Company from '../company/company.entity';
import GatewayBase from '../gateway/gateway.base';
import ModifierBase from '../modifier/modifier.base';
import ModifierGroupBase from './modifierGroup.base';

@ObjectType()
@Entity()
export default class ModifierGroup extends ModifierGroupBase<ModifierGroup> {
	
	@Field( () => [ ModifierBase ], { nullable: true } )
	@OneToMany( 'Modifier', 'modifierGroup', {
		cascade      : [ Cascade.ALL ],
		orphanRemoval: true
	} )
	modifiers? = new Collection<ModifierBase>( this );
	
	@Field( () => Company )
	@ManyToOne( () => Company, { onDelete: 'cascade' } )
	company: Company;
	
	@Field( () => GatewayBase, { nullable: true } )
	@ManyToOne( 'Gateway', { nullable: true, onDelete: 'set null' } )
	gateway?: GatewayBase;
	
}
