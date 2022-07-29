import { Migration } from '@mikro-orm/migrations';

export class Migration20220510203728 extends Migration {
	
	async up(): Promise<void> {
		this.addSql( 'alter table "company" add column "stripe_id" uuid null, add column "paypal_id" uuid null;' );
		this.addSql( 'alter table "company" add constraint "company_stripe_id_foreign" foreign key ("stripe_id") references "gateway" ("id") on update cascade on delete set null;' );
		this.addSql( 'alter table "company" add constraint "company_paypal_id_foreign" foreign key ("paypal_id") references "gateway" ("id") on update cascade on delete set null;' );
	}
	
	async down(): Promise<void> {
		this.addSql( 'alter table "company" drop constraint "company_stripe_id_foreign";' );
		this.addSql( 'alter table "company" drop constraint "company_paypal_id_foreign";' );
		
		this.addSql( 'alter table "company" drop column "stripe_id";' );
		this.addSql( 'alter table "company" drop column "paypal_id";' );
	}
	
}
