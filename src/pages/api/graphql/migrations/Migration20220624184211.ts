import { Migration } from '@mikro-orm/migrations';

export class Migration20220624184211 extends Migration {
	
	async up(): Promise<void> {
		this.addSql( 'alter table "line_item_price_groups" drop constraint "line_item_price_groups_price_group_id_foreign";' );
		
		this.addSql( 'alter table "price" drop constraint "price_price_group_id_foreign";' );
		
		this.addSql( 'create table "modifier_group" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "min" double precision null, "max" double precision null, "company_id" uuid not null, "gateway_id" uuid null, "external_id" varchar(255) null);' );
		this.addSql( 'alter table "modifier_group" add constraint "modifier_group_external_id_unique" unique ("external_id");' );
		this.addSql( 'alter table "modifier_group" add constraint "modifier_group_pkey" primary key ("id");' );
		
		this.addSql( 'create table "modifier" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "is_percent" boolean null, "value" double precision not null, "quantity" int not null default 1, "min" double precision null, "max" double precision null, "metadata" jsonb not null default \'{}\', "modifier_group_id" uuid null, "external_id" varchar(255) null);' );
		this.addSql( 'alter table "modifier" add constraint "modifier_external_id_unique" unique ("external_id");' );
		this.addSql( 'alter table "modifier" add constraint "modifier_pkey" primary key ("id");' );
		
		this.addSql( 'create table "line_item_modifier_groups" ("line_item_id" uuid not null, "modifier_group_id" uuid not null);' );
		this.addSql( 'alter table "line_item_modifier_groups" add constraint "line_item_modifier_groups_pkey" primary key ("line_item_id", "modifier_group_id");' );
		
		this.addSql( 'alter table "modifier_group" add constraint "modifier_group_company_id_foreign" foreign key ("company_id") references "company" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "modifier_group" add constraint "modifier_group_gateway_id_foreign" foreign key ("gateway_id") references "gateway" ("id") on update cascade on delete set null;' );
		
		this.addSql( 'alter table "modifier" add constraint "modifier_modifier_group_id_foreign" foreign key ("modifier_group_id") references "modifier_group" ("id") on update cascade on delete cascade;' );
		
		this.addSql( 'alter table "line_item_modifier_groups" add constraint "line_item_modifier_groups_line_item_id_foreign" foreign key ("line_item_id") references "line_item" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "line_item_modifier_groups" add constraint "line_item_modifier_groups_modifier_group_id_foreign" foreign key ("modifier_group_id") references "modifier_group" ("id") on update cascade on delete cascade;' );
		
		this.addSql( 'drop table if exists "price_group" cascade;' );
		
		this.addSql( 'drop table if exists "line_item_price_groups" cascade;' );
		
		this.addSql( 'alter table "price" drop constraint "price_external_id_unique";' );
		this.addSql( 'alter table "price" drop column "min";' );
		this.addSql( 'alter table "price" drop column "max";' );
		this.addSql( 'alter table "price" drop column "price_group_id";' );
		this.addSql( 'alter table "price" drop column "external_id";' );
	}
	
	async down(): Promise<void> {
		this.addSql( 'alter table "modifier" drop constraint "modifier_modifier_group_id_foreign";' );
		
		this.addSql( 'alter table "line_item_modifier_groups" drop constraint "line_item_modifier_groups_modifier_group_id_foreign";' );
		
		this.addSql( 'create table "price_group" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "min" double precision null, "max" double precision null, "company_id" uuid not null, "gateway_id" uuid null, "external_id" varchar(255) null);' );
		this.addSql( 'alter table "price_group" add constraint "price_group_external_id_unique" unique ("external_id");' );
		this.addSql( 'alter table "price_group" add constraint "price_group_pkey" primary key ("id");' );
		
		this.addSql( 'create table "line_item_price_groups" ("line_item_id" uuid not null, "price_group_id" uuid not null);' );
		this.addSql( 'alter table "line_item_price_groups" add constraint "line_item_price_groups_pkey" primary key ("line_item_id", "price_group_id");' );
		
		this.addSql( 'alter table "price_group" add constraint "price_group_company_id_foreign" foreign key ("company_id") references "company" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "price_group" add constraint "price_group_gateway_id_foreign" foreign key ("gateway_id") references "gateway" ("id") on update cascade on delete set null;' );
		
		this.addSql( 'alter table "line_item_price_groups" add constraint "line_item_price_groups_line_item_id_foreign" foreign key ("line_item_id") references "line_item" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "line_item_price_groups" add constraint "line_item_price_groups_price_group_id_foreign" foreign key ("price_group_id") references "price_group" ("id") on update cascade on delete cascade;' );
		
		this.addSql( 'drop table if exists "modifier_group" cascade;' );
		
		this.addSql( 'drop table if exists "modifier" cascade;' );
		
		this.addSql( 'drop table if exists "line_item_modifier_groups" cascade;' );
		
		this.addSql( 'alter table "price" add column "min" double precision null, add column "max" double precision null, add column "price_group_id" uuid null, add column "external_id" varchar(255) null;' );
		this.addSql( 'alter table "price" add constraint "price_price_group_id_foreign" foreign key ("price_group_id") references "price_group" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "price" add constraint "price_external_id_unique" unique ("external_id");' );
	}
	
}
