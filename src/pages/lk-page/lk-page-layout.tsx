import { Outlet } from 'react-router-dom'
import { Container } from 'src/shared/ui/Container/Container'
import { Section } from 'src/shared/ui/Section/section'
import { BreadCrumbs } from 'src/widgets/breadcrumbs/bread-crumbs'

import styles from './index.module.scss'

export const LkPageLayout = () => {
	return (
		<Section className={styles.lkSection}>
			<Container className={styles.lkCont}>
				<BreadCrumbs
					crumbsLinksMap={[
						{ title: 'Личный кабинет', link: 'lk' },
						{ title: 'Мои заказы', link: 'lk/orders' },
					]}
				/>
				<Outlet />
			</Container>
		</Section>
	)
}
