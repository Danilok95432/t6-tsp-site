import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'

import { Container } from 'src/shared/ui/Container/Container'
import { Section } from 'src/shared/ui/Section/section'

import styles from './index.module.scss'
import {
	type SolutionCategory,
	type SolutionLevel,
	solutionsMock,
	categoryOptions,
	levelOptions,
	type SolutionTag,
} from './consts'
import { FilterSelect } from 'src/shared/ui/FilterSelect/FilterSelect'

const INITIAL_VISIBLE_COUNT = 3

const formatPrice = (price: number) => {
	return new Intl.NumberFormat('ru-RU').format(price)
}

export const SolutionsCatalogSection = () => {
	const [category, setCategory] = useState<'all' | SolutionCategory>('all')
	const [level, setLevel] = useState<'all' | SolutionLevel>('all')
	const [isPriceOpen, setIsPriceOpen] = useState(false)

	const [priceFrom, setPriceFrom] = useState('')
	const [priceTo, setPriceTo] = useState('')
	const [appliedPrice, setAppliedPrice] = useState<{
		from: number | null
		to: number | null
	} | null>(null)
	const [search, setSearch] = useState('')
	const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)

	const priceRef = useRef<HTMLDivElement>(null)

	const handleShowMore = () => {
		setVisibleCount((current) => current + INITIAL_VISIBLE_COUNT)
	}

	useEffect(() => {
		const handleClickOutside = (event: globalThis.MouseEvent) => {
			if (priceRef.current && !priceRef.current.contains(event.target as Node)) {
				setIsPriceOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const parsePrice = (value: string) => {
		const normalized = value.replace(/\s/g, '')

		if (!normalized) return null

		const number = Number(normalized)

		return Number.isNaN(number) ? null : number
	}

	const formatInputPrice = (value: string) => {
		const onlyNumbers = value.replace(/\D/g, '')

		if (!onlyNumbers) return ''

		return new Intl.NumberFormat('ru-RU').format(Number(onlyNumbers))
	}

	const solutionsWithoutPriceFilter = useMemo(() => {
		const normalizedSearch = search.trim().toLowerCase()

		return solutionsMock.filter((solution) => {
			const categoryMatch = category === 'all' || solution.category === category

			const levelMatch = level === 'all' || solution.level === level

			const searchMatch =
				!normalizedSearch ||
				solution.title.toLowerCase().includes(normalizedSearch) ||
				solution.description.toLowerCase().includes(normalizedSearch)

			return categoryMatch && levelMatch && searchMatch
		})
	}, [category, level, search])

	const filteredSolutions = useMemo(() => {
		if (!appliedPrice) {
			return solutionsWithoutPriceFilter
		}

		return solutionsWithoutPriceFilter.filter((solution) => {
			const fromMatch = appliedPrice.from === null || solution.price >= appliedPrice.from

			const toMatch = appliedPrice.to === null || solution.price <= appliedPrice.to

			return fromMatch && toMatch
		})
	}, [solutionsWithoutPriceFilter, appliedPrice])

	const visibleSolutions = filteredSolutions.slice(0, visibleCount)

	const hiddenCount = filteredSolutions.length - visibleSolutions.length

	const showMoreCount = Math.min(INITIAL_VISIBLE_COUNT, hiddenCount)

	const pricePreviewCount = useMemo(() => {
		const from = parsePrice(priceFrom)
		const to = parsePrice(priceTo)

		return solutionsWithoutPriceFilter.filter((solution) => {
			const fromMatch = from === null || solution.price >= from

			const toMatch = to === null || solution.price <= to

			return fromMatch && toMatch
		}).length
	}, [solutionsWithoutPriceFilter, priceFrom, priceTo])

	const applyPrice = () => {
		const from = parsePrice(priceFrom)
		const to = parsePrice(priceTo)

		if (from === null && to === null) {
			setAppliedPrice(null)
		} else {
			setAppliedPrice({
				from,
				to,
			})
		}

		setVisibleCount(INITIAL_VISIBLE_COUNT)
		setIsPriceOpen(false)
	}

	const resetPrice = (event?: MouseEvent<HTMLButtonElement>) => {
		event?.stopPropagation()

		setAppliedPrice(null)
		setPriceFrom('')
		setPriceTo('')
		setIsPriceOpen(false)
		setVisibleCount(INITIAL_VISIBLE_COUNT)
	}

	const resetFilters = () => {
		setCategory('all')
		setLevel('all')
		setSearch('')

		setAppliedPrice(null)
		setPriceFrom('')
		setPriceTo('')
		setIsPriceOpen(false)

		setVisibleCount(INITIAL_VISIBLE_COUNT)
	}

	const hasFilters =
		category !== 'all' || level !== 'all' || Boolean(search.trim()) || Boolean(appliedPrice)

	const getAppliedPriceText = () => {
		if (!appliedPrice) return ''

		const from = appliedPrice.from ? new Intl.NumberFormat('ru-RU').format(appliedPrice.from) : '0'

		const to = appliedPrice.to ? new Intl.NumberFormat('ru-RU').format(appliedPrice.to) : ''

		if (!appliedPrice.to) {
			return `от ${from} ₽`
		}

		return `${from}–${to} ₽`
	}

	return (
		<Section className={styles.section}>
			<Container>
				<div className={styles.filtersBlock}>
					<div className={styles.filters}>
						<FilterSelect
							value={category}
							options={categoryOptions}
							onChange={(value) => {
								setCategory(value)
								setVisibleCount(INITIAL_VISIBLE_COUNT)
							}}
						/>

						<FilterSelect
							value={level}
							options={levelOptions}
							onChange={(value) => {
								setLevel(value)
								setVisibleCount(INITIAL_VISIBLE_COUNT)
							}}
						/>

						<div ref={priceRef} className={styles.priceFilter}>
							<button
								type='button'
								className={`${styles.priceTrigger} ${appliedPrice ? styles.appliedPrice : ''}`}
								onClick={() => setIsPriceOpen((prev) => !prev)}
							>
								<span>{appliedPrice ? getAppliedPriceText() : 'Цена, ₽'}</span>

								{appliedPrice ? (
									<span
										className={styles.clearPrice}
										role='button'
										tabIndex={0}
										onClick={(event) => {
											event.stopPropagation()
											resetPrice()
										}}
									>
										×
									</span>
								) : (
									<svg
										width='9'
										height='6'
										viewBox='0 0 9 6'
										fill='none'
										className={isPriceOpen ? styles.openArrow : ''}
									>
										<path d='M1 1L4.5 4.5L8 1' stroke='currentColor' strokeLinecap='round' />
									</svg>
								)}
							</button>

							{isPriceOpen && (
								<div className={styles.priceDropdown}>
									<div className={styles.priceInputs}>
										<label>
											<span>От</span>

											<input
												type='text'
												inputMode='numeric'
												value={priceFrom}
												onChange={(event) => setPriceFrom(formatInputPrice(event.target.value))}
												placeholder='0'
											/>
										</label>

										<label>
											<span>До</span>

											<input
												type='text'
												inputMode='numeric'
												value={priceTo}
												onChange={(event) => setPriceTo(formatInputPrice(event.target.value))}
												placeholder='20 000 000'
											/>
										</label>
									</div>

									<p className={styles.priceFound}>Найдено: {pricePreviewCount}</p>

									<button type='button' className={styles.applyPriceBtn} onClick={applyPrice}>
										Показать
									</button>
								</div>
							)}
						</div>

						<label className={styles.search}>
							<svg width='17' height='17' viewBox='0 0 20 20' fill='none'>
								<circle cx='8.5' cy='8.5' r='5.5' stroke='currentColor' strokeWidth='1.4' />

								<path
									d='M13 13L17 17'
									stroke='currentColor'
									strokeWidth='1.4'
									strokeLinecap='round'
								/>
							</svg>

							<input
								value={search}
								onChange={(event) => {
									setSearch(event.target.value)
									setVisibleCount(INITIAL_VISIBLE_COUNT)
								}}
								placeholder='поиск ...'
							/>
						</label>
					</div>

					<div className={styles.filtersInfo}>
						<p className={styles.found}>
							Найдено {filteredSolutions.length} {getSolutionsWord(filteredSolutions.length)}
						</p>

						{hasFilters && (
							<button type='button' className={styles.resetFilters} onClick={resetFilters}>
								Сбросить все фильтры
							</button>
						)}
					</div>
				</div>

				<div className={styles.list}>
					{visibleSolutions.map((solution) => (
						<SolutionCard key={solution.id} solution={solution} />
					))}
				</div>

				{filteredSolutions.length === 0 && (
					<p className={styles.empty}>По заданным параметрам решения не найдены</p>
				)}

				{hiddenCount > 0 && (
					<button type='button' className={styles.showMore} onClick={handleShowMore}>
						Показать еще {showMoreCount}
					</button>
				)}
			</Container>
		</Section>
	)
}

type SolutionCardProps = {
	solution: (typeof solutionsMock)[number]
}

const SolutionCard = ({ solution }: SolutionCardProps) => {
	return (
		<article className={styles.card}>
			<div className={styles.cardInfo}>
				<h2 className={styles.cardTitle}>{solution.title}</h2>

				<p className={styles.cardDescription}>{solution.description}</p>

				<Link to={solution.link} className={styles.details}>
					<span>Полное описание</span>

					<svg width='6' height='10' viewBox='0 0 6 10' fill='none' aria-hidden='true'>
						<path
							d='M1 1L5 5L1 9'
							stroke='currentColor'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>
				</Link>
			</div>

			<div className={styles.cardSide}>
				<div className={styles.price}>{formatPrice(solution.price)} ₽</div>

				<div className={styles.tags}>
					{solution.tags.map((tag) => (
						<span key={tag.id} className={`${styles.tag} ${styles[getTagClass(tag)]}`}>
							{tag.title}
						</span>
					))}
				</div>
			</div>
		</article>
	)
}

const getTagClass = (tag: SolutionTag) => {
	switch (tag.type) {
		case 'category':
			return 'categoryTag'

		case 'level':
			return 'levelTag'

		case 'direction':
			return 'directionTag'

		default:
			return ''
	}
}

const getSolutionsWord = (count: number) => {
	const lastTwo = count % 100
	const last = count % 10

	if (lastTwo >= 11 && lastTwo <= 14) {
		return 'решений'
	}

	if (last === 1) {
		return 'решение'
	}

	if (last >= 2 && last <= 4) {
		return 'решения'
	}

	return 'решений'
}
