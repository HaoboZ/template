import { Migration } from '@mikro-orm/migrations';

export class Migration20220712215435 extends Migration {
	
	async up(): Promise<void> {
		this.addSql( 'alter table "order" drop constraint if exists "order_status_check";' );
		
		this.addSql( 'alter table "order" alter column "status" type text using ("status"::text);' );
		this.addSql( 'alter table "order" add constraint "order_status_check" check ("status" in (\'CANCELLED\', \'PAID\', \'REFUNDED\', \'PARTIALLY_PAID\', \'PENDING\', \'STANDING\', \'COMPLETED\', \'VIEWED\', \'SENT\', \'DRAFT\'));' );
	}
	
	async down(): Promise<void> {
		this.addSql( 'alter table "order" drop constraint if exists "order_status_check";' );
		
		this.addSql( 'alter table "order" alter column "status" type text using ("status"::text);' );
		this.addSql( 'alter table "order" add constraint "order_status_check" check ("status" in (\'CANCELLED\', \'PAID\', \'REFUNDED\', \'PARTIALLY_PAID\', \'STANDING\', \'COMPLETED\', \'VIEWED\', \'SENT\', \'DRAFT\'));' );
	}
	
}
