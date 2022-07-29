import { Migration } from '@mikro-orm/migrations';

export class Migration20220519164425 extends Migration {
	
	async up(): Promise<void> {
		this.addSql( 'alter table "gateway" add column "status" varchar(255) null;' );
		
		this.addSql( 'alter table "log" add column "ip" varchar(255) null;' );
		this.addSql( 'alter table "log" drop column "lat";' );
		this.addSql( 'alter table "log" drop column "lng";' );
		this.addSql( 'alter table "log" drop column "acc";' );
		this.addSql( 'alter table "log" drop column "type";' );
	}
	
	async down(): Promise<void> {
		this.addSql( 'alter table "gateway" drop column "status";' );
		
		this.addSql( 'alter table "log" add column "lat" int null, add column "lng" int null, add column "acc" int null, add column "type" varchar(255) not null;' );
		this.addSql( 'alter table "log" drop column "ip";' );
	}
	
}
