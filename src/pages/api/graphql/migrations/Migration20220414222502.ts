import { Migration } from '@mikro-orm/migrations';

export class Migration20220414222502 extends Migration {
	
	async up(): Promise<void> {
		this.addSql( 'alter table "tier" add constraint "tier_name_unique" unique ("name");' );
	}
	
	async down(): Promise<void> {
		this.addSql( 'alter table "tier" drop constraint "tier_name_unique";' );
	}
	
}
