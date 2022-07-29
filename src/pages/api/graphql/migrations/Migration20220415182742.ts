import { Migration } from '@mikro-orm/migrations';

export class Migration20220415182742 extends Migration {
	
	async up(): Promise<void> {
		this.addSql( 'alter table "store" add column "tax_percent" double precision not null default 0, add column "metadata" jsonb not null default \'{}\';' );
	}
	
	async down(): Promise<void> {
		this.addSql( 'alter table "store" drop column "tax_percent";' );
		this.addSql( 'alter table "store" drop column "metadata";' );
	}
	
}
