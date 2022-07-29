import { Migration } from '@mikro-orm/migrations';

export class Migration20220525210717 extends Migration {
	
	async up(): Promise<void> {
		this.addSql( 'alter table "price_group" add column "min" double precision null, add column "max" double precision null;' );
		
		this.addSql( 'alter table "price" add column "min" double precision null, add column "max" double precision null;' );
	}
	
	async down(): Promise<void> {
		this.addSql( 'alter table "price_group" drop column "min";' );
		this.addSql( 'alter table "price_group" drop column "max";' );
		
		this.addSql( 'alter table "price" drop column "min";' );
		this.addSql( 'alter table "price" drop column "max";' );
	}
	
}
