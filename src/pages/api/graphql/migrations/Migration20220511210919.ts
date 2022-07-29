import { Migration } from '@mikro-orm/migrations';

export class Migration20220511210919 extends Migration {
	
	async up(): Promise<void> {
		this.addSql( 'create table "line_item_price_groups" ("line_item_id" uuid not null, "price_group_id" uuid not null);' );
		this.addSql( 'alter table "line_item_price_groups" add constraint "line_item_price_groups_pkey" primary key ("line_item_id", "price_group_id");' );
		
		this.addSql( 'alter table "line_item_price_groups" add constraint "line_item_price_groups_line_item_id_foreign" foreign key ("line_item_id") references "line_item" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "line_item_price_groups" add constraint "line_item_price_groups_price_group_id_foreign" foreign key ("price_group_id") references "price_group" ("id") on update cascade on delete cascade;' );
		
		this.addSql( 'drop table if exists "line_item_price_group" cascade;' );
		
		this.addSql( 'alter table "payment" add column "tip" double precision null;' );
	}
	
	async down(): Promise<void> {
		this.addSql( 'create table "line_item_price_group" ("line_item_id" uuid not null, "price_group_id" uuid not null);' );
		this.addSql( 'alter table "line_item_price_group" add constraint "line_item_price_group_pkey" primary key ("line_item_id", "price_group_id");' );
		
		this.addSql( 'alter table "line_item_price_group" add constraint "line_item_price_group_line_item_id_foreign" foreign key ("line_item_id") references "line_item" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "line_item_price_group" add constraint "line_item_price_group_price_group_id_foreign" foreign key ("price_group_id") references "price_group" ("id") on update cascade on delete cascade;' );
		
		this.addSql( 'drop table if exists "line_item_price_groups" cascade;' );
		
		this.addSql( 'alter table "payment" drop column "tip";' );
	}
	
}
