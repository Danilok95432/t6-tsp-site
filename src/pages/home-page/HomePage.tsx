import { useGetSiteSettingsQuery } from 'src/features/settings/api/settings.api'
import { AwardsSection } from 'src/shared/sections/AwardsSection/awards-section'
import { CandySliderSection } from 'src/shared/sections/CandySliderSection/candy-slider-section'
import { CatalogSection } from 'src/shared/sections/CatalogSection/catalog-section'
import { ClassSection } from 'src/shared/sections/ClassSection/class-section'
import { MainImgSection } from 'src/shared/sections/MainImgSection/main-img-section'
import { MainSliderSection } from 'src/shared/sections/MainSliderSection/main-slider-section'
import { ReviewSection } from 'src/shared/sections/ReviewsSection/reviews-section'

export const HomePage = () => {
	const { data } = useGetSiteSettingsQuery(null)
	return (
		<>
			{data?.use_promo && data?.use_promo === '1' && <MainImgSection />}
			{data?.use_awards && data?.use_awards === '1' && <AwardsSection />}
			{data?.use_mainslider && data?.use_mainslider === '1' && <MainSliderSection />}
			{data?.use_best && data?.use_best === '1' && <CandySliderSection />}
			{data?.use_adv && data?.use_adv === '1' && <ClassSection />}
			{data?.use_catalog && data?.use_catalog === '1' && <CatalogSection />}
			{data?.use_reviews && data?.use_reviews === '1' && <ReviewSection />}
		</>
	)
}
