import { Migration } from '@mikro-orm/migrations';

export class Migration20220506212130 extends Migration {
	
	async up(): Promise<void> {
		this.addSql( 'alter table "payment" drop constraint "payment_external_id_unique";' );
	}
	
	async down(): Promise<void> {
		this.addSql( 'alter table "payment" add constraint "payment_external_id_unique" unique ("external_id");' );
	}
	
}
