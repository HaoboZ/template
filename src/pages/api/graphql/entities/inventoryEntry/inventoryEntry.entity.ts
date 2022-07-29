import { Entity, ManyToOne } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import InventoryRun from '../inventoryRun/inventoryRun.entity';
import Uom from '../uom/uom.entity';
import User from '../user/user.entity';
import InventoryEntryBase from './inventoryEntry.base';

@ObjectType()
@Entity()
export default class InventoryEntry extends InventoryEntryBase<InventoryEntry> {
	
	@Field( () => InventoryRun )
	@ManyToOne( () => InventoryRun, { onDelete: 'cascade' } )
	inventoryRun: InventoryRun;
	
	@Field( () => User, { nullable: true } )
	@ManyToOne( () => User, { nullable: true, onDelete: 'set null' } )
	user?: User;
	
	@Field( () => Uom, { nullable: true } )
	@ManyToOne( () => Uom, { nullable: true, onDelete: 'set null' } )
	uom?: Uom;
	
}
