import { useMemo, useEffect } from 'react'
import styles from './index.module.scss'
import { Container } from 'src/shared/ui/Container/Container'
import { ChocolateCard } from './components/chocolate-card/chocolate-card'
import { Pagination } from 'src/widgets/pagination/pagination'
import { useBreakPoint } from 'src/features/useBreakPoint/useBreakPoint'
import { useGetCatalogQuery } from 'src/features/catalog/api/catalog.api'
import { Loader } from 'src/shared/ui/loader/loader'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { type FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { saveCatalogPosition } from 'src/shared/helpers/catalog-return'

type ApiErrorResponse = {
	status: 'error'
	error: string
}

const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError => {
	return typeof error === 'object' && error !== null && 'status' in error
}

const getApiErrorMessage = (error: unknown): string => {
	if (isFetchBaseQueryError(error)) {
		const errorData = error.data as Partial<ApiErrorResponse> | undefined

		if (errorData?.status === 'error' && errorData?.error) {
			return errorData.error
		}
	}

	return 'Произошла ошибка при загрузке категории'
}

const getPageFromSearchParams = (searchParams: URLSearchParams): number => {
	const page = Number(searchParams.get('page'))

	return Number.isInteger(page) && page > 0 ? page : 1
}

export const ChocolateList = () => {
	const { menuId = '' } = useParams()
	const navigate = useNavigate()
	const location = useLocation()
	const [searchParams, setSearchParams] = useSearchParams()

	const currentPage = getPageFromSearchParams(searchParams)
	const breakPoint = useBreakPoint()

	const userId = localStorage.getItem('userID') ?? ''
	const itemsPerPage = breakPoint === 'S' ? 8 : 9

	const {
		data,
		error: newsItemError,
		isError: isNewsItemError,
		isLoading,
	} = useGetCatalogQuery({
		id: menuId,
		limit: '0',
		step: String(currentPage),
		userId,
	})

	useEffect(() => {
		saveCatalogPosition(menuId, `${location.pathname}${location.search}`, currentPage)
	}, [menuId, location.pathname, location.search, currentPage])

	useEffect(() => {
		if (!isNewsItemError) return

		const message = getApiErrorMessage(newsItemError)

		toast.error(message, {
			toastId: `news-error-${menuId}`,
		})

		navigate('/', { replace: true })
	}, [isNewsItemError, newsItemError, navigate, menuId])

	const paginationData = useMemo(() => {
		const items = data?.items ?? []
		const totalItems = data?.totalitems ?? items.length
		const totalPages = Math.ceil(totalItems / itemsPerPage)

		const startIndex = (currentPage - 1) * itemsPerPage
		const endIndex = startIndex + itemsPerPage
		const currentItems = items.slice(startIndex, endIndex)

		return {
			totalItems,
			totalPages,
			currentItems,
			startIndex: startIndex + 1,
			endIndex: Math.min(endIndex, totalItems),
		}
	}, [currentPage, data, itemsPerPage])

	useEffect(() => {
		if (!paginationData.totalPages) return
		if (currentPage <= paginationData.totalPages) return

		setSearchParams(
			(prev) => {
				const next = new URLSearchParams(prev)

				if (paginationData.totalPages <= 1) {
					next.delete('page')
				} else {
					next.set('page', String(paginationData.totalPages))
				}

				return next
			},
			{ replace: true },
		)
	}, [currentPage, paginationData.totalPages, setSearchParams])

	const handlePageChange = (page: number) => {
		setSearchParams((prev) => {
			const next = new URLSearchParams(prev)

			if (page <= 1) {
				next.delete('page')
			} else {
				next.set('page', String(page))
			}

			return next
		})

		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	if (!data?.items || isLoading) return <Loader />

	return (
		<Container className={styles.cont}>
			<div className={styles.grid}>
				{paginationData.currentItems.length > 0 ? (
					paginationData.currentItems.map((chocolate) => (
						<ChocolateCard key={chocolate.id} chocolate={chocolate} />
					))
				) : (
					<p className={styles.noItems}>Нет товаров</p>
				)}
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
