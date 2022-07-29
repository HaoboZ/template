import { Migration } from '@mikro-orm/migrations';

export class Migration20220519191834 extends Migration {
	
	async up(): Promise<void> {
		this.addSql( 'alter table "store" add column "hours" jsonb not null default \'{}\';' );
		this.addSql( 'alter table "store" alter column "type" type text[] using ("type"::text[]);' );
	}
	
	async down(): Promise<void> {
		this.addSql( 'alter table "store" alter column "type" type text[] using ("type"::text[]);' );
		this.addSql( 'alter table "store" drop column "hours";' );
	}
	
}
