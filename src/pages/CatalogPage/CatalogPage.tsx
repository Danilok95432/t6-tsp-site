import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { Container } from 'src/shared/ui/Container/Container'
import { FilterSelect } from 'src/shared/ui/FilterSelect/FilterSelect'

import {
	categoryContainsId,
	findCategoryById,
	formatPrice,
	getCategoryIds,
	getProductsWord,
	INITIAL_COUNT,
	manufacturerOptions,
	productTypeOptions,
} from './consts'

import styles from './index.module.scss'
import { PriceFilter } from 'src/shared/ui/PriceFilter/PriceFilter'
import {
	useGetCatalogQuery,
	useGetCategoriesCatalogQuery,
} from 'src/features/catalog/api/catalog.api'
import { type CatalogListItem } from 'src/types/cardItem'
import { ProductsLoader } from './components/loader/ProductsLoader'

export const CatalogPage = () => {
	const navigate = useNavigate()

	const { categoryId } = useParams<{
		categoryId?: string
	}>()

	const { data: catalogCategories } = useGetCategoriesCatalogQuery(null)

	const {
		data: catalogProducts,
		isLoading,
		isFetching,
	} = useGetCatalogQuery({
		id: categoryId ?? 'all',
		limit: '0',
	})

	const isProductsLoading = isLoading || isFetching

	const [productType, setProductType] = useState<'all' | string>('all')
	const [manufacturers, setManufacturers] = useState<string[]>([])
	const [search, setSearch] = useState('')
	const [priceFrom, setPriceFrom] = useState<number | null>(null)
	const [priceTo, setPriceTo] = useState<number | null>(null)
	const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT)

	const currentCategory = useMemo(() => {
		if (categoryId === null) {
			return undefined
		}

		return findCategoryById(catalogCategories?.catalogs ?? [], Number(categoryId))
	}, [categoryId, catalogCategories])

	const categoryFilterIds = useMemo(() => {
		if (categoryId === null) {
			return null
		}

		const category = findCategoryById(catalogCategories?.catalogs ?? [], Number(categoryId))

		if (!category) {
			return null
		}

		return getCategoryIds(category)
	}, [categoryId, catalogCategories])

	const pageTitle = currentCategory?.title ?? 'Каталог'
	const baseFilteredProducts = useMemo(() => {
		const normalizedSearch = search.trim().toLowerCase()
		return catalogProducts?.items.filter((product) => {
			const categoryMatch =
				!categoryFilterIds || categoryFilterIds.includes(Number(product?.category_id))

			const typeMatch = productType === 'all' || product?.type_id === productType

			const manufacturerMatch =
				manufacturers.length === 0 || manufacturers.includes(product?.manufacturer_id ?? '')

			const searchMatch =
				!normalizedSearch || product.title.toLowerCase().includes(normalizedSearch)

			return categoryMatch && typeMatch && manufacturerMatch && searchMatch
		})
	}, [categoryFilterIds, productType, manufacturers, search, catalogProducts])

	const filteredProducts = useMemo(() => {
		const hasPriceFilter = priceFrom !== null || priceTo !== null
		if (!hasPriceFilter) {
			return baseFilteredProducts
		}
		return baseFilteredProducts?.filter((product) => {
			if (product.individualPrice ?? product.item_price === undefined) {
				return false
			}

			const fromMatch = priceFrom === null || Number(product.item_price) >= priceFrom
			const toMatch = priceTo === null || Number(product.item_price) <= priceTo
			return fromMatch && toMatch
		})
	}, [baseFilteredProducts, priceFrom, priceTo])

	const visibleProducts = filteredProducts?.slice(0, visibleCount) ?? []

	const hasFilters =
		productType !== 'all' ||
		manufacturers.length > 0 ||
		Boolean(search.trim()) ||
		priceFrom !== null ||
		priceTo !== null

	const handleCategoryClick = (category: CatalogListItem) => {
		navigate(`/catalog/${category.id}`)
		setVisibleCount(INITIAL_COUNT)
	}

	const handleResetFilters = () => {
		setProductType('all')
		setManufacturers([])
		setSearch('')
		setPriceFrom(null)
		setPriceTo(null)
		setVisibleCount(INITIAL_COUNT)
	}

	return (
		<main>
			<section className={styles.hero}>
				<Container>
					<div className={styles.breadcrumbs}>
						<Link to='/'>Главная</Link>

						{categoryId !== null && (
							<>
								<span>›</span>

								<Link to='/catalog'>Каталог</Link>
							</>
						)}
					</div>

					<h1 className={styles.heroTitle}>{pageTitle}</h1>
				</Container>
			</section>

			<section className={styles.catalog}>
				<Container>
					<div className={styles.catalogLayout}>
						<aside className={styles.sidebar}>
							<button
								type='button'
								className={`${styles.category} ${categoryId === undefined ? styles.activeCategory : ''}`}
								onClick={() => {
									navigate('/catalog')

									setVisibleCount(INITIAL_COUNT)
								}}
							>
								Все товары
							</button>

							{catalogCategories?.catalogs?.map((category) => {
								const isCategoryActive =
									categoryId !== null && categoryContainsId(category, Number(categoryId))
								const isOpened = isCategoryActive && Boolean(category.subcats?.length)
								return (
									<div key={category.id} className={styles.categoryGroup}>
										<button
											type='button'
											className={`${styles.category} ${
												isCategoryActive ? styles.activeCategory : ''
											}`}
											onClick={() => handleCategoryClick(category)}
										>
											<span>{category.title}</span>
										</button>

										{category.subcats && category.subcats.length > 0 && (
											<div
												className={`${styles.subcategories} ${
													isOpened ? styles.subcategoriesOpen : ''
												}`}
											>
												<div className={styles.subcategoriesInner}>
													{category.subcats.map((child) => {
														const isChildActive = Number(categoryId) === Number(child.id)
														return (
															<button
																type='button'
																key={child.id}
																className={`${styles.subcategory} ${
																	isChildActive ? styles.activeSubcategory : ''
																}`}
																onClick={() => {
																	navigate(`/catalog/${child.id}`)

																	setVisibleCount(INITIAL_COUNT)
																}}
															>
																{child.title}
															</button>
														)
													})}
												</div>
											</div>
										)}
									</div>
								)
							})}
						</aside>

						<div className={styles.content}>
							<div className={styles.filters}>
								<FilterSelect
									value={productType}
									options={productTypeOptions}
									emptyValue='all'
									onChange={(value) => {
										setProductType(value)

										setVisibleCount(INITIAL_COUNT)
									}}
									className={styles.select}
								/>

								<FilterSelect
									multi
									value={manufacturers}
									options={manufacturerOptions}
									placeholder='Производитель'
									onChange={(values) => {
										setManufacturers(values)

										setVisibleCount(INITIAL_COUNT)
									}}
									className={styles.select}
								/>

								<PriceFilter
									from={priceFrom}
									to={priceTo}
									itemsCount={baseFilteredProducts?.length ?? 0}
									onPreviewCount={(from, to) => {
										return (
											baseFilteredProducts?.filter((product) => {
												if (product.individualPrice ?? product.item_price === undefined) {
													return false
												}

												const fromMatch = from === null || Number(product.item_price) >= from

												const toMatch = to === null || Number(product.item_price) <= to

												return fromMatch && toMatch
											}).length ?? 0
										)
									}}
									onApply={(from, to) => {
										setPriceFrom(from)
										setPriceTo(to)

										setVisibleCount(INITIAL_COUNT)
									}}
								/>

								<label className={styles.search}>
									<svg width='17' height='17' viewBox='0 0 20 20' fill='none' aria-hidden='true'>
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

											setVisibleCount(INITIAL_COUNT)
										}}
										placeholder='поиск ...'
									/>
								</label>
							</div>

							<div className={styles.filterInfo}>
								<span>
									{isProductsLoading ? (
										'Загрузка товаров...'
									) : (
										<>
											Найдено {filteredProducts?.length ?? 0}{' '}
											{getProductsWord(filteredProducts?.length ?? 0)}
										</>
									)}
								</span>

								{hasFilters && (
									<button type='button' onClick={handleResetFilters}>
										Сбросить все фильтры
									</button>
								)}
							</div>

							{isProductsLoading ? (
								<div className={styles.products}>
									<ProductsLoader />
								</div>
							) : visibleProducts.length > 0 ? (
								<div className={styles.products}>
									{visibleProducts.map((product) => (
										<Link
											key={product.id}
											to={`/catalog/${product.category_id}/item/${product.id}`}
											className={styles.product}
										>
											<div className={styles.productImage}>
												<img
													src={product.img.length > 0 ? product.img[0]?.original : ''}
													alt={product.title}
												/>
											</div>

											<h2 className={styles.productTitle}>{product.title}</h2>

											<div className={styles.productPrice}>
												{product.individualPrice
													? 'По запросу'
													: `${formatPrice(Number(product.item_price) ?? 0)} ₽/шт.`}
											</div>
										</Link>
									))}
								</div>
							) : (
								<p className={styles.empty}>Товары по заданным параметрам не найдены</p>
							)}

							{!isProductsLoading && visibleCount < (filteredProducts?.length ?? 0) && (
								<button
									type='button'
									className={styles.showMore}
									onClick={() => setVisibleCount((current) => current + INITIAL_COUNT)}
								>
									Показать еще
								</button>
							)}
						</div>
					</div>
				</Container>
			</section>
		</main>
	)
}
