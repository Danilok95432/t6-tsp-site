import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, type SwiperRef, SwiperSlide } from 'swiper/react'

import 'swiper/css'

import { Container } from 'src/shared/ui/Container/Container'
import { Section } from 'src/shared/ui/Section/section'

import { solutionMock } from '../../consts'

import styles from './index.module.scss'
import { sidebarNavigationItems } from './consts'

const formatPrice = (price: number) => {
	return new Intl.NumberFormat('ru-RU', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(price)
}

export const SolutionContentSection = () => {
	const swiperRef: RefObject<SwiperRef> = useRef<SwiperRef>(null)

	const [activeSection, setActiveSection] = useState(sidebarNavigationItems[0].id)

	const programmaticScrollRef = useRef(false)
	const scrollTimeoutRef = useRef<number | null>(null)

	const kitTotal = solutionMock.kit.reduce((sum, item) => sum + item.total, 0)

	const getHeaderHeight = () => {
		const header = document.querySelector('header')

		return header?.getBoundingClientRect().height ?? 0
	}

	const scrollToSection = useCallback((sectionId: string) => {
		const element = document.getElementById(sectionId)

		if (!element) return

		const headerHeight = getHeaderHeight()

		const top = element.getBoundingClientRect().top + window.scrollY - headerHeight - 25

		/*
		 * Сразу отмечаем нажатый пункт,
		 * чтобы активное состояние не ждало окончания скролла.
		 */
		setActiveSection(sectionId)

		programmaticScrollRef.current = true

		if (scrollTimeoutRef.current) {
			window.clearTimeout(scrollTimeoutRef.current)
		}

		window.history.replaceState(null, '', `${window.location.pathname}#${sectionId}`)

		window.scrollTo({
			top,
			behavior: 'smooth',
		})

		/*
		 * Во время программного скролла не даём обработчику
		 * последовательно подсвечивать все промежуточные секции.
		 */
		scrollTimeoutRef.current = window.setTimeout(() => {
			programmaticScrollRef.current = false
		}, 800)
	}, [])

	useEffect(() => {
		const handleScroll = () => {
			if (programmaticScrollRef.current) return

			const headerHeight = getHeaderHeight()

			/*
			 * Условная линия, по достижении которой
			 * секция считается текущей.
			 */
			const activationPoint = headerHeight + 100

			let currentSection = sidebarNavigationItems[0].id

			sidebarNavigationItems.forEach((item) => {
				const element = document.getElementById(item.id)

				if (!element) return

				const rect = element.getBoundingClientRect()

				if (rect.top <= activationPoint) {
					currentSection = item.id
				}
			})

			setActiveSection((current) => (current === currentSection ? current : currentSection))
		}

		handleScroll()

		window.addEventListener('scroll', handleScroll, {
			passive: true,
		})

		window.addEventListener('resize', handleScroll)

		return () => {
			window.removeEventListener('scroll', handleScroll)
			window.removeEventListener('resize', handleScroll)

			if (scrollTimeoutRef.current) {
				window.clearTimeout(scrollTimeoutRef.current)
			}
		}
	}, [])

	const scrollToRequest = () => {
		scrollToSection('request')
	}

	return (
		<Section className={styles.section}>
			<Container>
				<div className={styles.layout}>
					<div className={styles.content}>
						<Link to={solutionMock.categoryLink} className={styles.backLink}>
							<span>‹</span>
							{solutionMock.categoryTitle}
						</Link>

						<section id='solution-description' className={styles.contentBlock}>
							<p className={styles.lead}>{solutionMock.description}</p>

							<p className={styles.description}>{solutionMock.fullDescription}</p>
						</section>

						<section id='solution-gallery' className={styles.contentBlock}>
							<h2 className={styles.blockTitle}>Галерея</h2>

							<div className={styles.gallery}>
								<button
									type='button'
									className={`${styles.galleryArrow} ${styles.prev}`}
									onClick={() => swiperRef.current?.swiper.slidePrev()}
									aria-label='Предыдущий слайд'
								>
									‹
								</button>

								<Swiper
									ref={swiperRef}
									className={styles.gallerySlider}
									slidesPerView={3}
									spaceBetween={15}
									speed={500}
									grabCursor
									breakpoints={{
										0: {
											slidesPerView: 1.15,
										},
										550: {
											slidesPerView: 2,
										},
										850: {
											slidesPerView: 3,
										},
									}}
								>
									{solutionMock.gallery.map((item) => (
										<SwiperSlide key={item.id}>
											<div className={styles.galleryImageWrapper}>
												<img
													src={item.image}
													alt={item.alt}
													className={styles.galleryImage}
													draggable={false}
												/>
											</div>
										</SwiperSlide>
									))}
								</Swiper>

								<button
									type='button'
									className={`${styles.galleryArrow} ${styles.next}`}
									onClick={() => swiperRef.current?.swiper.slideNext()}
									aria-label='Следующий слайд'
								>
									›
								</button>
							</div>
						</section>

						<section id='solution-kit' className={styles.contentBlock}>
							<h2 className={styles.blockTitle}>Комплект решения</h2>

							<div className={styles.table}>
								{solutionMock.kit.map((item) => (
									<div className={styles.tableRow} key={item.id}>
										<div className={styles.productName}>{item.title}</div>

										<div className={styles.count}>{item.count}</div>

										<div className={styles.price}>{formatPrice(item.price)}</div>

										<div className={styles.price}>{formatPrice(item.total)}</div>
									</div>
								))}

								<div className={styles.totalRow}>
									<span>Итого, ₽</span>

									<strong>{formatPrice(kitTotal)}</strong>
								</div>
							</div>
						</section>

						<section id='solution-materials' className={styles.contentBlock}>
							<h2 className={styles.blockTitle}>Материалы</h2>

							<ol className={styles.materials}>
								{solutionMock.materials.map((material) => (
									<li className={styles.material} key={material.id}>
										<div>
											<a href={material.file} download className={styles.materialTitle}>
												{material.title}
											</a>

											<span className={styles.materialMeta}>
												{material.type}, {material.size}
											</span>
										</div>

										<a
											href={material.file}
											download
											className={styles.download}
											aria-label={`Скачать ${material.title}`}
										>
											<svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
												<path
													d='M8 2V10M8 10L5 7M8 10L11 7M3 12V14H13V12'
													stroke='currentColor'
													strokeWidth='1.3'
													strokeLinecap='round'
													strokeLinejoin='round'
												/>
											</svg>
										</a>
									</li>
								))}
							</ol>
						</section>

						<p className={styles.note}>
							* Указана стоимость оборудования и предварительная стоимость проектирования / монтажа.
							<br />В цену не входят расходные материалы. Стоимость монтажа и проектирования может
							меняться в зависимости от особенностей объекта.
						</p>

						<Link to={solutionMock.categoryLink} className={styles.bottomBackLink}>
							<span>‹</span>
							{solutionMock.categoryTitle}
						</Link>
					</div>

					<aside className={styles.sidebar}>
						<div className={styles.priceCard}>
							<div className={styles.solutionPrice}>{formatPrice(solutionMock.price)} ₽</div>

							<button type='button' className={styles.requestBtn} onClick={scrollToRequest}>
								Отправить заявку
							</button>
						</div>

						<nav className={styles.sidebarNavigation}>
							{sidebarNavigationItems.map((item) => (
								<a
									key={item.id}
									href={`#${item.id}`}
									className={activeSection === item.id ? styles.activeNavLink : undefined}
									onClick={(event) => {
										event.preventDefault()

										scrollToSection(item.id)
									}}
								>
									{item.title}
								</a>
							))}
						</nav>
					</aside>
				</div>
			</Container>
		</Section>
	)
}
