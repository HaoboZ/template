import { EntityManager } from '@mikro-orm/postgresql';
import { Arg, Ctx, Query, Resolver } from 'type-graphql';
import type { Context } from '../../context';
import DashboardBase from './dashboard.base';

@Resolver()
export default class DashboardResolver {
	
	@Query( () => [ DashboardBase ] )
	async dashboards(
		@Arg( 'dates', () => [ Date ] ) dates: Date[],
		@Ctx() ctx: Context & { em: EntityManager }
	) {
		const sortedDates = dates.sort( ( a, b ) => a.getTime() - b.getTime() );
		const { em } = ctx;
		let prevDate: Date = null;
		const result: DashboardBase[] = [];
		for ( const date of sortedDates ) {
			if ( prevDate ) {
				const knex = em.getKnex();
				
				// unpaid sales of orders and invoices
				const unpaidSales = await knex
					.select( knex.raw( 'SUM(grand_total) - SUM(paid_total) as unpaidSales' ) )
					.from( 'order' )
					.where( 'updated_at', '>=', prevDate.toISOString() )
					.andWhere( 'updated_at', '<', date.toISOString() )
					.andWhere( 'company_id', ctx.req.headers.company )
					.andWhere( 'deleted_at', null )
					.whereIn( 'type', [ 'ORDER', 'INVOICE' ] );
				
				// paid sales of orders only
				const paidSales = await knex
					.sum( 'paid_total as paidSales' )
					.count( 'id as ordersCount' )
					.from( 'order' )
					.where( 'updated_at', '>=', prevDate.toISOString() )
					.andWhere( 'updated_at', '<', date.toISOString() )
					.andWhere( 'company_id', ctx.req.headers.company )
					.andWhere( 'deleted_at', null )
					.andWhere( 'type', 'ORDER' );
				
				// unpaid sales of estimates only
				const pendingEstimates = await knex
					.select( knex.raw( 'SUM(grand_total) - SUM(paid_total) as pendingEstimates' ) )
					.from( 'order' )
					.where( 'updated_at', '>=', prevDate.toISOString() )
					.andWhere( 'updated_at', '<', date.toISOString() )
					.andWhere( 'company_id', ctx.req.headers.company )
					.andWhere( 'deleted_at', null )
					.andWhere( 'type', 'ESTIMATE' );
				
				result.push( new DashboardBase( {
					unpaidSales          : +Object.values( unpaidSales[ 0 ] )[ 0 ] || 0,
					paidSales            : +Object.values( paidSales[ 0 ] )[ 0 ] || 0,
					pendingEstimatesTotal: +Object.values( pendingEstimates[ 0 ] )[ 0 ] || 0,
					ordersCount          : +Object.values( paidSales[ 0 ] )[ 1 ] || 0
				} ) );
			}
			prevDate = date;
		}
		return result;
	}
	
}
