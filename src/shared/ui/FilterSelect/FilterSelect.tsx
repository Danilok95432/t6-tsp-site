import { useEffect, useRef, useState } from 'react'

import styles from './index.module.scss'

export type FilterSelectOption<T extends string = string> = {
	value: T
	title: string
}

type FilterSelectProps<T extends string = string> = {
	value: T
	options: Array<FilterSelectOption<T>>
	onChange: (value: T) => void
	className?: string
}

export const FilterSelect = <T extends string>({
	value,
	options,
	onChange,
	className,
}: FilterSelectProps<T>) => {
	const [isOpen, setIsOpen] = useState(false)

	const selectRef = useRef<HTMLDivElement>(null)

	const selectedOption = options.find((option) => option.value === value)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		document.addEventListener('keydown', handleKeyDown)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [])

	const handleSelect = (optionValue: T) => {
		onChange(optionValue)
		setIsOpen(false)
	}

	return (
		<div ref={selectRef} className={`${styles.select} ${className ?? ''}`}>
			<button
				type='button'
				className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ''}`}
				onClick={() => setIsOpen((current) => !current)}
				aria-expanded={isOpen}
			>
				<span>{selectedOption?.title}</span>

				<svg
					className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}
					width='12'
					height='7'
					viewBox='0 0 12 7'
					fill='none'
					aria-hidden='true'
				>
					<path
						d='M1 1L6 6L11 1'
						stroke='currentColor'
						strokeWidth='1.5'
						strokeLinecap='round'
						strokeLinejoin='round'
					/>
				</svg>
			</button>

			<div className={`${styles.dropdown} ${isOpen ? styles.dropdownOpen : ''}`}>
				{options.map((option) => {
					const isSelected = option.value === value

					return (
						<button
							key={option.value}
							type='button'
							className={`${styles.option} ${isSelected ? styles.selectedOption : ''}`}
							onClick={() => handleSelect(option.value)}
						>
							{option.title}
						</button>
					)
				})}
			</div>
		</div>
	)
}
