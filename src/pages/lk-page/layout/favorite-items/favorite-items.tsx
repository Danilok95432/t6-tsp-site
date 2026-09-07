import { useState, useMemo } from 'react'
import { useBreakPoint } from 'src/features/useBreakPoint/useBreakPoint'
import { Container } from 'src/shared/ui/Container/Container'
import { Pagination } from 'src/widgets/pagination/pagination'
import styles from './index.module.scss'
import { useAdditionalCrumbs } from 'src/app/store/hooks/additionalCrumbs'
import { useGetItemsFavoritesQuery } from 'src/features/catalog/api/catalog.api'
import { ChocolateCard } from 'src/pages/chocolate-page/components/chocolate-list/components/chocolate-card/chocolate-card'

let ITEMS_PER_PAGE = 9

export const FavoriteItems = () => {
	const userID = localStorage.getItem('userID') ?? ''
	const { data, isLoading, isError } = useGetItemsFavoritesQuery(userID)
	useAdditionalCrumbs('Избранные товары')
	const [currentPage, setCurrentPage] = useState(1)
	const breakPoint = useBreakPoint()

	if (breakPoint === 'S') ITEMS_PER_PAGE = 8

	const handlePageChange = (page: number) => {
		setCurrentPage(page)
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	// Вычисляем данные для пагинации на основе реальных items
	const paginationData = useMemo(() => {
		const totalItems = data?.items?.length ?? 0
		const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
		const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
		const endIndex = startIndex + ITEMS_PER_PAGE
		const currentItems = data?.items?.slice(startIndex, endIndex) ?? []

		return {
			totalItems,
			totalPages,
			currentItems,
			startIndex: totalItems === 0 ? 0 : startIndex + 1,
			endIndex: Math.min(endIndex, totalItems),
		}
	}, [data?.items, currentPage, ITEMS_PER_PAGE])

	// Обработка загрузки
	if (isLoading) {
		return (
			<Container className={styles.cont}>
				<h1 className={styles.title}>Избранные товары</h1>
				<div className={styles.loader}>Загрузка...</div>
			</Container>
		)
	}

	// Обработка ошибки
	if (isError) {
		return (
			<Container className={styles.cont}>
				<h1 className={styles.title}>Избранные товары</h1>
				<div className={styles.error}>Не удалось загрузить избранные товары. Попробуйте позже.</div>
			</Container>
		)
	}

	// Обработка пустого списка
	if (!data?.items?.length) {
		return (
			<Container className={styles.cont}>
				<h1 className={styles.title}>Избранные товары</h1>
				<div className={styles.empty}>У вас пока нет избранных товаров.</div>
			</Container>
		)
	}

	return (
		<Container className={styles.cont}>
			<h1 className={styles.title}>Избранные товары</h1>
			<div className={styles.grid}>
				{paginationData.currentItems.map((candy) => (
					<ChocolateCard key={candy.id} chocolate={candy} />
				))}
			</div>

			{paginationData.totalPages > 1 && (
				<Pagination
					currentPage={currentPage}
					totalPages={paginationData.totalPages}
					onPageChange={handlePageChange}
					className={styles.pagination}
					maxVisiblePages={5}
				/>
			)}
		</Container>
	)
}
