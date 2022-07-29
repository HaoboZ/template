import { Migration } from '@mikro-orm/migrations';

export class Migration20220721152223 extends Migration {
	
	async up(): Promise<void> {
		this.addSql( 'alter table "item" add column "is_hidden" boolean null;' );
	}
	
	async down(): Promise<void> {
		this.addSql( 'alter table "item" drop column "is_hidden";' );
	}
	
}
