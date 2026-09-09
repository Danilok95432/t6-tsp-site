import { SolutionContentSection } from './components/content/content'
import { SolutionHeroSection } from './components/hero/hero'
import { SolutionRequestSection } from './components/request/request'

export const SolutionPage = () => {
	return (
		<main>
			<SolutionHeroSection />

			<SolutionContentSection />

			<SolutionRequestSection />
		</main>
	)
}
