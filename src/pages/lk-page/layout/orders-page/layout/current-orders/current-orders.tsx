import { Section } from 'src/shared/ui/Section/section'
import styles from './index.module.scss'
import { Container } from 'src/shared/ui/Container/Container'
import { FlexRow } from 'src/shared/ui/FlexRow/FlexRow'
import { OneOrder } from '../one-order/one-order'
import { useGetUserOrdersListQuery } from 'src/features/catalog/api/catalog.api'
import { userID } from 'src/shared/helpers/consts'

export const CurrentOrders = () => {
	const { data: ordersData } = useGetUserOrdersListQuery({ idUser: userID ?? '' })

	const orders = Array.isArray(ordersData) ? ordersData : ordersData?.orders ?? []

	const currentOrders = orders.filter(
		(order) =>
			order.status_keyword === 'created' ||
			order.status_keyword === 'payed' ||
			order.status_keyword === 'delivery' ||
			order.status_keyword === 'waiting',
	)

	return (
		<Section className={styles.currentOrders}>
			<Container>
				<FlexRow className={styles.ordersList}>
					{currentOrders.length === 0 ? (
						<p className={styles.noOrders}>У вас нет текущих заказов</p>
					) : (
						currentOrders.map((order) => {
							return <OneOrder key={order.id} order={order} />
						})
					)}
				</FlexRow>
			</Container>
		</Section>
	)
}
