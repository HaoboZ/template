import { Migration } from '@mikro-orm/migrations';

export class Migration20220414215726 extends Migration {
	
	async up(): Promise<void> {
		this.addSql( 'alter table "uom" add column "quantity" double precision null;' );
		this.addSql( 'alter table "uom" alter column "price" type double precision using ("price"::double precision);' );
		this.addSql( 'alter table "uom" alter column "cost" type double precision using ("cost"::double precision);' );
	}
	
	async down(): Promise<void> {
		this.addSql( 'alter table "uom" alter column "price" type int using ("price"::int);' );
		this.addSql( 'alter table "uom" alter column "cost" type int using ("cost"::int);' );
		this.addSql( 'alter table "uom" drop column "quantity";' );
	}
	
}
