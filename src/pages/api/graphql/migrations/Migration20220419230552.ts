import { Migration } from '@mikro-orm/migrations';

export class Migration20220419230552 extends Migration {
	
	async up(): Promise<void> {
		this.addSql( 'alter table "staff" alter column "permissions" type text[] using ("permissions"::text[]);' );
		
		this.addSql( 'alter table "order" add column "status" text check ("status" in (\'CANCELLED\', \'PAID\', \'REFUNDED\', \'PARTIALLY_PAID\', \'STANDING\', \'COMPLETED\', \'VIEWED\', \'SENT\', \'DRAFT\')) not null default \'DRAFT\';' );
		
		this.addSql( 'alter table "purchase" add column "status" text check ("status" in (\'CANCELLED\', \'RECEIVED\', \'ISSUES\', \'CONFIRMED\', \'DECLINED\', \'STANDING\', \'VIEWED\', \'SENT\', \'DRAFT\')) not null default \'DRAFT\';' );
	}
	
	async down(): Promise<void> {
		this.addSql( 'alter table "staff" alter column "permissions" type text[] using ("permissions"::text[]);' );
		
		this.addSql( 'alter table "order" drop column "status";' );
		
		this.addSql( 'alter table "purchase" drop column "status";' );
	}
	
}
