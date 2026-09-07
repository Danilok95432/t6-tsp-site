import React, { type FC, type ReactNode, useState } from 'react'
import { type FieldError, useFormContext, Controller } from 'react-hook-form'
import cn from 'classnames'
import { ErrorMessage } from '@hookform/error-message'
import InputMask from 'react-input-mask'

import styles from './index.module.scss'
import { LockedInputSVG } from 'src/shared/ui/icons/lockedInputSVG'
import { PasswordEyeSvg } from 'src/shared/ui/icons/passwordEyeSVG'

type ControlledInputProps = {
	className?: string
	label?: string | ReactNode
	subLabel?: string
	isTextarea?: boolean
	dynamicError?: FieldError | undefined
	name: string
	margin?: string
	width?: string
	maxWidth?: string
	height?: string
	type?: string
	isReadOnly?: boolean
	isLogin?: boolean
	disabled?: boolean
	isRequired?: boolean
	bigFont?: boolean
	locked?: boolean
	isPhone?: boolean
	isSum?: boolean
	stelsDisabled?: boolean
	hideErrorMessage?: boolean
} & React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>

const sanitizeSumValue = (value: string): string => {
	return value
		.replace(',', '.')
		.replace(/[^\d.]/g, '')
		.replace(/(\..*)\./g, '$1')
}

const formatSumForInput = (value: string): string => {
	if (!value) return ''

	const normalized = sanitizeSumValue(value)
	const [rawInteger = '', rawDecimal = ''] = normalized.split('.')

	const integerPart = rawInteger.replace(/^0+(?=\d)/, '') || '0'
	const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

	if (normalized.includes('.')) {
		return `${formattedInteger}.${rawDecimal.slice(0, 2)}`
	}

	return formattedInteger
}

const formatSumOnBlur = (value: string): string => {
	if (!value) return ''

	const normalized = sanitizeSumValue(value)
	const [rawInteger = '', rawDecimal = ''] = normalized.split('.')

	const integerPart = rawInteger.replace(/^0+(?=\d)/, '') || '0'
	const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
	const decimalPart = (rawDecimal + '00').slice(0, 2)

	return `${formattedInteger}.${decimalPart}`
}

// Сколько "значимых" символов было до курсора.
// Игнорируем только пробелы-разделители тысяч.
// Точку и копейки сохраняем в расчете.
const countMeaningfulCharsBeforeCaret = (value: string, caretPosition: number): number => {
	return value.slice(0, caretPosition).replace(/ /g, '').length
}

// Восстанавливаем курсор по количеству значимых символов.
// Это позволяет нормально жить и целой части, и точке, и копейкам.
const getCaretPositionFromMeaningfulIndex = (value: string, meaningfulIndex: number): number => {
	if (meaningfulIndex <= 0) return 0

	let passed = 0

	for (let i = 0; i < value.length; i++) {
		if (value[i] !== ' ') {
			passed++
		}

		if (passed >= meaningfulIndex) {
			return i + 1
		}
	}

	return value.length
}

