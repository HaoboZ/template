import { Migration } from '@mikro-orm/migrations';

export class Migration20220617204306 extends Migration {
	
	async up(): Promise<void> {
		this.addSql( 'alter table "company" drop constraint "company_paypal_id_foreign";' );
		
		this.addSql( 'alter table "company" rename column "stripe_id" to "main_payment_id";' );
		this.addSql( 'alter table "company" rename constraint "company_stripe_id_foreign" to "company_main_payment_id_foreign"' );
		this.addSql( 'alter table "company" drop column "paypal_id";' );
		
		this.addSql( 'alter table "client" alter column "contact" type varchar(255) using ("contact"::varchar(255));' );
		this.addSql( 'alter table "client" alter column "contact" drop not null;' );
	}
	
	async down(): Promise<void> {
		this.addSql( 'alter table "company" drop constraint "company_main_payment_id_foreign";' );
		
		this.addSql( 'alter table "company" add column "paypal_id" uuid null;' );
		this.addSql( 'alter table "company" add constraint "company_paypal_id_foreign" foreign key ("paypal_id") references "gateway" ("id") on update cascade on delete set null;' );
		this.addSql( 'alter table "company" rename column "main_payment_id" to "stripe_id";' );
		this.addSql( 'alter table "company" add constraint "company_stripe_id_foreign" foreign key ("stripe_id") references "gateway" ("id") on update cascade on delete set null;' );
		
		this.addSql( 'alter table "client" alter column "contact" type varchar(255) using ("contact"::varchar(255));' );
		this.addSql( 'alter table "client" alter column "contact" set not null;' );
	}
	
}
