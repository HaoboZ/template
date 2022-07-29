import { Migration } from '@mikro-orm/migrations';

export class Migration20220425224203 extends Migration {
	
	async up(): Promise<void> {
		this.addSql( 'alter table "staff" alter column "permissions" type text[] using ("permissions"::text[]);' );
		
		this.addSql( 'alter table "address" alter column "postal_code" type varchar(255) using ("postal_code"::varchar(255));' );
		this.addSql( 'alter table "address" alter column "postal_code" drop not null;' );
	}
	
	async down(): Promise<void> {
		this.addSql( 'alter table "staff" alter column "permissions" type text[] using ("permissions"::text[]);' );
		
		this.addSql( 'alter table "address" alter column "postal_code" type varchar(255) using ("postal_code"::varchar(255));' );
		this.addSql( 'alter table "address" alter column "postal_code" set not null;' );
	}
	
}
