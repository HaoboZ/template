import { Cascade, Collection, Entity, ManyToMany, ManyToOne } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import Company from '../company/company.entity';
import GatewayBase from '../gateway/gateway.base';
import Item from '../item/item.entity';
import Location from '../location/location.entity';
import CategoryBase from './category.base';

@ObjectType()
@Entity()
export default class Category extends CategoryBase<Category> {
	
	@Field( () => [ Item ], { nullable: true } )
	@ManyToMany( () => Item, 'categories', {
		cascade : [ Cascade.ALL ],
		nullable: true
	} )
	items? = new Collection<Item>( this );
	
	@Field( () => [ Location ], { nullable: true } )
	@ManyToMany( () => Location )
	locations? = new Collection<Location>( this );
	
	@Field( () => Company )
	@ManyToOne( { entity: () => Company, onDelete: 'cascade' } )
	company: Company;
	
	@Field( () => GatewayBase, { nullable: true } )
	@ManyToOne( 'Gateway', { nullable: true, onDelete: 'set null' } )
	gateway?: GatewayBase;
	
}
