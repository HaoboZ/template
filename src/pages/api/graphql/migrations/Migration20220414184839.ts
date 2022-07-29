import { Migration } from '@mikro-orm/migrations';

export class Migration20220414184839 extends Migration {
	
	async up(): Promise<void> {
		this.addSql( 'create table "user" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "email" varchar(255) not null, "first_name" varchar(255) null, "last_name" varchar(255) null, "image" text null, "last_login" timestamptz(0) null, "external_id" varchar(255) null);' );
		this.addSql( 'alter table "user" add constraint "user_email_unique" unique ("email");' );
		this.addSql( 'alter table "user" add constraint "user_external_id_unique" unique ("external_id");' );
		this.addSql( 'alter table "user" add constraint "user_pkey" primary key ("id");' );
		
		this.addSql( 'create table "tier" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "sequence" smallint not null, "name" varchar(255) not null, "price" int not null, "external_ids" jsonb not null, "description" varchar(255) not null, "descriptions" jsonb not null);' );
		this.addSql( 'alter table "tier" add constraint "tier_pkey" primary key ("id");' );
		
		this.addSql( 'create table "subscribe" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "external" text check ("external" in (\'NONE\', \'STRIPE\', \'CLOVER\', \'APPLE\', \'GOOGLE\')) not null, "external_id" varchar(255) null, "external_key" varchar(255) null, "status" text check ("status" in (\'INCOMPLETE\', \'INCOMPLETE_EXPIRED\', \'TRIALING\', \'ACTIVE\', \'PAST_DUE\', \'CANCELED\', \'UNPAID\')) not null, "end_date" timestamptz(0) null, "tier_id" uuid not null);' );
		this.addSql( 'alter table "subscribe" add constraint "subscribe_external_id_unique" unique ("external_id");' );
		this.addSql( 'alter table "subscribe" add constraint "subscribe_pkey" primary key ("id");' );
		
		this.addSql( 'create table "demo" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null);' );
		this.addSql( 'alter table "demo" add constraint "demo_pkey" primary key ("id");' );
		
		this.addSql( 'create table "company" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "name" varchar(255) not null, "contact" varchar(255) null, "email" varchar(255) not null, "phone" varchar(255) null, "description" varchar(255) null, "source" text check ("source" in (\'WEBSITE\', \'APP\', \'CLOVER\', \'OTHER\')) not null, "logo" text null, "banner" text null, "subdomain" varchar(255) null, "metadata" jsonb not null default \'{}\', "subscription_id" uuid null);' );
		this.addSql( 'alter table "company" add constraint "company_subdomain_unique" unique ("subdomain");' );
		this.addSql( 'alter table "company" add constraint "company_subscription_id_unique" unique ("subscription_id");' );
		this.addSql( 'alter table "company" add constraint "company_pkey" primary key ("id");' );
		
		this.addSql( 'create table "gateway" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "external" text check ("external" in (\'STRIPE\', \'CLOVER\', \'SQUARE\')) not null, "active" boolean not null, "external_id" varchar(255) null, "external_key" varchar(255) null, "company_id" uuid null);' );
		this.addSql( 'alter table "gateway" add constraint "gateway_pkey" primary key ("id");' );
		
		this.addSql( 'create table "client" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "name" varchar(255) null, "contact" varchar(255) not null, "email" varchar(255) null, "phone" varchar(255) null, "cell" varchar(255) null, "logo" text null, "statement" boolean not null, "code" varchar(255) null, "metadata" jsonb not null default \'{}\', "company_id" uuid not null, "gateway_id" uuid null, "external_id" varchar(255) null);' );
		this.addSql( 'alter table "client" add constraint "client_external_id_unique" unique ("external_id");' );
		this.addSql( 'alter table "client" add constraint "client_pkey" primary key ("id");' );
		
		this.addSql( 'create table "item" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "name" varchar(255) not null, "description" text null, "image" text null, "taxable" boolean null, "is_inventory" boolean null, "type" text check ("type" in (\'RAW_MATERIALS\', \'WORK_IN_PROCESS\', \'FINISHED_GOODS\')) null, "company_id" uuid null, "gateway_id" uuid null, "external_id" varchar(255) null);' );
		this.addSql( 'alter table "item" add constraint "item_external_id_unique" unique ("external_id");' );
		this.addSql( 'alter table "item" add constraint "item_pkey" primary key ("id");' );
		
		this.addSql( 'create table "uom" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "price" int not null, "image" text null, "sku" varchar(255) null, "selected" boolean null, "sequence" smallint not null, "cost" int null, "vendor_sku" varchar(255) null, "item_id" uuid not null);' );
		this.addSql( 'alter table "uom" add constraint "uom_pkey" primary key ("id");' );
		
		this.addSql( 'create table "log" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "lat" int null, "lng" int null, "acc" int null, "type" varchar(255) not null, "name" varchar(255) null, "text" text null, "document_id" uuid null, "company_id" uuid null, "user_id" uuid null);' );
		this.addSql( 'alter table "log" add constraint "log_pkey" primary key ("id");' );
		
		this.addSql( 'create table "menu" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "name" varchar(255) null, "categories" text[] not null, "vendor_name" varchar(255) null, "vendor_contact" varchar(255) null, "vendor_phone" varchar(255) null, "vendor_email" varchar(255) null, "vendor_logo" text null, "vendor_banner" text null, "vendor_description" text null, "vendor_url" varchar(255) null, "active" boolean not null, "company_id" uuid not null);' );
		this.addSql( 'alter table "menu" add constraint "menu_pkey" primary key ("id");' );
		
		this.addSql( 'create table "menu_uoms" ("menu_id" uuid not null, "uom_id" uuid not null);' );
		this.addSql( 'alter table "menu_uoms" add constraint "menu_uoms_pkey" primary key ("menu_id", "uom_id");' );
		
		this.addSql( 'create table "policy" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "policy" text not null, "company_id" uuid not null);' );
		this.addSql( 'alter table "policy" add constraint "policy_pkey" primary key ("id");' );
		
		this.addSql( 'create table "price_group" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "company_id" uuid not null);' );
		this.addSql( 'alter table "price_group" add constraint "price_group_pkey" primary key ("id");' );
		
		this.addSql( 'create table "room" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "name" varchar(255) null, "linked_id" uuid null, "visible" boolean not null, "user_id" uuid null, "client_id" uuid null, "unread_messages_count" jsonb not null, "company_id" uuid null);' );
		this.addSql( 'alter table "room" add constraint "room_linked_id_unique" unique ("linked_id");' );
		this.addSql( 'alter table "room" add constraint "room_pkey" primary key ("id");' );
		
		this.addSql( 'create table "message" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "content" varchar(255) not null, "notified" timestamptz(0) null, "attachment" text null, "room_id" uuid not null, "user_id" uuid null, "client_id" uuid null);' );
		this.addSql( 'alter table "message" add constraint "message_pkey" primary key ("id");' );
		
		this.addSql( 'create table "room_users" ("room_id" uuid not null, "user_id" uuid not null);' );
		this.addSql( 'alter table "room_users" add constraint "room_users_pkey" primary key ("room_id", "user_id");' );
		
		this.addSql( 'create table "staff" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "permissions" text[] not null, "email" varchar(255) not null, "code" varchar(255) null, "user_id" uuid null, "company_id" uuid not null);' );
		this.addSql( 'alter table "staff" add constraint "staff_pkey" primary key ("id");' );
		
		this.addSql( 'create table "category" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "name" varchar(255) not null, "description" text null, "sequence" smallint not null, "company_id" uuid not null, "gateway_id" uuid null, "external_id" varchar(255) null);' );
		this.addSql( 'alter table "category" add constraint "category_external_id_unique" unique ("external_id");' );
		this.addSql( 'alter table "category" add constraint "category_pkey" primary key ("id");' );
		
		this.addSql( 'create table "item_categories" ("item_id" uuid not null, "category_id" uuid not null);' );
		this.addSql( 'alter table "item_categories" add constraint "item_categories_pkey" primary key ("item_id", "category_id");' );
		
		this.addSql( 'create table "address" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "line1" varchar(255) not null, "line2" varchar(255) null, "city" varchar(255) not null, "state" varchar(255) not null, "postal_code" varchar(255) not null, "country" varchar(255) not null, "lat" double precision null, "lng" double precision null, "client_id" uuid null);' );
		this.addSql( 'alter table "address" add constraint "address_pkey" primary key ("id");' );
		
		this.addSql( 'create table "location" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "name" varchar(255) not null, "sequence" smallint not null, "tax" int null, "open" time(0) null, "close" time(0) null, "policy_id" uuid null, "address_id" uuid null, "company_id" uuid not null, "gateway_id" uuid null, "external_id" varchar(255) null);' );
		this.addSql( 'alter table "location" add constraint "location_address_id_unique" unique ("address_id");' );
		this.addSql( 'alter table "location" add constraint "location_external_id_unique" unique ("external_id");' );
		this.addSql( 'alter table "location" add constraint "location_pkey" primary key ("id");' );
		
		this.addSql( 'create table "inventory_run" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "number" varchar(255) not null, "end" timestamptz(0) null, "company_id" uuid not null, "location_id" uuid not null);' );
		this.addSql( 'alter table "inventory_run" add constraint "inventory_run_pkey" primary key ("id");' );
		
		this.addSql( 'create table "inventory_entry" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "price" double precision not null, "quantity" double precision not null, "sku" varchar(255) not null, "vendor_sku" varchar(255) null, "inventory_run_id" uuid not null, "user_id" uuid null, "uom_id" uuid null);' );
		this.addSql( 'alter table "inventory_entry" add constraint "inventory_entry_pkey" primary key ("id");' );
		
		this.addSql( 'create table "inventory_run_users" ("inventory_run_id" uuid not null, "user_id" uuid not null);' );
		this.addSql( 'alter table "inventory_run_users" add constraint "inventory_run_users_pkey" primary key ("inventory_run_id", "user_id");' );
		
		this.addSql( 'create table "store" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "name" varchar(255) not null, "banner" varchar(255) null, "description" text null, "active" boolean not null, "min_delivery" int not null, "type" text[] not null, "city" text[] not null, "country" text[] not null, "zip_code" text[] not null, "company_id" uuid not null, "location_id" uuid not null);' );
		this.addSql( 'alter table "store" add constraint "store_pkey" primary key ("id");' );
		
		this.addSql( 'create table "category_locations" ("category_id" uuid not null, "location_id" uuid not null);' );
		this.addSql( 'alter table "category_locations" add constraint "category_locations_pkey" primary key ("category_id", "location_id");' );
		
		this.addSql( 'create table "item_locations" ("item_id" uuid not null, "location_id" uuid not null);' );
		this.addSql( 'alter table "item_locations" add constraint "item_locations_pkey" primary key ("item_id", "location_id");' );
		
		this.addSql( 'create table "menu_serving_locations" ("menu_id" uuid not null, "location_id" uuid not null);' );
		this.addSql( 'alter table "menu_serving_locations" add constraint "menu_serving_locations_pkey" primary key ("menu_id", "location_id");' );
		
		this.addSql( 'create table "staff_locations" ("staff_id" uuid not null, "location_id" uuid not null);' );
		this.addSql( 'alter table "staff_locations" add constraint "staff_locations_pkey" primary key ("staff_id", "location_id");' );
		
		this.addSql( 'create table "order" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "type" text check ("type" in (\'ESTIMATE\', \'INVOICE\', \'ORDER\', \'SUBSCRIPTION\')) not null, "number" varchar(255) null, "delivery_status" varchar(255) null, "notes" text null, "po" varchar(255) null, "terms" varchar(255) null, "standing" boolean null, "standing_active" boolean not null, "standing_due" int null, "standing_data" jsonb not null, "due_period" int null, "standing_date" timestamptz(0) null, "due_date" timestamptz(0) null, "service_type" varchar(255) null, "service_date" timestamptz(0) null, "attachments" text[] not null, "date_sent" timestamptz(0) null, "tax_percent" double precision not null, "tax_total" double precision not null, "sub_total" double precision not null, "grand_total" double precision not null, "override_total" double precision null, "paid_total" double precision not null, "cancelled" boolean null, "paid" boolean null, "payment_failed" boolean null, "completed" boolean null, "viewed" boolean null, "sent" boolean null, "delivery" boolean null, "printed" boolean null, "refunded" boolean null, "old_hash" varchar(255) null, "client_id" uuid null, "company_location_id" uuid null, "client_address_id" uuid null, "shipping_address_id" uuid null, "policy_id" uuid null, "staff_id" uuid null, "metadata" jsonb not null default \'{}\', "company_id" uuid not null, "gateway_id" uuid null, "external_id" varchar(255) null);' );
		this.addSql( 'alter table "order" add constraint "order_old_hash_unique" unique ("old_hash");' );
		this.addSql( 'alter table "order" add constraint "order_external_id_unique" unique ("external_id");' );
		this.addSql( 'alter table "order" add constraint "order_pkey" primary key ("id");' );
		
		this.addSql( 'create table "payment" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "amount" int not null, "type" varchar(255) null, "check_number" varchar(255) null, "note" varchar(255) null, "status" text check ("status" in (\'OPEN\', \'PARTIALLY_REFUNDED\', \'PAID\', \'SUCCEEDED\', \'REFUNDED\', \'CANCELLED\', \'FAILED\')) null, "refunded_amount" int null, "signature" text null, "client_id" uuid null, "order_id" uuid null, "company_id" uuid not null, "gateway_id" uuid null, "external_id" varchar(255) null);' );
		this.addSql( 'alter table "payment" add constraint "payment_external_id_unique" unique ("external_id");' );
		this.addSql( 'alter table "payment" add constraint "payment_pkey" primary key ("id");' );
		
		this.addSql( 'create table "purchase" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null, "number" varchar(255) null, "delivery_status" varchar(255) null, "notes" text null, "po" varchar(255) null, "terms" varchar(255) null, "standing" boolean null, "standing_active" boolean not null, "standing_due" int null, "standing_data" jsonb not null, "due_period" int null, "standing_date" timestamptz(0) null, "due_date" timestamptz(0) null, "service_date" timestamptz(0) null, "attachments" text[] not null, "date_sent" timestamptz(0) null, "tax_percent" double precision not null, "tax_total" double precision not null, "sub_total" double precision not null, "grand_total" double precision not null, "cancelled" boolean null, "received" boolean null, "issues" boolean null, "confirmed" boolean null, "declined" boolean null, "viewed" boolean null, "sent" boolean null, "delivery" boolean null, "printed" boolean null, "no_prices" boolean null, "company_location_id" uuid null, "vendor_address_id" uuid null, "shipping_address_id" uuid null, "menu_id" uuid null, "staff_id" uuid null, "metadata" jsonb not null default \'{}\', "company_id" uuid not null);' );
		this.addSql( 'alter table "purchase" add constraint "purchase_pkey" primary key ("id");' );
		
		this.addSql( 'create table "line_item" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "sequence" smallint not null, "quantity" int not null, "name" varchar(255) not null, "description" text null, "image" text null, "unit" varchar(255) null, "price" int not null, "tax" int null, "status" varchar(255) null, "note" text null, "item_id" uuid null, "uom_id" uuid null, "category_id" uuid null, "order_id" uuid null, "store_id" uuid null, "purchase_id" uuid null);' );
		this.addSql( 'alter table "line_item" add constraint "line_item_pkey" primary key ("id");' );
		
		this.addSql( 'create table "line_item_price_group" ("line_item_id" uuid not null, "price_group_id" uuid not null);' );
		this.addSql( 'alter table "line_item_price_group" add constraint "line_item_price_group_pkey" primary key ("line_item_id", "price_group_id");' );
		
		this.addSql( 'create table "price" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "is_percent" boolean null, "value" double precision not null, "quantity" int not null default 1, "company_id" uuid null, "line_item_id" uuid null, "order_id" uuid null, "purchase_id" uuid null, "store_id" uuid null, "price_group_id" uuid null);' );
		this.addSql( 'alter table "price" add constraint "price_pkey" primary key ("id");' );
		
		this.addSql( 'alter table "subscribe" add constraint "subscribe_tier_id_foreign" foreign key ("tier_id") references "tier" ("id") on update cascade on delete cascade;' );
		
		this.addSql( 'alter table "company" add constraint "company_subscription_id_foreign" foreign key ("subscription_id") references "subscribe" ("id") on update cascade on delete cascade;' );
		
		this.addSql( 'alter table "gateway" add constraint "gateway_company_id_foreign" foreign key ("company_id") references "company" ("id") on update cascade on delete cascade;' );
		
		this.addSql( 'alter table "client" add constraint "client_company_id_foreign" foreign key ("company_id") references "company" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "client" add constraint "client_gateway_id_foreign" foreign key ("gateway_id") references "gateway" ("id") on update cascade on delete set null;' );
		
		this.addSql( 'alter table "item" add constraint "item_company_id_foreign" foreign key ("company_id") references "company" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "item" add constraint "item_gateway_id_foreign" foreign key ("gateway_id") references "gateway" ("id") on update cascade on delete set null;' );
		
		this.addSql( 'alter table "uom" add constraint "uom_item_id_foreign" foreign key ("item_id") references "item" ("id") on update cascade on delete cascade;' );
		
		this.addSql( 'alter table "log" add constraint "log_company_id_foreign" foreign key ("company_id") references "company" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "log" add constraint "log_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;' );
		
		this.addSql( 'alter table "menu" add constraint "menu_company_id_foreign" foreign key ("company_id") references "company" ("id") on update cascade on delete cascade;' );
		
		this.addSql( 'alter table "menu_uoms" add constraint "menu_uoms_menu_id_foreign" foreign key ("menu_id") references "menu" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "menu_uoms" add constraint "menu_uoms_uom_id_foreign" foreign key ("uom_id") references "uom" ("id") on update cascade on delete cascade;' );
		
		this.addSql( 'alter table "policy" add constraint "policy_company_id_foreign" foreign key ("company_id") references "company" ("id") on update cascade on delete cascade;' );
		
		this.addSql( 'alter table "price_group" add constraint "price_group_company_id_foreign" foreign key ("company_id") references "company" ("id") on update cascade on delete cascade;' );
		
		this.addSql( 'alter table "room" add constraint "room_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;' );
		this.addSql( 'alter table "room" add constraint "room_client_id_foreign" foreign key ("client_id") references "client" ("id") on update cascade on delete set null;' );
		this.addSql( 'alter table "room" add constraint "room_company_id_foreign" foreign key ("company_id") references "company" ("id") on update cascade on delete cascade;' );
		
		this.addSql( 'alter table "message" add constraint "message_room_id_foreign" foreign key ("room_id") references "room" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "message" add constraint "message_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;' );
		this.addSql( 'alter table "message" add constraint "message_client_id_foreign" foreign key ("client_id") references "client" ("id") on update cascade on delete set null;' );
		
		this.addSql( 'alter table "room_users" add constraint "room_users_room_id_foreign" foreign key ("room_id") references "room" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "room_users" add constraint "room_users_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;' );
		
		this.addSql( 'alter table "staff" add constraint "staff_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "staff" add constraint "staff_company_id_foreign" foreign key ("company_id") references "company" ("id") on update cascade on delete cascade;' );
		
		this.addSql( 'alter table "category" add constraint "category_company_id_foreign" foreign key ("company_id") references "company" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "category" add constraint "category_gateway_id_foreign" foreign key ("gateway_id") references "gateway" ("id") on update cascade on delete set null;' );
		
		this.addSql( 'alter table "item_categories" add constraint "item_categories_item_id_foreign" foreign key ("item_id") references "item" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "item_categories" add constraint "item_categories_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade on delete cascade;' );
		
		this.addSql( 'alter table "address" add constraint "address_client_id_foreign" foreign key ("client_id") references "client" ("id") on update cascade on delete cascade;' );
		
		this.addSql( 'alter table "location" add constraint "location_policy_id_foreign" foreign key ("policy_id") references "policy" ("id") on update cascade on delete set null;' );
		this.addSql( 'alter table "location" add constraint "location_address_id_foreign" foreign key ("address_id") references "address" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "location" add constraint "location_company_id_foreign" foreign key ("company_id") references "company" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "location" add constraint "location_gateway_id_foreign" foreign key ("gateway_id") references "gateway" ("id") on update cascade on delete set null;' );
		
		this.addSql( 'alter table "inventory_run" add constraint "inventory_run_company_id_foreign" foreign key ("company_id") references "company" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "inventory_run" add constraint "inventory_run_location_id_foreign" foreign key ("location_id") references "location" ("id") on update cascade on delete cascade;' );
		
		this.addSql( 'alter table "inventory_entry" add constraint "inventory_entry_inventory_run_id_foreign" foreign key ("inventory_run_id") references "inventory_run" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "inventory_entry" add constraint "inventory_entry_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;' );
		this.addSql( 'alter table "inventory_entry" add constraint "inventory_entry_uom_id_foreign" foreign key ("uom_id") references "uom" ("id") on update cascade on delete set null;' );
		
		this.addSql( 'alter table "inventory_run_users" add constraint "inventory_run_users_inventory_run_id_foreign" foreign key ("inventory_run_id") references "inventory_run" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "inventory_run_users" add constraint "inventory_run_users_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;' );
		
		this.addSql( 'alter table "store" add constraint "store_company_id_foreign" foreign key ("company_id") references "company" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "store" add constraint "store_location_id_foreign" foreign key ("location_id") references "location" ("id") on update cascade on delete cascade;' );
		
		this.addSql( 'alter table "category_locations" add constraint "category_locations_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "category_locations" add constraint "category_locations_location_id_foreign" foreign key ("location_id") references "location" ("id") on update cascade on delete cascade;' );
		
		this.addSql( 'alter table "item_locations" add constraint "item_locations_item_id_foreign" foreign key ("item_id") references "item" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "item_locations" add constraint "item_locations_location_id_foreign" foreign key ("location_id") references "location" ("id") on update cascade on delete cascade;' );
		
		this.addSql( 'alter table "menu_serving_locations" add constraint "menu_serving_locations_menu_id_foreign" foreign key ("menu_id") references "menu" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "menu_serving_locations" add constraint "menu_serving_locations_location_id_foreign" foreign key ("location_id") references "location" ("id") on update cascade on delete cascade;' );
		
		this.addSql( 'alter table "staff_locations" add constraint "staff_locations_staff_id_foreign" foreign key ("staff_id") references "staff" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "staff_locations" add constraint "staff_locations_location_id_foreign" foreign key ("location_id") references "location" ("id") on update cascade on delete cascade;' );
		
		this.addSql( 'alter table "order" add constraint "order_client_id_foreign" foreign key ("client_id") references "client" ("id") on update cascade on delete set null;' );
		this.addSql( 'alter table "order" add constraint "order_company_location_id_foreign" foreign key ("company_location_id") references "location" ("id") on update cascade on delete set null;' );
		this.addSql( 'alter table "order" add constraint "order_client_address_id_foreign" foreign key ("client_address_id") references "address" ("id") on update cascade on delete set null;' );
		this.addSql( 'alter table "order" add constraint "order_shipping_address_id_foreign" foreign key ("shipping_address_id") references "address" ("id") on update cascade on delete set null;' );
		this.addSql( 'alter table "order" add constraint "order_policy_id_foreign" foreign key ("policy_id") references "policy" ("id") on update cascade on delete set null;' );
		this.addSql( 'alter table "order" add constraint "order_staff_id_foreign" foreign key ("staff_id") references "staff" ("id") on update cascade on delete set null;' );
		this.addSql( 'alter table "order" add constraint "order_company_id_foreign" foreign key ("company_id") references "company" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "order" add constraint "order_gateway_id_foreign" foreign key ("gateway_id") references "gateway" ("id") on update cascade on delete set null;' );
		
		this.addSql( 'alter table "payment" add constraint "payment_client_id_foreign" foreign key ("client_id") references "client" ("id") on update cascade on delete set null;' );
		this.addSql( 'alter table "payment" add constraint "payment_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "payment" add constraint "payment_company_id_foreign" foreign key ("company_id") references "company" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "payment" add constraint "payment_gateway_id_foreign" foreign key ("gateway_id") references "gateway" ("id") on update cascade on delete set null;' );
		
		this.addSql( 'alter table "purchase" add constraint "purchase_company_location_id_foreign" foreign key ("company_location_id") references "location" ("id") on update cascade on delete set null;' );
		this.addSql( 'alter table "purchase" add constraint "purchase_vendor_address_id_foreign" foreign key ("vendor_address_id") references "address" ("id") on update cascade on delete set null;' );
		this.addSql( 'alter table "purchase" add constraint "purchase_shipping_address_id_foreign" foreign key ("shipping_address_id") references "address" ("id") on update cascade on delete set null;' );
		this.addSql( 'alter table "purchase" add constraint "purchase_menu_id_foreign" foreign key ("menu_id") references "menu" ("id") on update cascade on delete set null;' );
		this.addSql( 'alter table "purchase" add constraint "purchase_staff_id_foreign" foreign key ("staff_id") references "staff" ("id") on update cascade on delete set null;' );
		this.addSql( 'alter table "purchase" add constraint "purchase_company_id_foreign" foreign key ("company_id") references "company" ("id") on update cascade on delete cascade;' );
		
		this.addSql( 'alter table "line_item" add constraint "line_item_item_id_foreign" foreign key ("item_id") references "item" ("id") on update cascade on delete set null;' );
		this.addSql( 'alter table "line_item" add constraint "line_item_uom_id_foreign" foreign key ("uom_id") references "uom" ("id") on update cascade on delete set null;' );
		this.addSql( 'alter table "line_item" add constraint "line_item_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade on delete set null;' );
		this.addSql( 'alter table "line_item" add constraint "line_item_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "line_item" add constraint "line_item_store_id_foreign" foreign key ("store_id") references "store" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "line_item" add constraint "line_item_purchase_id_foreign" foreign key ("purchase_id") references "purchase" ("id") on update cascade on delete cascade;' );
		
		this.addSql( 'alter table "line_item_price_group" add constraint "line_item_price_group_line_item_id_foreign" foreign key ("line_item_id") references "line_item" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "line_item_price_group" add constraint "line_item_price_group_price_group_id_foreign" foreign key ("price_group_id") references "price_group" ("id") on update cascade on delete cascade;' );
		
		this.addSql( 'alter table "price" add constraint "price_company_id_foreign" foreign key ("company_id") references "company" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "price" add constraint "price_line_item_id_foreign" foreign key ("line_item_id") references "line_item" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "price" add constraint "price_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "price" add constraint "price_purchase_id_foreign" foreign key ("purchase_id") references "purchase" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "price" add constraint "price_store_id_foreign" foreign key ("store_id") references "store" ("id") on update cascade on delete cascade;' );
		this.addSql( 'alter table "price" add constraint "price_price_group_id_foreign" foreign key ("price_group_id") references "price_group" ("id") on update cascade on delete cascade;' );
	}
	
