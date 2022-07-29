import { Migration } from '@mikro-orm/migrations';

export class Migration20220531175400 extends Migration {
	
	async up(): Promise<void> {
		this.addSql( 'alter table "gateway" drop constraint if exists "gateway_external_check";' );
		
		this.addSql( 'alter table "gateway" alter column "external" type text using ("external"::text);' );
		this.addSql( 'alter table "gateway" add constraint "gateway_external_check" check ("external" in (\'STRIPE\', \'CLOVER\', \'SQUARE\', \'PAYPAL\'));' );
		
		this.addSql( 'alter table "price" add column "metadata" jsonb not null default \'{}\';' );
	}
	
	async down(): Promise<void> {
		this.addSql( 'alter table "gateway" drop constraint if exists "gateway_external_check";' );
		
		this.addSql( 'alter table "gateway" alter column "external" type text using ("external"::text);' );
		this.addSql( 'alter table "gateway" add constraint "gateway_external_check" check ("external" in (\'STRIPE\', \'CLOVER\', \'SQUARE\'));' );
		
		this.addSql( 'alter table "price" drop column "metadata";' );
	}
	
}
