import { Migration } from '@mikro-orm/migrations';

export class Migration20220628174050 extends Migration {
	
	async up(): Promise<void> {
		this.addSql( 'alter table "log" alter column "table" type text using ("table"::text);' );
		
		this.addSql( 'alter table "log" alter column "table" type varchar(255) using ("table"::varchar(255));' );
	}
	
	async down(): Promise<void> {
		this.addSql( 'alter table "log" alter column "table" drop default;' );
		this.addSql( 'alter table "log" alter column "table" type uuid using ("table"::text::uuid);' );
	}
	
}
