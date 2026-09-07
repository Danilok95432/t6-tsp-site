import React from 'react'
import styles from './index.module.scss'

interface PaginationProps {
	currentPage: number
	totalPages: number
	onPageChange: (page: number) => void
	maxVisiblePages?: number
	className?: string
}

export const Pagination: React.FC<PaginationProps> = ({
	currentPage,
	totalPages,
	onPageChange,
	maxVisiblePages = 2,
	className = '',
}) => {
	// Генерация диапазона страниц для отображения
	const getPageNumbers = () => {
		const half = Math.floor(maxVisiblePages / 2)
		let start = Math.max(currentPage - half, 1)
		const end = Math.min(start + maxVisiblePages - 1, totalPages)

		// Корректировка, если мы в конце
		if (end - start + 1 < maxVisiblePages) {
			start = Math.max(end - maxVisiblePages + 1, 1)
		}

		return Array.from({ length: end - start + 1 }, (_, i) => start + i)
	}

	const pageNumbers = getPageNumbers()

	if (totalPages <= 1) {
		return null
	}

	return (
		<div className={`${styles.paginationContainer} ${className}`}>
			{/* Кнопка "Назад"
			<button
				className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ''}`}
				onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				aria-label='Предыдущая страница'
			>
				&lt;
			</button>
      */}
			{!pageNumbers.includes(1) && (
				<>
					<button
						className={`${styles.pageButton} ${currentPage === 1 ? styles.active : ''}`}
						onClick={() => onPageChange(1)}
					>
						1
					</button>
					{!pageNumbers.includes(2) && <span className={styles.dots}>...</span>}
				</>
			)}

			{pageNumbers.map((page) => (
				<button
					key={page}
					className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
					onClick={() => onPageChange(page)}
					aria-label={`Страница ${page}`}
					aria-current={currentPage === page ? 'page' : undefined}
				>
					{page}
				</button>
			))}

			{!pageNumbers.includes(totalPages) && (
				<>
					{!pageNumbers.includes(totalPages - 1) && <span className={styles.dots}>...</span>}
					<button
						className={`${styles.pageButton} ${currentPage === totalPages ? styles.active : ''}`}
						onClick={() => onPageChange(totalPages)}
					>
						{totalPages}
					</button>
				</>
			)}

			{/* Кнопка "Вперед"
			<button
				className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ''}`}
				onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				aria-label='Следующая страница'
			>
				&gt;
			</button>
      */}
		</div>
	)
}
