import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import Category from '../entities/category/category.entity';
import Client from '../entities/client/client.entity';
import Company from '../entities/company/company.entity';
import Location from '../entities/location/location.entity';
import Tier from '../entities/tier/tier.entity';
import { Permissions } from '../enums/permissions.enum';
import { SubscriptionStatus } from '../enums/subscriptionStatus.enum';

export class TestSeeder extends Seeder {
	
	async run( em: EntityManager ): Promise<void> {
		const repo = em.getRepository( Tier );
		const testCompany = em.create( Company, {
			name        : 'Invoiss Test',
			email       : 'support@invoiss.com',
			subscription: {
				status: SubscriptionStatus.ACTIVE,
				tier  : await repo.findOneOrFail( { name: 'Premium' } )
			}
		} );
		
		em.create( Location, {
			name   : 'Test Location',
			company: testCompany,
			address: {
				line1     : '42 Montgomery St',
				city      : 'San Francisco',
				state     : 'CA',
				postalCode: '94104',
				country   : 'US'
			},
			staffs : [ {
				email      : 'amir@sfflorist.com',
				user       : {
					email    : 'amir@sfflorist.com',
					firstName: 'Amir',
					lastName : 'Sadeghi'
				},
				permissions: [ Permissions.OWNER ],
				company    : testCompany
			}, {
				email      : 'pouya@invoiss.com',
				user       : {
					email    : 'pouya@invoiss.com',
					firstName: 'Pouya',
					lastName : 'Rezvani'
				},
				permissions: [ Permissions.OWNER ],
				company    : testCompany
			}, {
				email      : 'haobo@invoiss.com',
				user       : {
					email    : 'haobo@invoiss.com',
					firstName: 'Haobo',
					lastName : 'Zhang'
				},
				permissions: [ Permissions.OWNER ],
				company    : testCompany
			}, {
				email      : 'danishsiddiqui500@gmail.com',
				user       : {
					email    : 'danishsiddiqui500@gmail.com',
					firstName: 'Danish',
					lastName : 'Siddiqui'
				},
				permissions: [ Permissions.OWNER ],
				company    : testCompany
			} ] as any
		} );
		
		em.create( Category, {
			name   : 'Test Category',
			company: testCompany,
			items  : [ {
				name   : 'Item 1',
				uoms   : [ {
					name    : 'Uom 1a',
					price   : 10,
					selected: true
				} ],
				company: testCompany
			}, {
				name   : 'Item 2',
				uoms   : [ {
					name    : 'Uom 2a',
					price   : 10,
					selected: true
				}, {
					name : 'Uom 2b',
					price: 20
				} ],
				company: testCompany
			}, {
				name   : 'Item 3',
				uoms   : [ {
					name    : 'Uom 3a',
					price   : 10,
					selected: true
				}, {
					name : 'Uom 3b',
					price: 20
				}, {
					name : 'Uom 3b',
					price: 30
				} ],
				company: testCompany
			} ]
		} );
		
		em.create( Client, {
			contact: 'Tester',
			company: testCompany
		} );
	}
	
}
