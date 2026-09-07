import { ReviewSection } from 'src/shared/sections/ReviewsSection/reviews-section'

import styles from './index.module.scss'
import { Container } from 'src/shared/ui/Container/Container'
import { FlexRow } from 'src/shared/ui/FlexRow/FlexRow'
import { Section } from 'src/shared/ui/Section/section'
import { Outlet, useLocation, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useGetCatalogQuery } from 'src/features/catalog/api/catalog.api'

export const ChocolatePage = () => {
	const { menuId = '' } = useParams()
	const location = useLocation()
	const insideLocation = location.pathname.includes('item')
	const { data } = useGetCatalogQuery({ id: menuId, limit: '0', step: '1' })
	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth',
		})
	}, [location.pathname])
	return (
		<Section className={styles.chocolatePage}>
			{!insideLocation && (
				<Container className={styles.cont}>
					<FlexRow className={styles.headRow}>
						<h2 className={styles.title}>{data?.title}</h2>
					</FlexRow>
				</Container>
			)}
			<Outlet />
			<ReviewSection />
		</Section>
	)
}
