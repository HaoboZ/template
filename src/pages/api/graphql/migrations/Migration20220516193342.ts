import { Migration } from '@mikro-orm/migrations';

export class Migration20220516193342 extends Migration {
	
	async up(): Promise<void> {
		this.addSql( 'alter table "company" drop constraint "company_subscription_id_foreign";' );
		
		this.addSql( 'alter table "company" add constraint "company_subscription_id_foreign" foreign key ("subscription_id") references "subscribe" ("id") on update cascade on delete set null;' );
	}
	
	async down(): Promise<void> {
		this.addSql( 'alter table "company" drop constraint "company_subscription_id_foreign";' );
		
		this.addSql( 'alter table "company" add constraint "company_subscription_id_foreign" foreign key ("subscription_id") references "subscribe" ("id") on update cascade on delete cascade;' );
	}
	
}
