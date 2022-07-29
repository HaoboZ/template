import { Migration } from '@mikro-orm/migrations';

export class Migration20220629171947 extends Migration {
	
	async up(): Promise<void> {
		this.addSql( 'alter table "company" add column "website" varchar(255) null;' );
		this.addSql( 'alter table "company" add constraint "company_website_unique" unique ("website");' );
	}
	
	async down(): Promise<void> {
		this.addSql( 'alter table "company" drop constraint "company_website_unique";' );
		this.addSql( 'alter table "company" drop column "website";' );
	}
	
}
