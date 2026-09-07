/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Container } from 'src/shared/ui/Container/Container'
import { Section } from 'src/shared/ui/Section/section'
import styles from './index.module.scss'
import { Link, useParams } from 'react-router-dom'
import { OneOrder } from '../one-order/one-order'
import { useAdditionalCrumbs } from 'src/app/store/hooks/additionalCrumbs'
import { formatDate } from 'src/shared/helpers/utils'
import { useGetUserOrdersListItemInfoQuery } from 'src/features/catalog/api/catalog.api'

export const OneOrderPage = () => {
	const { id = '' } = useParams()
	const { data } = useGetUserOrdersListItemInfoQuery(id)
	useAdditionalCrumbs(`Заказ № ${data?.order?.id} от ${formatDate(data?.order?.order_date ?? '')}`)
	return (
		<Section className={styles.section}>
			<Container className={styles.cont}>
				<h1
					className={styles.title}
				>{`Заказ № ${data?.order?.id} от ${formatDate(data?.order?.order_date ?? '')}`}</h1>
				<Link
					to={
						data?.order?.status_keyword === 'completed'
							? `/lk/orders/completed`
							: data?.order?.status_keyword === 'canceled'
								? `/lk/orders/canceled`
								: `/lk/orders`
					}
					className={styles.link}
				>
					Назад к списку{' '}
					{data?.order?.status_keyword === 'completed'
						? 'завершенных'
						: data?.order?.status_keyword === 'canceled'
							? 'отмененных'
							: 'активных'}{' '}
					заказов
				</Link>
			</Container>
			<OneOrder order={data?.order} />
		</Section>
	)
}
