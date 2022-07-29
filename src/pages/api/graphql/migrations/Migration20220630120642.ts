import { Migration } from '@mikro-orm/migrations';

export class Migration20220630120642 extends Migration {
	
	async up(): Promise<void> {
		this.addSql( 'alter table "company" drop constraint "company_website_unique";' );
	}
	
	async down(): Promise<void> {
		this.addSql( 'alter table "company" add constraint "company_website_unique" unique ("website");' );
	}
	
}
