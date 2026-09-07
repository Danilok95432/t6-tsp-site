/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { type ChangeEvent, type FC, useEffect, useRef, useState } from 'react'
import { type SelOption } from 'src/types/select'
import { type FieldError, useController, useFormContext } from 'react-hook-form'
import Select from 'react-dropdown-select'
import { ErrorMessage } from '@hookform/error-message'
import cn from 'classnames'

import styles from './index.module.scss'

type ControlledSelectProps = {
	selectOptions: SelOption[]
	name: string
	label?: string
	className?: string
	margin?: string
	dynamicError?: FieldError | undefined
	disabled?: boolean
	isRequired?: boolean
	bigFont?: boolean
	isLoading?: boolean
	onSearchChange?: (value: string) => void
}

export const ControlledSelect: FC<ControlledSelectProps> = ({
	selectOptions,
	name,
	label,
	className,
	margin,
	dynamicError,
	disabled,
	isRequired,
	bigFont = false,
	isLoading = false,
	onSearchChange,
	...props
}) => {
	const {
		control,
		formState: { errors },
	} = useFormContext()

	const {
		field: { value, onChange, onBlur },
	} = useController({
		name,
		control,
		defaultValue: [],
	})

	const selectedValue = Array.isArray(value) ? value : []
	const selectedLabel = selectedValue[0]?.label ?? ''

	const [inputValue, setInputValue] = useState(selectedLabel)

	// Флаг нужен, чтобы отличать ручное редактирование от реального выбора/очистки
	const isTypingRef = useRef(false)

	useEffect(() => {
		if (!isTypingRef.current) {
			setInputValue(selectedLabel)
		}
	}, [selectedLabel])

	// Нужно, чтобы при ручном редактировании выбранного города
	// сброс value в RHF не очищал input целиком.
	const skipNextEmptySyncRef = useRef(false)

	useEffect(() => {
		if (!selectedValue) {
			if (skipNextEmptySyncRef.current) {
				skipNextEmptySyncRef.current = false
				return
			}

			setInputValue('')
			onSearchChange?.('')
			return
		}

		setInputValue(selectedLabel)
		onSearchChange?.(selectedLabel)
	}, [selectedValue, selectedLabel, onSearchChange])

	return (
		<div
			className={cn(styles.selectWrapper, { [styles.selectHugeWrapper]: bigFont }, className)}
			style={{ margin }}
		>
			{label && (
				<label>
					{label} {isRequired ? <span className={styles.reqStar}>*</span> : null}
				</label>
			)}

			<Select
				{...props}
				options={selectOptions}
				values={selectedValue}
				onChange={(values) => {
					// ВАЖНО:
					// если пользователь печатает/удаляет символы,
					// а react-dropdown-select сам прислал values = [],
					// не надо чистить input.
					if (isTypingRef.current && values.length === 0) {
						onChange([])
						return
					}

					const nextLabel = values[0]?.label ?? ''

					isTypingRef.current = false

					onChange(values)
					setInputValue(nextLabel)
					onSearchChange?.(nextLabel)
				}}
				onDropdownClose={onBlur}
				disabled={disabled}
				className={cn({ [styles.disabled]: disabled })}
				searchBy='label'
				searchable
				loading={isLoading}
				noDataLabel={
					inputValue.trim().length < 3 ? 'Введите минимум 3 символа' : 'Ничего не найдено'
				}
				placeholder=''
				searchFn={({ props }) => props.options}
				contentRenderer={({ methods }) => (
					<input
						className={styles.selectSearchInput}
						value={inputValue}
						disabled={disabled}
						placeholder=''
						onClick={(event) => {
							event.stopPropagation()
							methods.dropDown('open')
						}}
						onFocus={() => methods.dropDown('open')}
						onKeyDown={(event) => {
							// Главное исправление.
							// Не даём Backspace/Delete долететь до react-dropdown-select.
							event.stopPropagation()
						}}
						onChange={(event: ChangeEvent<HTMLInputElement>) => {
							const nextValue = event.target.value

							isTypingRef.current = true

							setInputValue(nextValue)
							onSearchChange?.(nextValue)

							// Сбрасываем выбранный id города, но НЕ сбрасываем текст input.
							if (selectedValue.length && nextValue !== selectedLabel) {
								onChange([])
							}

							methods.dropDown('open')
						}}
					/>
				)}
			/>

			{dynamicError && <p className={styles.warningMessage}>{dynamicError.message}</p>}

			{errors[name] && (
				<p className={styles.warningMessage}>
					<ErrorMessage errors={errors} name={name} />
				</p>
			)}
		</div>
	)
}
