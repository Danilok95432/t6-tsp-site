import { Container } from 'src/shared/ui/Container/Container'
import { Section } from 'src/shared/ui/Section/section'

import styles from './index.module.scss'

export const NotFoundPage = () => {
	return (
		<Section className={styles.notFoundSection}>
			<Container className={styles.notFoundCont}>
				<h1 className={styles.title}>Страница не найдена</h1>
			</Container>
		</Section>
	)
}
