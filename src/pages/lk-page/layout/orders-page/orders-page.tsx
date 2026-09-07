import { Container } from 'src/shared/ui/Container/Container'
import { Section } from 'src/shared/ui/Section/section'

import styles from './index.module.scss'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { FlexRow } from 'src/shared/ui/FlexRow/FlexRow'
import { ordersNavigation } from './consts'
import cn from 'classnames'

const pathsWithHeader = ['/lk/orders', '/lk/orders/completed', '/lk/orders/canceled']

export const OrdersPage = () => {
	const location = useLocation()

	const normalizedPathname = location.pathname.replace(/\/$/, '')

	const shouldShowHeaderAndNav = pathsWithHeader.includes(normalizedPathname)

	return (
		<Section className={styles.section}>
			{shouldShowHeaderAndNav && (
				<>
					<Container className={styles.cont}>
						<h1 className={styles.title}>Мои заказы</h1>
					</Container>

					<FlexRow className={styles.nav}>
						{ordersNavigation.map((item) => (
							<Link
								key={item.id}
								to={item.link}
								className={cn(styles.link, {
									[styles.active]: normalizedPathname === item.link,
								})}
							>
								{item.title}
							</Link>
						))}
					</FlexRow>
				</>
			)}

			<Outlet />
		</Section>
	)
}
