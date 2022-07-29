import { Migration } from '@mikro-orm/migrations';

export class Migration20220624155755 extends Migration {
	
	async up(): Promise<void> {
		this.addSql( 'alter table "price_group" add column "gateway_id" uuid null, add column "external_id" varchar(255) null;' );
		this.addSql( 'alter table "price_group" add constraint "price_group_gateway_id_foreign" foreign key ("gateway_id") references "gateway" ("id") on update cascade on delete set null;' );
		this.addSql( 'alter table "price_group" add constraint "price_group_external_id_unique" unique ("external_id");' );
	}
	
	async down(): Promise<void> {
		this.addSql( 'alter table "price_group" drop constraint "price_group_gateway_id_foreign";' );
		
		this.addSql( 'alter table "price_group" drop constraint "price_group_external_id_unique";' );
		this.addSql( 'alter table "price_group" drop column "gateway_id";' );
		this.addSql( 'alter table "price_group" drop column "external_id";' );
	}
	
}
