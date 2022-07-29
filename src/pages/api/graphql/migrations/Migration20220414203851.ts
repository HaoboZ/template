import { Migration } from '@mikro-orm/migrations';

export class Migration20220414203851 extends Migration {
	
	async up(): Promise<void> {
		this.addSql( 'alter table "payment" alter column "amount" type double precision using ("amount"::double precision);' );
		this.addSql( 'alter table "payment" alter column "refunded_amount" type double precision using ("refunded_amount"::double precision);' );
	}
	
	async down(): Promise<void> {
		this.addSql( 'alter table "payment" alter column "amount" type int using ("amount"::int);' );
		this.addSql( 'alter table "payment" alter column "refunded_amount" type int using ("refunded_amount"::int);' );
	}
	
}
