import { type SelOption } from 'src/types/select'
import * as yup from 'yup'

export type FeedbackInputs = {
	fio: string
	email: string
	telphone: string
	message_themes: SelOption[] | string
	id_message_theme?: string
	message: string
}

export const feedbackInputsSchema = yup.object().shape({
	// Проверка имени
	fio: yup
		.string()
		.required('Введите имя')
		.min(2, 'Имя должно содержать минимум 2 символа')
		.max(30, 'Имя не должно превышать 30 символов')
		.matches(/^[а-яА-ЯёЁa-zA-Z\s-]+$/, 'Имя может содержать только буквы, пробел и дефис'),
	// Проверка email
	email: yup
		.string()
		.required('Введите почту')
		.email('Введите корректный email адрес')
		.matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Введите корректный email адрес'),

	// Проверка телефона - 11 цифр
	telphone: yup.string().required('Введите номер телефона'),
	message: yup.string().required('Введите текст обращения'),
	message_themes: yup
		.mixed<SelOption[] | string>()
		.defined()
		.test('city-selected', 'Выберите тему обращения', (value) => {
			if (Array.isArray(value)) {
				return Boolean(value[0]?.value && value[0].value !== '0')
			}

			if (typeof value === 'string') {
				return Boolean(value.trim() && value !== '0')
			}

			return false
		}),
})
