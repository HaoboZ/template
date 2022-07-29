import { Migration } from '@mikro-orm/migrations';

export class Migration20220429202218 extends Migration {
	
	async up(): Promise<void> {
		this.addSql( 'alter table "order" drop constraint if exists "order_status_check";' );
		
		this.addSql( 'alter table "purchase" drop constraint if exists "purchase_status_check";' );
		
		this.addSql( 'alter table "gateway" add column "external_refresh" varchar(255) null;' );
		
		this.addSql( 'alter table "staff" alter column "permissions" type text[] using ("permissions"::text[]);' );
		
		this.addSql( 'alter table "store" alter column "type" type text[] using ("type"::text[]);' );
		
		this.addSql( 'alter table "order" alter column "status" drop default;' );
		this.addSql( 'alter table "order" alter column "status" type text using ("status"::text);' );
		this.addSql( 'alter table "order" add constraint "order_status_check" check ("status" in (\'CANCELLED\', \'PAID\', \'REFUNDED\', \'PARTIALLY_PAID\', \'STANDING\', \'COMPLETED\', \'VIEWED\', \'SENT\', \'DRAFT\'));' );
		
		this.addSql( 'alter table "purchase" alter column "status" drop default;' );
		this.addSql( 'alter table "purchase" alter column "status" type text using ("status"::text);' );
		this.addSql( 'alter table "purchase" add constraint "purchase_status_check" check ("status" in (\'CANCELLED\', \'RECEIVED\', \'ISSUES\', \'CONFIRMED\', \'DECLINED\', \'STANDING\', \'VIEWED\', \'SENT\', \'DRAFT\'));' );
	}
	
	async down(): Promise<void> {
		this.addSql( 'alter table "order" drop constraint if exists "order_status_check";' );
		
		this.addSql( 'alter table "purchase" drop constraint if exists "purchase_status_check";' );
		
		this.addSql( 'alter table "gateway" drop column "external_refresh";' );
		
		this.addSql( 'alter table "order" alter column "status" type text using ("status"::text);' );
		this.addSql( 'alter table "order" add constraint "order_status_check" check ("status" in (\'CANCELLED\', \'PAID\', \'REFUNDED\', \'PARTIALLY_PAID\', \'STANDING\', \'COMPLETED\', \'VIEWED\', \'SENT\', \'DRAFT\'));' );
		this.addSql( 'alter table "order" alter column "status" set default \'DRAFT\';' );
		
		this.addSql( 'alter table "purchase" alter column "status" type text using ("status"::text);' );
		this.addSql( 'alter table "purchase" add constraint "purchase_status_check" check ("status" in (\'CANCELLED\', \'RECEIVED\', \'ISSUES\', \'CONFIRMED\', \'DECLINED\', \'STANDING\', \'VIEWED\', \'SENT\', \'DRAFT\'));' );
		this.addSql( 'alter table "purchase" alter column "status" set default \'DRAFT\';' );
		
		this.addSql( 'alter table "staff" alter column "permissions" type text[] using ("permissions"::text[]);' );
		
		this.addSql( 'alter table "store" alter column "type" type text[] using ("type"::text[]);' );
	}
	
}
