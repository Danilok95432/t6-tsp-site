import { useState, useEffect } from 'react'
import { type FieldValues } from 'react-hook-form'

export interface DateTimeFormatOptions {
	localeMatcher?: 'best fit' | 'lookup' | undefined
	weekday?: 'long' | 'short' | 'narrow' | undefined
	era?: 'long' | 'short' | 'narrow' | undefined
	year?: 'numeric' | '2-digit' | undefined
	month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow' | undefined
	day?: 'numeric' | '2-digit' | undefined
	hour?: 'numeric' | '2-digit' | undefined
	minute?: 'numeric' | '2-digit' | undefined
	second?: 'numeric' | '2-digit' | undefined
	timeZoneName?:
		| 'short'
		| 'long'
		| 'shortOffset'
		| 'longOffset'
		| 'shortGeneric'
		| 'longGeneric'
		| undefined
	formatMatcher?: 'best fit' | 'basic' | undefined
	hour12?: boolean | undefined
	timeZone?: string | undefined
}

// функция форматирования флагов для отправки на сервер
export const booleanToNumberString = (bool: boolean | undefined): string => {
	return bool ? '1' : '0'
}

export const getItemsWord = (count: number) => {
	const lastTwo = count % 100
	const last = count % 10

	if (lastTwo >= 11 && lastTwo <= 14) return 'товаров'
	if (last === 1) return 'товар'
	if (last >= 2 && last <= 4) return 'товара'

	return 'товаров'
}

export const autoSetYearCopyright = (): string => {
	const currentYear = new Date().getFullYear()
	return String(currentYear)
}

export const useDebounce = <T,>(value: T, delay = 400) => {
	const [debouncedValue, setDebouncedValue] = useState(value)

	useEffect(() => {
		const timeout = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)

		return () => clearTimeout(timeout)
	}, [value, delay])

	return debouncedValue
}

export const setActive = (isActive: boolean, styles: string) => (isActive ? styles : '')

export function getYandexMetrikaId(metricCode?: string | null): number | null {
	if (!metricCode) return null

	// Ищем ID в ym(12345678, "init", ...)
	const ymInitMatch = metricCode.match(/ym\(\s*(\d+)\s*,\s*['"]init['"]/)

	if (ymInitMatch?.[1]) {
		return Number(ymInitMatch[1])
	}

	// Дополнительный fallback: ищем ID в https://mc.yandex.ru/watch/12345678
	const watchMatch = metricCode.match(/mc\.yandex\.ru\/watch\/(\d+)/)

	if (watchMatch?.[1]) {
		return Number(watchMatch[1])
	}

	return null
}

export const formatDate = (dateTime: string): string => {
	if (dateTime === '0000-00-00 00:00:00') {
		const now = new Date()
		const year = now.getFullYear()
		const month = String(now.getMonth() + 1).padStart(2, '0')
		const day = String(now.getDate()).padStart(2, '0')
		return `${day}.${month}.${year}`
	}
	const [date] = dateTime.split(' ')
	const [year, month, day] = date.split('-')
	if (day === undefined || month === undefined || year === undefined) {
		return 'неизвестной даты'
	}
	return `${day}.${month}.${year}`
}

// форматирование данных с формы в виде объекта в формат FormData
export const transformToFormData = (data: FieldValues) => {
	const formData = new FormData()

	Object.keys(data).forEach((key) => {
		const value = data[key]
		if (value instanceof File || value instanceof Blob) {
			formData.append(key, value)
		} else {
			formData.append(key, String(value))
		}
	})

	return formData
}
