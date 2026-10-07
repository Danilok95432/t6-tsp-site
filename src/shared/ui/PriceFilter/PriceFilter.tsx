import { useEffect, useMemo, useRef, useState } from 'react'

import styles from './index.module.scss'

type PriceFilterProps = {
	from: number | null
	to: number | null
	itemsCount: number
	onApply: (from: number | null, to: number | null) => void
	onPreviewCount?: (from: number | null, to: number | null) => number
}

const formatInputPrice = (value: string) => {
	const onlyNumbers = value.replace(/\D/g, '')

	if (!onlyNumbers) return ''

	return new Intl.NumberFormat('ru-RU').format(Number(onlyNumbers))
}

const parsePrice = (value: string) => {
	const normalized = value.replace(/\s/g, '')

	if (!normalized) return null

	const parsed = Number(normalized)

	return Number.isNaN(parsed) ? null : parsed
}

const formatPrice = (value: number) => new Intl.NumberFormat('ru-RU').format(value)

export const PriceFilter = ({
	from,
	to,
	itemsCount,
	onApply,
	onPreviewCount,
}: PriceFilterProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const [priceFrom, setPriceFrom] = useState(from !== null ? formatPrice(from) : '')
	const [priceTo, setPriceTo] = useState(to !== null ? formatPrice(to) : '')
	const priceRef = useRef<HTMLDivElement>(null)
	const appliedPrice = from !== null || to !== null

	useEffect(() => {
		setPriceFrom(from !== null ? formatPrice(from) : '')

		setPriceTo(to !== null ? formatPrice(to) : '')
	}, [from, to])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (priceRef.current && !priceRef.current.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const localFrom = parsePrice(priceFrom)
	const localTo = parsePrice(priceTo)

	const pricePreviewCount = useMemo(() => {
		if (!onPreviewCount) {
			return itemsCount
		}

		return onPreviewCount(localFrom, localTo)
	}, [itemsCount, localFrom, localTo, onPreviewCount])

	const getAppliedPriceText = () => {
		if (!appliedPrice) return 'Цена, ₽'

		if (from !== null && to !== null) {
			return `${formatPrice(from)}-${formatPrice(to)} ₽`
		}

		if (from !== null) {
			return `от ${formatPrice(from)} ₽`
		}

		return `до ${formatPrice(to ?? 0)} ₽`
	}

	const applyPrice = () => {
		onApply(localFrom, localTo)

		setIsOpen(false)
	}

	const resetPrice = () => {
		setPriceFrom('')
		setPriceTo('')

		onApply(null, null)

		setIsOpen(false)
	}

	return (
		<div ref={priceRef} className={styles.priceFilter}>
			<button
				type='button'
				className={`${styles.priceTrigger} ${
					appliedPrice ? styles.appliedPrice : ''
				} ${isOpen ? styles.openTrigger : ''}`}
				onClick={() => setIsOpen((prev) => !prev)}
			>
				<span>{getAppliedPriceText()}</span>

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
						className={isOpen ? styles.openArrow : ''}
					>
						<path d='M1 1L4.5 4.5L8 1' stroke='currentColor' strokeLinecap='round' />
					</svg>
				)}
			</button>

			{isOpen && (
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
	)
}
