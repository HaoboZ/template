import { Migration } from '@mikro-orm/migrations';

export class Migration20220621224136 extends Migration {
	
	async up(): Promise<void> {
		this.addSql( 'create table "store_locations" ("store_id" uuid not null, "location_id" uuid not null);' );
		this.addSql( 'alter table "store_locations" add constraint "store_locations_pkey" primary key ("store_id", "location_id");' );
		
		this.addSql( 'alter table "store_locations" add constraint "store_locations_store_id_foreign" foreign key ("store_id") references "store" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "store_locations" add constraint "store_locations_location_id_foreign" foreign key ("location_id") references "location" ("id") on update cascade on delete cascade;' );
		
		this.addSql( 'alter table "store" drop constraint "store_location_id_foreign";' );
		
		this.addSql( 'alter table "store" drop column "location_id";' );
	}
	
	async down(): Promise<void> {
		this.addSql( 'drop table if exists "store_locations" cascade;' );
		
		this.addSql( 'alter table "store" add column "location_id" uuid not null;' );
		this.addSql( 'alter table "store" add constraint "store_location_id_foreign" foreign key ("location_id") references "location" ("id") on update cascade on delete cascade;' );
	}
	
}
