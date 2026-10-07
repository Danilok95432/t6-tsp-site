import { useEffect, useMemo, useRef, useState } from 'react'

import styles from './index.module.scss'

export type FilterSelectOption<T extends string = string> = {
	value: T
	title: string
}

type BaseFilterSelectProps<T extends string> = {
	options: Array<FilterSelectOption<T>>
	className?: string
	placeholder?: string
	emptyValue?: T
}

type SingleFilterSelectProps<T extends string> = BaseFilterSelectProps<T> & {
	multi?: false
	value: T
	onChange: (value: T) => void
}

type MultiFilterSelectProps<T extends string> = BaseFilterSelectProps<T> & {
	multi: true
	value: T[]
	onChange: (value: T[]) => void
}

type FilterSelectProps<T extends string> = SingleFilterSelectProps<T> | MultiFilterSelectProps<T>

export const FilterSelect = <T extends string>(props: FilterSelectProps<T>) => {
	const { options, className, placeholder = 'Выберите', multi = false, emptyValue } = props
	const [isOpen, setIsOpen] = useState(false)
	const selectRef = useRef<HTMLDivElement>(null)
	const isApplied = multi
		? props.value.length > 0
		: emptyValue !== undefined && props.value !== emptyValue

	const handleClear = () => {
		if (props.multi) {
			props.onChange([])
			return
		}

		if (emptyValue !== undefined) {
			props.onChange(emptyValue)
		}
	}

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		document.addEventListener('keydown', handleEscape)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			document.removeEventListener('keydown', handleEscape)
		}
	}, [])

	const selectedValues = useMemo(() => {
		if (multi) {
			return props.value
		}

		return [props.value]
	}, [multi, props.value])

	const selectedOptions = useMemo(() => {
		return options.filter((option) => selectedValues.includes(option.value))
	}, [options, selectedValues])

	const triggerTitle = useMemo(() => {
		if (!selectedOptions.length) {
			return placeholder
		}

		if (!multi) {
			return selectedOptions[0]?.title ?? placeholder
		}

		const firstTitle = selectedOptions[0]?.title

		if (!firstTitle) {
			return placeholder
		}

		if (selectedOptions.length === 1) {
			return firstTitle
		}

		return `${firstTitle}, +${selectedOptions.length - 1}`
	}, [multi, placeholder, selectedOptions])

	const handleSelect = (optionValue: T) => {
		if (props.multi) {
			const isSelected = props.value.includes(optionValue)

			const newValue = isSelected
				? props.value.filter((value) => value !== optionValue)
				: [...props.value, optionValue]

			props.onChange(newValue)

			return
		}

		props.onChange(optionValue)
		setIsOpen(false)
	}

	return (
		<div ref={selectRef} className={`${styles.select} ${className ?? ''}`}>
			<button
				type='button'
				className={`${styles.trigger} ${
					isOpen ? styles.triggerOpen : ''
				} ${isApplied ? styles.appliedTrigger : ''}`}
				onClick={() => setIsOpen((current) => !current)}
				aria-expanded={isOpen}
			>
				<span className={styles.triggerText}>{triggerTitle}</span>

				{isApplied ? (
					<span
						className={styles.clear}
						role='button'
						tabIndex={0}
						onClick={(event) => {
							event.stopPropagation()

							handleClear()
							setIsOpen(false)
						}}
					>
						×
					</span>
				) : (
					<svg
						className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}
						width='10'
						height='6'
						viewBox='0 0 10 6'
						fill='none'
						aria-hidden='true'
					>
						<path
							d='M1 1L5 5L9 1'
							stroke='currentColor'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>
				)}
			</button>

			<div className={`${styles.dropdown} ${isOpen ? styles.dropdownOpen : ''}`}>
				{options.map((option) => {
					const isSelected = selectedValues.includes(option.value)

					return (
						<button
							key={option.value}
							type='button'
							className={`${styles.option} ${isSelected ? styles.selectedOption : ''} ${multi ? styles.multiOption : ''}`}
							onClick={() => handleSelect(option.value)}
						>
							{multi && (
								<span className={`${styles.checkbox} ${isSelected ? styles.checkboxActive : ''}`}>
									{isSelected && (
										<svg
											xmlns='http://www.w3.org/2000/svg'
											x='0px'
											y='0px'
											width='16'
											height='16'
											viewBox='0 0 50 50'
										>
											<path d='M 41.9375 8.625 C 41.273438 8.648438 40.664063 9 40.3125 9.5625 L 21.5 38.34375 L 9.3125 27.8125 C 8.789063 27.269531 8.003906 27.066406 7.28125 27.292969 C 6.5625 27.515625 6.027344 28.125 5.902344 28.867188 C 5.777344 29.613281 6.078125 30.363281 6.6875 30.8125 L 20.625 42.875 C 21.0625 43.246094 21.640625 43.410156 22.207031 43.328125 C 22.777344 43.242188 23.28125 42.917969 23.59375 42.4375 L 43.6875 11.75 C 44.117188 11.121094 44.152344 10.308594 43.78125 9.644531 C 43.410156 8.984375 42.695313 8.589844 41.9375 8.625 Z'></path>
										</svg>
									)}
								</span>
							)}

							<span>{option.title}</span>
						</button>
					)
				})}
			</div>
		</div>
	)
}
