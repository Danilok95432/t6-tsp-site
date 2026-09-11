import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'

import { Container } from 'src/shared/ui/Container/Container'
import { Section } from 'src/shared/ui/Section/section'

import styles from './index.module.scss'

type ProjectCategory = 'all' | 'hotels' | 'shopping' | 'sport' | 'schools' | 'punkts' | 'other'

type ProjectTab = {
	id: ProjectCategory
	title: string
}

type ProjectItem = {
	id: string
	title: string
	category: Exclude<ProjectCategory, 'all'>
	image: string
	location: string
	date: string
	description: string
	link: string
}

const projectTabs: ProjectTab[] = [
	{
		id: 'all',
		title: 'Все проекты',
	},
	{
		id: 'hotels',
		title: 'Гостиницы',
	},
	{
		id: 'shopping',
		title: 'Торговые комплексы',
	},
	{
		id: 'sport',
		title: 'Спортивные комплексы',
	},
	{
		id: 'schools',
		title: 'Школы',
	},
	{
		id: 'punkts',
		title: 'Пункты пропуска',
	},
	{
		id: 'other',
		title: 'Другие',
	},
]

const projectsMock: ProjectItem[] = [
	{
		id: '1',
		title: 'Гостиница «Космос»',
		category: 'hotels',
		image: '/images/projects/project-1.jpg',
		location: 'Тамбовская область',
		date: '2026',
		description: 'Установка систем дверных замков, пожарной сигнализации, видеонаблюдения',
		link: '/projects/1',
	},
	{
		id: '2',
		title: 'Торговый центр «Космос»',
		category: 'shopping',
		image: '/images/projects/project-2.jpg',
		location: 'Тамбовская область',
		date: '2026',
		description: 'Установка охранно-пожарной сигнализации',
		link: '/projects/2',
	},
	{
		id: '3',
		title: 'Спортивный комплекс «Космос»',
		category: 'sport',
		image: '/images/projects/project-3.jpg',
		location: 'Тамбовская область',
		date: '2026',
		description: 'Установка охранно-пожарной сигнализации',
		link: '/projects/3',
	},
	{
		id: '4',
		title: 'Школа № 12',
		category: 'schools',
		image: '/images/projects/project-4.jpg',
		location: 'Тамбов',
		date: '2025',
		description: 'Монтаж системы видеонаблюдения и контроля доступа',
		link: '/projects/4',
	},
	{
		id: '5',
		title: 'Гостиничный комплекс «Парк»',
		category: 'hotels',
		image: '/images/projects/project-5.jpg',
		location: 'Воронежская область',
		date: '2025',
		description: 'Комплексная система безопасности и контроля доступа',
		link: '/projects/5',
	},
	{
		id: '6',
		title: 'Торговый комплекс «Центральный»',
		category: 'shopping',
		image: '/images/projects/project-6.jpg',
		location: 'Липецкая область',
		date: '2024',
		description: 'Монтаж видеонаблюдения и охранно-пожарной сигнализации',
		link: '/projects/6',
	},
]

const totalProjects = 25

export const ProjectsSection = () => {
	const [activeTab, setActiveTab] = useState<ProjectCategory>('all')

	const filteredProjects = useMemo(() => {
		if (activeTab === 'all') {
			return projectsMock
		}

		return projectsMock.filter((project) => project.category === activeTab)
	}, [activeTab])

	return (
		<Section id='projects' className={styles.projects}>
			<Container className={styles.cont}>
				<div className={styles.header}>
					<h2 className={styles.title}>Проекты</h2>

					<div className={styles.allProjects}>
						<span className={styles.total}>Всего {totalProjects}</span>

						<Link to='/projects' className={styles.allProjectsLink}>
							<span>Все наши проекты</span>

							<svg width='6' height='10' viewBox='0 0 6 10' fill='none'>
								<path
									d='M1 1L5 5L1 9'
									stroke='currentColor'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>
						</Link>
					</div>
				</div>

				<div className={styles.tabsWrapper}>
					<Swiper
						className={styles.tabsSlider}
						slidesPerView='auto'
						spaceBetween={12}
						grabCursor
						simulateTouch
						allowTouchMove
					>
						{projectTabs.map((tab) => (
							<SwiperSlide key={tab.id} className={styles.tabSlide}>
								<button
									type='button'
									className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
									onClick={() => setActiveTab(tab.id)}
								>
									{tab.title}
								</button>
							</SwiperSlide>
						))}
					</Swiper>
				</div>

				<Swiper
					key={activeTab}
					className={styles.slider}
					slidesPerView={3}
					spaceBetween={24}
					speed={500}
					grabCursor
					simulateTouch
					allowTouchMove
					breakpoints={{
						0: {
							slidesPerView: 1.1,
							spaceBetween: 12,
						},
						600: {
							slidesPerView: 2,
							spaceBetween: 14,
						},
						900: {
							slidesPerView: 3,
							spaceBetween: 24,
						},
					}}
				>
					{filteredProjects.map((project) => (
						<SwiperSlide key={project.id} className={styles.slide}>
							<Link to={project.link} className={styles.card}>
								<div className={styles.imageWrapper}>
									<img
										src={project.image}
										alt={project.title}
										className={styles.image}
										draggable={false}
									/>
								</div>

								<div className={styles.cardTitleRow}>
									<h3 className={styles.cardTitle}>{project.title}</h3>

									<span className={styles.cardArrow}>
										<svg width='6' height='10' viewBox='0 0 6 10' fill='none'>
											<path
												d='M1 1L5 5L1 9'
												stroke='currentColor'
												strokeLinecap='round'
												strokeLinejoin='round'
											/>
										</svg>
									</span>
								</div>

								<p className={styles.meta}>
									{project.location}, {project.date}
								</p>

								<p className={styles.description}>{project.description}</p>
							</Link>
						</SwiperSlide>
					))}
				</Swiper>
			</Container>
		</Section>
	)
}
