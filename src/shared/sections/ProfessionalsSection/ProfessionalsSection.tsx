import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'

import { Container } from 'src/shared/ui/Container/Container'
import { Section } from 'src/shared/ui/Section/section'

import styles from './index.module.scss'

type ProfessionalItem = {
	id: string
	title: string
	specialistsCount: number
	link: string
}

const professionalsMock: ProfessionalItem[] = [
	{
		id: '1',
		title: 'Проектировщики слаботочных систем',
		specialistsCount: 8,
		link: '/professionals/1',
	},
	{
		id: '2',
		title: 'Сметчики',
		specialistsCount: 24,
		link: '/professionals/2',
	},
	{
		id: '3',
		title: 'Слесари-наладчики',
		specialistsCount: 12,
		link: '/professionals/3',
	},
	{
		id: '4',
		title: 'Монтажники слаботочных систем',
		specialistsCount: 8,
		link: '/professionals/4',
	},
	{
		id: '5',
		title: 'Инженеры систем безопасности',
		specialistsCount: 16,
		link: '/professionals/5',
	},
	{
		id: '6',
		title: 'Специалисты технической поддержки',
		specialistsCount: 10,
		link: '/professionals/6',
	},
]

const totalProfessionals = 265

export const ProfessionalsSection = () => {
	return (
		<Section id='professionals' className={styles.professionals}>
			<Container bigCont>
				<div className={styles.wrapper}>
					<div className={styles.header}>
						<h2 className={styles.title}>Профессионалы</h2>

						<div className={styles.allProfessionals}>
							<span className={styles.total}>Всего {totalProfessionals}</span>

							<Link to='/professionals' className={styles.allProfessionalsLink}>
								<span>Все профессионалы</span>

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

					<Swiper
						className={styles.slider}
						slidesPerView={4}
						spaceBetween={13}
						speed={500}
						grabCursor
						simulateTouch
						allowTouchMove
						breakpoints={{
							0: {
								slidesPerView: 1.15,
								spaceBetween: 10,
							},
							500: {
								slidesPerView: 2.1,
								spaceBetween: 12,
							},
							768: {
								slidesPerView: 3,
								spaceBetween: 12,
							},
							1000: {
								slidesPerView: 4,
								spaceBetween: 13,
							},
						}}
					>
						{professionalsMock.map((professional) => (
							<SwiperSlide key={professional.id} className={styles.slide}>
								<Link to={professional.link} className={styles.card}>
									<h3 className={styles.cardTitle}>{professional.title}</h3>

									<div className={styles.cardBottom}>
										<span className={styles.count}>
											{professional.specialistsCount}{' '}
											{getSpecialistsWord(professional.specialistsCount)}
										</span>

										<svg width='6' height='10' viewBox='0 0 6 10' fill='none'>
											<path
												d='M1 1L5 5L1 9'
												stroke='currentColor'
												strokeLinecap='round'
												strokeLinejoin='round'
											/>
										</svg>
									</div>
								</Link>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</Container>
		</Section>
	)
}

const getSpecialistsWord = (count: number) => {
	const lastTwoDigits = count % 100
	const lastDigit = count % 10

	if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
		return 'специалистов'
	}

	if (lastDigit === 1) {
		return 'специалист'
	}

	if (lastDigit >= 2 && lastDigit <= 4) {
		return 'специалиста'
	}

	return 'специалистов'
}
