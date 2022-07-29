import { Migration } from '@mikro-orm/migrations';

export class Migration20220414203612 extends Migration {
	
	async up(): Promise<void> {
		this.addSql( 'alter table "line_item" alter column "quantity" type double precision using ("quantity"::double precision);' );
		this.addSql( 'alter table "line_item" alter column "price" type double precision using ("price"::double precision);' );
		this.addSql( 'alter table "line_item" alter column "tax" type double precision using ("tax"::double precision);' );
	}
	
	async down(): Promise<void> {
		this.addSql( 'alter table "line_item" alter column "quantity" type int using ("quantity"::int);' );
		this.addSql( 'alter table "line_item" alter column "price" type int using ("price"::int);' );
		this.addSql( 'alter table "line_item" alter column "tax" type int using ("tax"::int);' );
	}
	
}
