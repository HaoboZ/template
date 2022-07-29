import { EntityManager } from '@mikro-orm/postgresql';
import { Arg, Ctx, Query, Resolver } from 'type-graphql';
import type { Context } from '../../context';
import Order from '../order/order.entity';
import Purchase from '../purchase/purchase.entity';
import ChartBase from './chart.base';

@Resolver()
export default class ChartResolver {
	
	@Query( () => [ ChartBase ] )
	async charts(
		@Arg( 'dates', () => [ Date ] ) dates: Date[],
		@Ctx() ctx: Context & { em: EntityManager }
	) {
		const sortedDates = dates.sort( ( a, b ) => a.getTime() - b.getTime() );
		const { em } = ctx;
		let prevDate: Date = null;
		const result: ChartBase[] = [];
		for ( const date of sortedDates ) {
			if ( prevDate ) {
				// do calculations
				
				const ordersQB = em.createQueryBuilder( Order );
				const paidOrders = await ordersQB.select( '*' )
					.where( { updatedAt: { $gte: prevDate } } )
					.andWhere( { updatedAt: { $lte: date } } )
					.andWhere( { company: { $eq: ctx.req.headers.company } } )
					.andWhere( 'deleted_at', null )
					.andWhere( { type: 'ORDER' } )
					.andWhere( { paid: true } ).execute();
				
				const invoiceQB = em.createQueryBuilder( Order );
				const paidInvoices = await invoiceQB.select( '*' )
					.where( { updatedAt: { $gte: prevDate } } )
					.andWhere( { updatedAt: { $lte: date } } )
					.andWhere( { company: { $eq: ctx.req.headers.company } } )
					.andWhere( 'deleted_at', null )
					.andWhere( { type: 'INVOICE' } )
					.andWhere( { paid: true } ).execute();
				
				const purchasesQB = em.createQueryBuilder( Purchase );
				const purchases = await purchasesQB.select( '*' )
					.where( { updatedAt: { $gte: prevDate } } )
					.andWhere( { updatedAt: { $lte: date } } )
					.andWhere( { company: { $eq: ctx.req.headers.company } } )
					.andWhere( 'deleted_at', null )
					.execute();
				
				result.push( new ChartBase( {
					paidOrders  : paidOrders || [],
					paidInvoices: paidInvoices || [],
					purchases   : purchases || []
				} ) );
				
			}
			prevDate = date;
		}
		
		return result;
	}
	
}
