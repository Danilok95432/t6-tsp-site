import { RequestSection } from 'src/shared/sections/RequestSection/RequestSection'
import { SolutionsCatalogSection } from './components/SolutionsCatalogSection/SolutionsCatalogSection'
import { SolutionsHeroSection } from './components/SolutionsHeroSection/SolutionsHeroSection'
import { Container } from 'src/shared/ui/Container/Container'

import styles from './index.module.scss'

export const AllSolutionsPage = () => {
	return (
		<main className={styles.main}>
			<SolutionsHeroSection />

			<SolutionsCatalogSection />
			<Container>
				<RequestSection />
			</Container>
		</main>
	)
}
