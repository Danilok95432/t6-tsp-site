import { ContactsMapSection } from 'src/shared/sections/ContactsMapSection/ContactsMapSection'
import { DocumentsSection } from 'src/shared/sections/DocumentsSection/DocumentsSection'
import { MainSliderSection } from 'src/shared/sections/MainSliderSection/main-slider-section'
import { ProfessionalsSection } from 'src/shared/sections/ProfessionalsSection/ProfessionalsSection'
import { ProjectsSection } from 'src/shared/sections/ProjectsSection/ProjectsSection'
import { RequestSection } from 'src/shared/sections/RequestSection/RequestSection'
import { SolutionsSection } from 'src/shared/sections/SolutionsSection/SolutionsSection'

export const HomePage = () => {
	return (
		<>
			<MainSliderSection />
			<SolutionsSection />
			<ProjectsSection />
			<ProfessionalsSection />
			<DocumentsSection />
			<RequestSection />
			<ContactsMapSection />
		</>
	)
}
