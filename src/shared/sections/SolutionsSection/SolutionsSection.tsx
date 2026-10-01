import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Container } from 'src/shared/ui/Container/Container'
import { Section } from 'src/shared/ui/Section/section'

import styles from './index.module.scss'

type SolutionCategory = 'all' | 'business' | 'smallBusiness'

type SolutionTab = {
	id: SolutionCategory
	title: string
}

type SolutionItem = {
	id: string
	title: string
	link: string
	category: Exclude<SolutionCategory, 'all'>
	images: string[]
	totalImages: number
}

const tabs: SolutionTab[] = [
	{
		id: 'all',
		title: 'Все решения',
	},
	{
		id: 'business',
		title: 'Для бизнеса',
	},
	{
		id: 'smallBusiness',
		title: 'Для малого бизнеса и частных клиентов',
	},
]

const solutions: SolutionItem[] = [
	{
		id: '1',
		title: 'Большой торговый центр',
		link: '/solutions/1',
		category: 'business',
		images: [
			'/images/solution-1.svg',
			'/images/solution-2.svg',
			'/images/solution-3.svg',
			'/images/solution-4.svg',
			'/images/solution-5.svg',
			'/images/solution-1.svg',
			'/images/solution-4.svg',
			'/images/solution-5.svg',
			'/images/solution-1.svg',
		],
		totalImages: 9,
	},
	{
		id: '2',
		title: 'Спортивный комплекс мечты',
		link: '/solutions/2',
		category: 'business',
		images: [
			'/images/solution-1.svg',
			'/images/solution-2.svg',
			'/images/solution-3.svg',
			'/images/solution-4.svg',
			'/images/solution-3.svg',
			'/images/solution-4.svg',
			'/images/solution-4.svg',
		],
		totalImages: 7,
	},
	{
		id: '3',
		title: 'Офисное здание класса «А»',
		link: '/solutions/3',
		category: 'business',
		images: [
			'/images/solution-1.svg',
			'/images/solution-2.svg',
			'/images/solution-3.svg',
			'/images/solution-4.svg',
			'/images/solution-5.svg',
			'/images/solution-1.svg',
			'/images/solution-4.svg',
			'/images/solution-5.svg',
			'/images/solution-1.svg',
		],
		totalImages: 9,
	},
	{
		id: '4',
		title: 'Семейный аквапарк и СПА',
		link: '/solutions/4',
		category: 'smallBusiness',
		images: [
			'/images/solution-1.svg',
			'/images/solution-2.svg',
			'/images/solution-3.svg',
			'/images/solution-4.svg',
		],
		totalImages: 4,
	},
]

export const SolutionsSection = () => {
	const [activeTab, setActiveTab] = useState<SolutionCategory>('all')

	const navigate = useNavigate()

	const filteredSolutions = useMemo(() => {
		if (activeTab === 'all') {
			return solutions
		}

		return solutions.filter((solution) => solution.category === activeTab)
	}, [activeTab])

	return (
		<Section id='solutions' className={styles.solutions}>
			<Container className={styles.cont}>
				<h2 className={styles.title}>Решения</h2>

				<div className={styles.tabs}>
					{tabs.map((tab) => (
						<button
							key={tab.id}
							type='button'
							className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
							onClick={() => setActiveTab(tab.id)}
						>
							{tab.title}
						</button>
					))}
				</div>

				<div className={styles.cards}>
					{filteredSolutions.map((solution) => {
						const visibleImages = solution.images.slice(0, 4)

						const hiddenImagesCount = Math.max(solution.totalImages - visibleImages.length, 0)

						return (
							<div key={solution.id} className={styles.cardSlot}>
								<a href={solution.link} className={styles.card}>
									<div className={styles.imagesArea}>
										<div className={styles.collapsedImages}>
											{visibleImages.map((image, index) => (
												<div
													key={`${solution.id}-collapsed-${index}`}
													className={styles.imageWrapper}
												>
													<img src={image} alt='' className={styles.image} />
												</div>
											))}

											{hiddenImagesCount > 0 && (
												<div className={`${styles.imageWrapper} ${styles.moreImages}`}>
													+{hiddenImagesCount}
												</div>
											)}
										</div>

										<div className={styles.expandedImages}>
											{solution.images.map((image, index) => (
												<div
													key={`${solution.id}-expanded-${index}`}
													className={styles.expandedImageWrapper}
													style={{
														transitionDelay: `${index * 35}ms`,
													}}
												>
													<img src={image} alt='' className={styles.image} />
												</div>
											))}
										</div>
									</div>

									<p className={styles.cardTitle}>{solution.title}</p>
								</a>
							</div>
						)
					})}
				</div>

				<button
					type='button'
					className={styles.allSolutionsBtn}
					onClick={() => navigate('/solutions')}
				>
					Все решения
				</button>
			</Container>
		</Section>
	)
}
