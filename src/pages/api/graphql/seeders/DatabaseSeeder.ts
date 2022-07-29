import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { TestSeeder } from './TestSeeder';
import { TierSeeder } from './TierSeeder';

export class DatabaseSeeder extends Seeder {
	
	async run( em: EntityManager ): Promise<void> {
		await new TierSeeder().run( em );
		await new TestSeeder().run( em );
	}
	
}