	async down(): Promise<void> {
		this.addSql( 'alter table "log" drop constraint "log_user_id_foreign";' );
		
		this.addSql( 'alter table "room" drop constraint "room_user_id_foreign";' );
		
		this.addSql( 'alter table "message" drop constraint "message_user_id_foreign";' );
		
		this.addSql( 'alter table "room_users" drop constraint "room_users_user_id_foreign";' );
		
		this.addSql( 'alter table "staff" drop constraint "staff_user_id_foreign";' );
		
		this.addSql( 'alter table "inventory_entry" drop constraint "inventory_entry_user_id_foreign";' );
		
		this.addSql( 'alter table "inventory_run_users" drop constraint "inventory_run_users_user_id_foreign";' );
		
		this.addSql( 'alter table "subscribe" drop constraint "subscribe_tier_id_foreign";' );
		
		this.addSql( 'alter table "company" drop constraint "company_subscription_id_foreign";' );
		
		this.addSql( 'alter table "gateway" drop constraint "gateway_company_id_foreign";' );
		
		this.addSql( 'alter table "client" drop constraint "client_company_id_foreign";' );
		
		this.addSql( 'alter table "item" drop constraint "item_company_id_foreign";' );
		
		this.addSql( 'alter table "log" drop constraint "log_company_id_foreign";' );
		
		this.addSql( 'alter table "menu" drop constraint "menu_company_id_foreign";' );
		
		this.addSql( 'alter table "policy" drop constraint "policy_company_id_foreign";' );
		
		this.addSql( 'alter table "price_group" drop constraint "price_group_company_id_foreign";' );
		
		this.addSql( 'alter table "room" drop constraint "room_company_id_foreign";' );
		
		this.addSql( 'alter table "staff" drop constraint "staff_company_id_foreign";' );
		
		this.addSql( 'alter table "category" drop constraint "category_company_id_foreign";' );
		
		this.addSql( 'alter table "location" drop constraint "location_company_id_foreign";' );
		
		this.addSql( 'alter table "inventory_run" drop constraint "inventory_run_company_id_foreign";' );
		
		this.addSql( 'alter table "store" drop constraint "store_company_id_foreign";' );
		
		this.addSql( 'alter table "order" drop constraint "order_company_id_foreign";' );
		
		this.addSql( 'alter table "payment" drop constraint "payment_company_id_foreign";' );
		
		this.addSql( 'alter table "purchase" drop constraint "purchase_company_id_foreign";' );
		
		this.addSql( 'alter table "price" drop constraint "price_company_id_foreign";' );
		
		this.addSql( 'alter table "client" drop constraint "client_gateway_id_foreign";' );
		
		this.addSql( 'alter table "item" drop constraint "item_gateway_id_foreign";' );
		
		this.addSql( 'alter table "category" drop constraint "category_gateway_id_foreign";' );
		
		this.addSql( 'alter table "location" drop constraint "location_gateway_id_foreign";' );
		
		this.addSql( 'alter table "order" drop constraint "order_gateway_id_foreign";' );
		
		this.addSql( 'alter table "payment" drop constraint "payment_gateway_id_foreign";' );
		
		this.addSql( 'alter table "room" drop constraint "room_client_id_foreign";' );
		
		this.addSql( 'alter table "message" drop constraint "message_client_id_foreign";' );
		
		this.addSql( 'alter table "address" drop constraint "address_client_id_foreign";' );
		
		this.addSql( 'alter table "order" drop constraint "order_client_id_foreign";' );
		
		this.addSql( 'alter table "payment" drop constraint "payment_client_id_foreign";' );
		
		this.addSql( 'alter table "uom" drop constraint "uom_item_id_foreign";' );
		
		this.addSql( 'alter table "item_categories" drop constraint "item_categories_item_id_foreign";' );
		
		this.addSql( 'alter table "item_locations" drop constraint "item_locations_item_id_foreign";' );
		
		this.addSql( 'alter table "line_item" drop constraint "line_item_item_id_foreign";' );
		
		this.addSql( 'alter table "menu_uoms" drop constraint "menu_uoms_uom_id_foreign";' );
		
		this.addSql( 'alter table "inventory_entry" drop constraint "inventory_entry_uom_id_foreign";' );
		
		this.addSql( 'alter table "line_item" drop constraint "line_item_uom_id_foreign";' );
		
		this.addSql( 'alter table "menu_uoms" drop constraint "menu_uoms_menu_id_foreign";' );
		
		this.addSql( 'alter table "menu_serving_locations" drop constraint "menu_serving_locations_menu_id_foreign";' );
		
		this.addSql( 'alter table "purchase" drop constraint "purchase_menu_id_foreign";' );
		
		this.addSql( 'alter table "location" drop constraint "location_policy_id_foreign";' );
		
		this.addSql( 'alter table "order" drop constraint "order_policy_id_foreign";' );
		
		this.addSql( 'alter table "line_item_price_group" drop constraint "line_item_price_group_price_group_id_foreign";' );
		
		this.addSql( 'alter table "price" drop constraint "price_price_group_id_foreign";' );
		
		this.addSql( 'alter table "message" drop constraint "message_room_id_foreign";' );
		
		this.addSql( 'alter table "room_users" drop constraint "room_users_room_id_foreign";' );
		
		this.addSql( 'alter table "staff_locations" drop constraint "staff_locations_staff_id_foreign";' );
		
		this.addSql( 'alter table "order" drop constraint "order_staff_id_foreign";' );
		
		this.addSql( 'alter table "purchase" drop constraint "purchase_staff_id_foreign";' );
		
		this.addSql( 'alter table "item_categories" drop constraint "item_categories_category_id_foreign";' );
		
		this.addSql( 'alter table "category_locations" drop constraint "category_locations_category_id_foreign";' );
		
		this.addSql( 'alter table "line_item" drop constraint "line_item_category_id_foreign";' );
		
		this.addSql( 'alter table "location" drop constraint "location_address_id_foreign";' );
		
		this.addSql( 'alter table "order" drop constraint "order_client_address_id_foreign";' );
		
		this.addSql( 'alter table "order" drop constraint "order_shipping_address_id_foreign";' );
		
		this.addSql( 'alter table "purchase" drop constraint "purchase_vendor_address_id_foreign";' );
		
		this.addSql( 'alter table "purchase" drop constraint "purchase_shipping_address_id_foreign";' );
		
		this.addSql( 'alter table "inventory_run" drop constraint "inventory_run_location_id_foreign";' );
		
		this.addSql( 'alter table "store" drop constraint "store_location_id_foreign";' );
		
		this.addSql( 'alter table "category_locations" drop constraint "category_locations_location_id_foreign";' );
		
		this.addSql( 'alter table "item_locations" drop constraint "item_locations_location_id_foreign";' );
		
		this.addSql( 'alter table "menu_serving_locations" drop constraint "menu_serving_locations_location_id_foreign";' );
		
		this.addSql( 'alter table "staff_locations" drop constraint "staff_locations_location_id_foreign";' );
		
		this.addSql( 'alter table "order" drop constraint "order_company_location_id_foreign";' );
		
		this.addSql( 'alter table "purchase" drop constraint "purchase_company_location_id_foreign";' );
		
		this.addSql( 'alter table "inventory_entry" drop constraint "inventory_entry_inventory_run_id_foreign";' );
		
		this.addSql( 'alter table "inventory_run_users" drop constraint "inventory_run_users_inventory_run_id_foreign";' );
		
		this.addSql( 'alter table "line_item" drop constraint "line_item_store_id_foreign";' );
		
		this.addSql( 'alter table "price" drop constraint "price_store_id_foreign";' );
		
		this.addSql( 'alter table "payment" drop constraint "payment_order_id_foreign";' );
		
		this.addSql( 'alter table "line_item" drop constraint "line_item_order_id_foreign";' );
		
		this.addSql( 'alter table "price" drop constraint "price_order_id_foreign";' );
		
		this.addSql( 'alter table "line_item" drop constraint "line_item_purchase_id_foreign";' );
		
		this.addSql( 'alter table "price" drop constraint "price_purchase_id_foreign";' );
		
		this.addSql( 'alter table "line_item_price_group" drop constraint "line_item_price_group_line_item_id_foreign";' );
		
		this.addSql( 'alter table "price" drop constraint "price_line_item_id_foreign";' );
		
		this.addSql( 'drop table if exists "user" cascade;' );
		
		this.addSql( 'drop table if exists "tier" cascade;' );
		
		this.addSql( 'drop table if exists "subscribe" cascade;' );
		
		this.addSql( 'drop table if exists "demo" cascade;' );
		
		this.addSql( 'drop table if exists "company" cascade;' );
		
		this.addSql( 'drop table if exists "gateway" cascade;' );
		
		this.addSql( 'drop table if exists "client" cascade;' );
		
		this.addSql( 'drop table if exists "item" cascade;' );
		
		this.addSql( 'drop table if exists "uom" cascade;' );
		
		this.addSql( 'drop table if exists "log" cascade;' );
		
		this.addSql( 'drop table if exists "menu" cascade;' );
		
		this.addSql( 'drop table if exists "menu_uoms" cascade;' );
		
		this.addSql( 'drop table if exists "policy" cascade;' );
		
		this.addSql( 'drop table if exists "price_group" cascade;' );
		
		this.addSql( 'drop table if exists "room" cascade;' );
		
		this.addSql( 'drop table if exists "message" cascade;' );
		
		this.addSql( 'drop table if exists "room_users" cascade;' );
		
		this.addSql( 'drop table if exists "staff" cascade;' );
		
		this.addSql( 'drop table if exists "category" cascade;' );
		
		this.addSql( 'drop table if exists "item_categories" cascade;' );
		
		this.addSql( 'drop table if exists "address" cascade;' );
		
		this.addSql( 'drop table if exists "location" cascade;' );
		
		this.addSql( 'drop table if exists "inventory_run" cascade;' );
		
		this.addSql( 'drop table if exists "inventory_entry" cascade;' );
		
		this.addSql( 'drop table if exists "inventory_run_users" cascade;' );
		
		this.addSql( 'drop table if exists "store" cascade;' );
		
		this.addSql( 'drop table if exists "category_locations" cascade;' );
		
		this.addSql( 'drop table if exists "item_locations" cascade;' );
		
		this.addSql( 'drop table if exists "menu_serving_locations" cascade;' );
		
		this.addSql( 'drop table if exists "staff_locations" cascade;' );
		
		this.addSql( 'drop table if exists "order" cascade;' );
		
		this.addSql( 'drop table if exists "payment" cascade;' );
		
		this.addSql( 'drop table if exists "purchase" cascade;' );
		
		this.addSql( 'drop table if exists "line_item" cascade;' );
		
		this.addSql( 'drop table if exists "line_item_price_group" cascade;' );
		
		this.addSql( 'drop table if exists "price" cascade;' );
	}
	
}
