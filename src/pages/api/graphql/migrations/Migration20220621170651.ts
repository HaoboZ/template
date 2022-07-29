import { Migration } from '@mikro-orm/migrations';

export class Migration20220621170651 extends Migration {
	
	async up(): Promise<void> {
		this.addSql( 'alter table "store" add column "rewards" jsonb not null default \'{}\';' );
		this.addSql( 'alter table "store" alter column "tax_percent" drop default;' );
		this.addSql( 'alter table "store" alter column "tax_percent" type double precision using ("tax_percent"::double precision);' );
	}
	
	async down(): Promise<void> {
		this.addSql( 'alter table "store" alter column "tax_percent" type double precision using ("tax_percent"::double precision);' );
		this.addSql( 'alter table "store" alter column "tax_percent" set default 0;' );
		this.addSql( 'alter table "store" drop column "rewards";' );
	}
	
}
