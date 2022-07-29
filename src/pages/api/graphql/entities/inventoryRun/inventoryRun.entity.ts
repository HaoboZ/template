import { Cascade, Collection, Entity, ManyToMany, ManyToOne, OneToMany } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import Company from '../company/company.entity';
import InventoryEntryBase from '../inventoryEntry/inventoryEntry.base';
import Location from '../location/location.entity';
import Uom from '../uom/uom.entity';
import User from '../user/user.entity';
import InventoryRunBase from './inventoryRun.base';

@ObjectType()
class RunInventoryEntry extends InventoryEntryBase {
	
	@Field( () => User, { nullable: true } )
	user?: User;
	
	@Field( () => Uom, { nullable: true } )
	uom?: Uom;
	
}

@ObjectType()
@Entity()
export default class InventoryRun extends InventoryRunBase<InventoryRun> {
	
	@Field( () => [ RunInventoryEntry ] )
	@OneToMany( 'InventoryEntry', 'inventoryRun', {
		cascade      : [ Cascade.ALL ],
		orphanRemoval: true,
		orderBy      : { updatedAt: 'DESC' } as any
	} )
	inventoryEntries? = new Collection<RunInventoryEntry>( this );
	
	@Field( () => [ User ] )
	@ManyToMany( () => User )
	users? = new Collection<User>( this );
	
	@Field( () => Company )
	@ManyToOne( () => Company, { onDelete: 'cascade' } )
	company: Company;
	
	@Field( () => Location )
	@ManyToOne( () => Location, { onDelete: 'cascade' } )
	location: Location;
	
}
