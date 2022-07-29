import { Migration } from '@mikro-orm/migrations';

export class Migration20220520212537 extends Migration {
	
	async up(): Promise<void> {
		this.addSql( 'alter table "uom" add column "external_id" varchar(255) null;' );
		this.addSql( 'alter table "uom" add constraint "uom_external_id_unique" unique ("external_id");' );
		
		this.addSql( 'alter table "location" add column "timezone" varchar(255) null;' );
		this.addSql( 'alter table "location" drop column "open";' );
		this.addSql( 'alter table "location" drop column "close";' );
	}
	
	async down(): Promise<void> {
		this.addSql( 'alter table "uom" drop constraint "uom_external_id_unique";' );
		this.addSql( 'alter table "uom" drop column "external_id";' );
		
		this.addSql( 'alter table "location" add column "open" time(0) null, add column "close" time(0) null;' );
		this.addSql( 'alter table "location" drop column "timezone";' );
	}
	
}
