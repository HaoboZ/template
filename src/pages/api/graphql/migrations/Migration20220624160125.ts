import { Migration } from '@mikro-orm/migrations';

export class Migration20220624160125 extends Migration {
	
	async up(): Promise<void> {
		this.addSql( 'alter table "price" add column "external_id" varchar(255) null;' );
		this.addSql( 'alter table "price" add constraint "price_external_id_unique" unique ("external_id");' );
	}
	
	async down(): Promise<void> {
		this.addSql( 'alter table "price" drop constraint "price_external_id_unique";' );
		this.addSql( 'alter table "price" drop column "external_id";' );
	}
	
}
