/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Container } from 'src/shared/ui/Container/Container'
import { FlexRow } from 'src/shared/ui/FlexRow/FlexRow'
import { Section } from 'src/shared/ui/Section/section'
import styles from './index.module.scss'
import { formatDate, getItemsWord } from 'src/shared/helpers/utils'
import { MainButton } from 'src/shared/ui/MainButton/MainButton'
import { useNavigate } from 'react-router-dom'
import { AppRoute } from 'src/app/router/consts'
import { userID } from 'src/shared/helpers/consts'
import { useGetUserOrdersListQuery } from 'src/features/catalog/api/catalog.api'

export const CompletedOrders = () => {
	const navigate = useNavigate()

	const { data: ordersData } = useGetUserOrdersListQuery({
		idUser: userID ?? '',
		type: 'completed',
	})

	const orders = Array.isArray(ordersData) ? ordersData : ordersData?.orders ?? []

	const completedOrders = orders.filter((order) => order.status_keyword === 'completed')

	return (
		<Section className={styles.completedOrders}>
			<Container>
				<FlexRow className={styles.ordersList}>
					{completedOrders.length === 0 ? (
						<p className={styles.noOrders}>У вас нет завершенных заказов</p>
					) : (
						completedOrders.map((order) => {
							return (
								<FlexRow className={styles.order} key={order.id}>
									<FlexRow className={styles.orderInfo}>
										<FlexRow className={styles.orderRow}>
											<FlexRow className={styles.orderNumberRow}>
												<p className={styles.orderNumber}>
													Заказ {`№ ${order.id}`}{' '}
													<span>{`от ${formatDate(order.order_date ?? '')}`}</span>
												</p>

												<p>
													{`${order.order_items.length} ${getItemsWord(
														order.order_items.length,
													)} на сумму ${order.price_total} ₽`}
												</p>
											</FlexRow>

											<p className={styles.orderNumber}>
												{`Завершен`} <span>{`${formatDate(order.finish_date ?? '')}`}</span>
											</p>
										</FlexRow>
									</FlexRow>

									<MainButton
										type='button'
										className={styles.moreBtn}
										onClick={() => navigate(`${AppRoute.LK}/${AppRoute.LKorders}/${order.id}`)}
									>
										Подробнее о заказе
									</MainButton>
								</FlexRow>
							)
						})
					)}
				</FlexRow>
			</Container>
		</Section>
	)
}
