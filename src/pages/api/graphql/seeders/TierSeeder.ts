import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import Tier from '../entities/tier/tier.entity';

export class TierSeeder extends Seeder {
	
	async run( em: EntityManager ): Promise<void> {
		em.create( Tier, {
			sequence    : 1,
			name        : 'Basic',
			price       : 0,
			externalIds : {
				STRIPE: 'price_1KUDLpJQHy03oQEqhuaXeejG'
			},
			description : 'Freelancers, individuals or Micro-enterprises with a limited catalog that do not need to process payments online',
			descriptions: {
				item              : [ true, 'Create unlimited Item', true ],
				client            : [ true, 'Create unlimited Clients', true ],
				invoice           : [ true, 'Create unlimited Invoices', true ],
				estimate          : [ true, 'Create unlimited Estimates', true ],
				vendorBrowsing    : [ true, 'Vendor Marketplace', true ],
				order             : [ 10, 'Create Orders', '10 Total' ],
				purchase          : [ 5, 'Purchase from your vendors', '5 Total' ],
				inventory         : [ 5, 'Take & manage Inventory', '5 Total' ],
				staff             : [ 1, 'Add Team Member', 'Only 1' ],
				payment           : [ 5, 'Process Payment Online', '5 Total' ],
				chat              : [ true, 'Chat with Clients and Vendor', true ],
				message           : [ 10.1, 'Text Messages', '10/mo' ],
				template          : [ false, 'Custom Invoice Theme', false ],
				statement         : [ true, 'Send Monthly Statement', true ],
				report            : [ false, 'Auto Generated Reports', false ],
				location          : [ 1, 'Included Location', 'Only 1' ],
				additionalLocation: [ true, 'Additional Location', '$10/mo' ]
			}
		} );
		em.create( Tier, {
			sequence    : 2,
			name        : 'Essentials',
			price       : 10,
			externalIds : {
				STRIPE: 'price_1KUDLmJQHy03oQEqeKp2rubD'
			},
			description : 'Small businesses with more offerings that may need to accept payments for orders and invoices online and by phone',
			descriptions: {
				item              : [ true, 'Create unlimited Item', true ],
				client            : [ true, 'Create unlimited Clients', true ],
				invoice           : [ true, 'Create unlimited Invoices', true ],
				estimate          : [ true, 'Create unlimited Estimates', true ],
				vendorBrowsing    : [ true, 'Vendor Marketplace', true ],
				order             : [ true, 'Create Orders', true ],
				purchase          : [ 5, 'Purchase from your vendors', '5 Total' ],
				inventory         : [ 5, 'Take & manage Inventory', '5 Total' ],
				staff             : [ 3, 'Add Team Member', '3 Total' ],
				payment           : [ true, 'Process Payment Online', true ],
				chat              : [ true, 'Chat with Clients and Vendor', true ],
				message           : [ 1000.1, 'Text Messages', '1000/mo' ],
				template          : [ true, 'Custom Invoice Theme', true ],
				statement         : [ true, 'Send Monthly Statement', true ],
				report            : [ true, 'Auto Generated Reports', true ],
				location          : [ 1, 'Included Location', 'Only 1' ],
				additionalLocation: [ true, 'Additional Location', '$10/mo' ]
			}
		} );
		em.create( Tier, {
			sequence    : 3,
			name        : 'Pro',
			price       : 45,
			externalIds : {
				STRIPE: 'price_1KUDLhJQHy03oQEqetqVgH4K'
			},
			description : 'Small businesses that sell many different items and require interaction with suppliers, inventory management, and/or online payment capabilities',
			descriptions: {
				item              : [ true, 'Create unlimited Item', true ],
				client            : [ true, 'Create unlimited Clients', true ],
				invoice           : [ true, 'Create unlimited Invoices', true ],
				estimate          : [ true, 'Create unlimited Estimates', true ],
				vendorBrowsing    : [ true, 'Vendor Marketplace', true ],
				order             : [ true, 'Create Orders', true ],
				purchase          : [ 20.1, 'Purchase from your vendors', '20/mo' ],
				inventory         : [ 5, 'Take & manage Inventory', '5 Total' ],
				staff             : [ true, 'Add Team Member', true ],
				payment           : [ true, 'Process Payment Online', true ],
				chat              : [ true, 'Chat with Clients and Vendor', true ],
				message           : [ 5000.1, 'Text Messages', '5000/mo' ],
				template          : [ true, 'Custom Invoice Theme', true ],
				statement         : [ true, 'Send Monthly Statement', true ],
				report            : [ true, 'Auto Generated Reports', true ],
				location          : [ 3, 'Included Location', '3 Total' ],
				additionalLocation: [ true, 'Additional Location', '$10/mo' ]
			}
		} );
		em.create( Tier, {
			sequence    : 4,
			name        : 'Premium',
			price       : 90,
			externalIds : {
				STRIPE: 'price_1KUDKsJQHy03oQEqUFjbmppr'
			},
			description : 'Large businesses with multiple locations and advanced needs',
			descriptions: {
				item              : [ true, 'Create unlimited Item', true ],
				client            : [ true, 'Create unlimited Clients', true ],
				invoice           : [ true, 'Create unlimited Invoices', true ],
				estimate          : [ true, 'Create unlimited Estimates', true ],
				vendorBrowsing    : [ true, 'Vendor Marketplace', true ],
				order             : [ true, 'Create Orders', true ],
				purchase          : [ true, 'Purchase from your vendors', true ],
				inventory         : [ true, 'Take & manage Inventory', true ],
				staff             : [ true, 'Add Team Member', true ],
				payment           : [ true, 'Process Payment Online', true ],
				chat              : [ true, 'Chat with Clients and Vendor', true ],
				message           : [ 10000.1, 'Text Messages', '10000/mo' ],
				template          : [ true, 'Custom Invoice Theme', true ],
				statement         : [ true, 'Send Monthly Statement', true ],
				report            : [ true, 'Auto Generated Reports', true ],
				location          : [ 5, 'Included Location', '5 Total' ],
				additionalLocation: [ true, 'Additional Location', '$10/mo' ]
			}
		} );
	}
	
}
