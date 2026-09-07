import { type SelOption } from 'src/types/select'
import * as yup from 'yup'

export type LkInputs = {
	firstname: string
	surname: string
	fathname?: string
	email: string
	telphone: string
	use_spam?: boolean
	use_company?: boolean
	org_name?: string
	citys?: SelOption[] | string
	citys_id?: string
	street?: string
	dom?: string
	room?: string
	password?: string
	password2?: string
}

export const lkInputsSchema = yup.object().shape({
	// Проверка имени
	firstname: yup
		.string()
		.required('Введите имя')
		.min(2, 'Имя должно содержать минимум 2 символа')
		.max(30, 'Имя не должно превышать 30 символов')
		.matches(/^[а-яА-ЯёЁa-zA-Z\s-]+$/, 'Имя может содержать только буквы, пробел и дефис'),

	// Проверка фамилии
	surname: yup
		.string()
		.required('Введите фамилию')
		.min(2, 'Фамилия должна содержать минимум 2 символа')
		.max(30, 'Фамилия не должна превышать 30 символов')
		.matches(/^[а-яА-ЯёЁa-zA-Z\s-]+$/, 'Фамилия может содержать только буквы, пробел и дефис'),

	// Проверка email
	email: yup
		.string()
		.required('Введите почту')
		.email('Введите корректный email адрес')
		.matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Введите корректный email адрес'),

	// Проверка телефона - 11 цифр
	telphone: yup.string().required('Введите номер телефона'),

	// Проверка повторения пароля
	password2: yup.string().oneOf([yup.ref('password')], 'Пароли не совпадают'),
})
