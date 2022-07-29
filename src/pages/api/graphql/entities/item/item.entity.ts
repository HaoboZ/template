import { Cascade, Collection, Entity, ManyToMany, ManyToOne, OneToMany } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import CategoryBase from '../category/category.base';
import Company from '../company/company.entity';
import GatewayBase from '../gateway/gateway.base';
import Location from '../location/location.entity';
import UomBase from '../uom/uom.base';
import ItemBase from './item.base';

@ObjectType()
@Entity()
export default class Item extends ItemBase<Item> {
	
	@Field( () => [ UomBase ] )
	@OneToMany( 'Uom', 'item', {
		cascade      : [ Cascade.ALL ],
		orphanRemoval: true,
		orderBy      : [ { selected: 'DESC' } as any ]
	} )
	uoms? = new Collection<UomBase>( this );
	
	@Field( () => [ CategoryBase ], { nullable: true } )
	@ManyToMany( 'Category', undefined, {
		cascade : [ Cascade.ALL ],
		nullable: true
	} )
	categories? = new Collection<CategoryBase>( this );
	
	@Field( () => [ Location ] )
	@ManyToMany( () => Location )
	locations? = new Collection<Location>( this );
	
	@Field( () => Company, { nullable: true } )
	@ManyToOne( () => Company, { onDelete: 'cascade', nullable: true } )
	company?: Company;
	
	@Field( () => GatewayBase, { nullable: true } )
	@ManyToOne( 'Gateway', { nullable: true, onDelete: 'set null' } )
	gateway?: GatewayBase;
	
}
