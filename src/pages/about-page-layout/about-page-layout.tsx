import { Container } from 'src/shared/ui/Container/Container'
import { Section } from 'src/shared/ui/Section/section'
import { BreadCrumbs } from 'src/widgets/breadcrumbs/bread-crumbs'
import { LinksNavigation } from './consts'
import { Outlet } from 'react-router-dom'

import styles from './index.module.scss'

export const AboutPageLayout = () => {
	return (
		<Section className={styles.aboutSection}>
			<Container className={styles.aboutCont}>
				<h1 className={styles.title}>Информация</h1>
				<BreadCrumbs crumbsLinksMap={LinksNavigation} isHeadNav />
				<Outlet />
			</Container>
		</Section>
	)
}
