import { Migration } from '@mikro-orm/migrations';

export class Migration20220627221154 extends Migration {
	
	async up(): Promise<void> {
		this.addSql( 'alter table "log" add column "table" uuid null;' );
		
		this.addSql( 'alter table "staff" alter column "permissions" type text[] using ("permissions"::text[]);' );
	}
	
	async down(): Promise<void> {
		this.addSql( 'alter table "log" drop column "table";' );
		
		this.addSql( 'alter table "staff" alter column "permissions" type text[] using ("permissions"::text[]);' );
	}
	
}
