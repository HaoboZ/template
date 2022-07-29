import { EntityManager } from '@mikro-orm/postgresql';
import { Arg, Ctx, Query, Resolver } from 'type-graphql';
import type { Context } from '../../context';
import { DatePart } from '../../enums/datePart.enum';
import Report from './report.base';

@Resolver()
export default class ReportResolver {
	
	@Query( () => [ Report ] )
	async reports(
		@Arg( 'dates', () => [ Date ] ) dates: Date[],
		@Arg( 'granularity', () => DatePart ) granularity: DatePart,
		@Ctx() ctx: Context & { em: EntityManager }
	) {
		const { em } = ctx;
		
		const result: Report[] = [];
		for ( const date of dates ) {
			const knex = em.getKnex();
			
			const orders = await knex
				.sum( 'grand_total as grandTotal' )
				.sum( 'paid_total as paidTotal' )
				.sum( 'tax_total as taxTotal' )
				.sum( 'sub_total as subTotal' )
				.from( 'order' )
				.where( 'type', 'ORDER' )
				.andWhere( 'company_id', ctx.req.headers.company )
				.andWhere( 'deleted_at', null )
				.andWhere( knex.raw( `date_trunc( '${granularity}', updated_at ) = date_trunc('${granularity}', timestamp '${date.toISOString()}');` ) );
			
			const invoices = await knex
				.sum( 'grand_total as grandTotal' )
				.sum( 'paid_total as paidTotal' )
				.sum( 'tax_total as taxTotal' )
				.sum( 'sub_total as subTotal' )
				.from( 'order' )
				.where( 'type', 'INVOICE' )
				.andWhere( 'company_id', ctx.req.headers.company )
				.andWhere( 'deleted_at', null )
				.andWhere( knex.raw( `date_trunc( '${granularity}', updated_at ) = date_trunc('${granularity}', timestamp '${date.toISOString()}');` ) );
			
			const payments = await knex
				.sum( 'refunded_amount as refunds' )
				.from( 'payment' )
				.andWhere( 'company_id', ctx.req.headers.company )
				.andWhere( knex.raw( `date_trunc( '${granularity}',  created_at ) = date_trunc('${granularity}', timestamp '${date.toISOString()}');` ) );
			
			const grossSales = ( +orders[ 0 ].grandTotal || 0 ) + ( +invoices[ 0 ].grandTotal || 0 );
			const amountCollected = ( +orders[ 0 ].paidTotal || 0 ) + ( +invoices[ 0 ].paidTotal || 0 );
			const taxTotal = ( +orders[ 0 ].taxTotal || 0 ) + ( +invoices[ 0 ].taxTotal || 0 );
			const subTotal = ( +orders[ 0 ].subTotal || 0 ) + ( +invoices[ 0 ].subTotal || 0 );
			const refunds = +payments[ 0 ].refunds || 0;
			
			const unpaidBalance = grossSales - amountCollected;
			const netSales = grossSales - taxTotal;
			const taxesAndFees = grossSales - subTotal;
			
			result.push( new Report( {
				date,
				grossSales,
				refunds,
				netSales,
				taxesAndFees,
				amountCollected,
				unpaidBalance
			} ) );
		}
		
		return result;
	}
	
}
