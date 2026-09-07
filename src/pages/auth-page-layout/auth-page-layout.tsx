import { Outlet } from 'react-router-dom'
import { Container } from 'src/shared/ui/Container/Container'
import { Section } from 'src/shared/ui/Section/section'

import styles from './index.module.scss'
import { BreadCrumbs } from 'src/widgets/breadcrumbs/bread-crumbs'

export const AuthPageLayout = () => {
	return (
		<Section className={styles.authSection}>
			<Container className={styles.authCont}>
				<BreadCrumbs crumbsLinksMap={[{ title: 'Авторизация', link: 'auth' }]} />
				<Outlet />
			</Container>
		</Section>
	)
}