export const ControlledInput: FC<ControlledInputProps> = ({
	name,
	className,
	label,
	dynamicError,
	isTextarea,
	margin,
	width,
	maxWidth,
	height,
	type,
	isReadOnly,
	isLogin = false,
	disabled,
	isRequired,
	bigFont = false,
	locked = false,
	subLabel,
	isPhone = false,
	isSum = false,
	stelsDisabled,
	hideErrorMessage = false,
	...props
}) => {
	const {
		register,
		formState: { errors },
		control,
	} = useFormContext()

	const [isVisiblePass, setIsVisiblePass] = useState<boolean>(false)

	if (isTextarea) {
		return (
			<div
				className={cn(
					styles.inputEl,
					styles.textareaEl,
					{ [styles.inputElBig]: bigFont },
					className,
				)}
				style={{ margin, width, maxWidth }}
			>
				<label className={cn(styles.inputWrapper, styles.textareaWrapper)}>
					{label && (
						<p>
							{label} {isRequired ? <span className={styles.reqStar}>*</span> : null}
						</p>
					)}
					{subLabel && <p className={styles.subLabel}>{subLabel}</p>}
					<textarea
						{...register(name)}
						{...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
						readOnly={isReadOnly}
						disabled={disabled}
						className={cn(styles.controlledInput, {
							[styles.noValid]: errors[name],
							[styles.disabled]: locked,
						})}
						style={{ height }}
					/>
				</label>
				{locked && (
					<div className={styles.locked}>
						<LockedInputSVG />
					</div>
				)}
				{dynamicError && <p className={styles.warningMessage}>{dynamicError.message}</p>}
				{errors[name] && (
					<p className={styles.warningMessage}>
						<ErrorMessage errors={errors} name={name} />
					</p>
				)}
			</div>
		)
	}

	if (type === 'password') {
		return (
			<div className={cn(styles.inputEl, className)} style={{ margin, width, maxWidth }}>
				<label className={styles.inputWrapper}>
					{label && <p>{label}</p>}
					<div className={styles.passwordInputWrapper}>
						<input
							{...register(name)}
							{...(props as React.InputHTMLAttributes<HTMLInputElement>)}
							type={isVisiblePass ? 'text' : 'password'}
							readOnly={isReadOnly}
							className={cn(styles.controlledInput, {
								[styles.noValid]: errors[name],
							})}
						/>
						<button
							className={cn(styles.passEyeBtn, { [styles._crossOut]: isVisiblePass })}
							onClick={() => setIsVisiblePass(!isVisiblePass)}
							type='button'
						>
							<PasswordEyeSvg />
						</button>
					</div>
				</label>

				{dynamicError && <p className={styles.warningMessage}>{dynamicError.message}</p>}
				{errors[name] && (
					<p className={styles.warningMessage}>
						<ErrorMessage errors={errors} name={name} />
					</p>
				)}
			</div>
		)
	}

	if (isPhone) {
		return (
			<div
				className={cn(styles.inputEl, { [styles.inputElBig]: bigFont }, className)}
				style={{ margin, width, maxWidth }}
			>
				<label className={styles.inputWrapper}>
					{label && (
						<p>
							{label} {isRequired ? <span className={styles.reqStar}>*</span> : null}
						</p>
					)}
					{subLabel && <p className={styles.subLabel}>{subLabel}</p>}
					<Controller
						name={name}
						control={control}
						render={({ field }) => (
							<InputMask
								mask='+7 (999) 999-99-99'
								maskChar={null}
								value={field.value || ''}
								onBlur={field.onBlur}
								onChange={(e) => {
									field.onChange(e.target.value)
									props.onChange?.(e)
								}}
								readOnly={isReadOnly}
								disabled={disabled}
							>
								<input
									type='tel'
									className={cn(styles.controlledInput, {
										[styles.noValid]: errors[name],
										[styles.noBorder]: isLogin,
									})}
								/>
							</InputMask>
						)}
					/>
				</label>
				{locked && (
					<div className={styles.locked}>
						<LockedInputSVG />
					</div>
				)}
				{dynamicError && <p className={styles.warningMessage}>{dynamicError.message}</p>}
				{errors[name] && (
					<p className={styles.warningMessage}>
						<ErrorMessage errors={errors} name={name} />
					</p>
				)}
			</div>
		)
	}

	if (isSum) {
		return (
			<div
				className={cn(styles.inputEl, { [styles.inputElBig]: bigFont }, className)}
				style={{ margin, width, maxWidth }}
			>
				<label className={styles.inputWrapper}>
					{label && (
						<p>
							{label} {isRequired ? <span className={styles.reqStar}>*</span> : null}
						</p>
					)}
					{subLabel && <p className={styles.subLabel}>{subLabel}</p>}

					<Controller
						name={name}
						control={control}
						defaultValue=''
						render={({ field }) => (
							<input
								{...(props as React.InputHTMLAttributes<HTMLInputElement>)}
								ref={field.ref}
								type='text'
								value={field.value || ''}
								readOnly={isReadOnly}
								disabled={disabled}
								inputMode='decimal'
								className={cn(styles.controlledInput, {
									[styles.noValid]: errors[name],
									[styles.noBorder]: isLogin,
								})}
								onChange={(e) => {
									const input = e.target
									const rawValue = input.value
									const caret = input.selectionStart ?? rawValue.length

									const meaningfulCharsBeforeCaret = countMeaningfulCharsBeforeCaret(
										rawValue,
										caret,
									)

									const formattedValue = formatSumForInput(rawValue)

									field.onChange(formattedValue)

									requestAnimationFrame(() => {
										const newCaret = getCaretPositionFromMeaningfulIndex(
											formattedValue,
											meaningfulCharsBeforeCaret,
										)
										input.setSelectionRange(newCaret, newCaret)
									})

									props.onChange?.(e)
								}}
								onBlur={(e) => {
									const blurredValue = formatSumOnBlur(e.target.value)
									field.onChange(blurredValue)
									field.onBlur()
									props.onBlur?.(e)
								}}
							/>
						)}
					/>
				</label>

				{locked && (
					<div className={styles.locked}>
						<LockedInputSVG />
					</div>
				)}
				{!hideErrorMessage && dynamicError && (
					<p className={styles.warningMessage}>{dynamicError.message}</p>
				)}
				{!hideErrorMessage && !errors[name] && (
					<p className={styles.warningMessage}>
						<ErrorMessage errors={errors} name={name} />
					</p>
				)}
			</div>
		)
	}

	return (
		<div
			className={cn(styles.inputEl, { [styles.inputElBig]: bigFont }, className)}
			style={{ margin, width, maxWidth }}
		>
			<label className={styles.inputWrapper}>
				{label && (
					<p>
						{label} {isRequired ? <span className={styles.reqStar}>*</span> : null}
					</p>
				)}
				{subLabel && <p className={styles.subLabel}>{subLabel}</p>}
				<input
					{...register(name)}
					{...(props as React.InputHTMLAttributes<HTMLInputElement>)}
					readOnly={isReadOnly}
					className={cn(styles.controlledInput, {
						[styles.noValid]: errors[name],
						[styles.noBorder]: isLogin,
						[styles.noBg]: stelsDisabled,
					})}
					disabled={disabled ?? stelsDisabled}
				/>
			</label>
			{locked && (
				<div className={styles.locked}>
					<LockedInputSVG />
				</div>
			)}
			{dynamicError && <p className={styles.warningMessage}>{dynamicError.message}</p>}
			{errors[name] && (
				<p className={styles.warningMessage}>
					<ErrorMessage errors={errors} name={name} />
				</p>
			)}
		</div>
	)
}
