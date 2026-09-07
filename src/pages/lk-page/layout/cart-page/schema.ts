import { type SelOption } from 'src/types/select'
import * as yup from 'yup'

export type OrderInputs = {
	citys: SelOption[] | string
	deliveryId: string
	paymentId: string
	firstname: string
	surname: string
	email: string
	telphone: string
	street: string
	dom: string
	room: string
	comment: string
}

const isDeliveryAddressRequired = (deliveryId: unknown) => String(deliveryId) === '1'

export const orderInputsSchema: yup.ObjectSchema<OrderInputs> = yup.object({
	citys: yup
		.mixed<SelOption[] | string>()
		.defined()
		.test('city-selected', 'Выберите город доставки', (value) => {
			if (Array.isArray(value)) {
				return Boolean(value[0]?.value && value[0].value !== '0')
			}

			if (typeof value === 'string') {
				return Boolean(value.trim() && value !== '0')
			}

			return false
		}),

	deliveryId: yup.string().ensure().required('Выберите способ доставки'),

	paymentId: yup.string().ensure().required('Выберите способ оплаты'),

	firstname: yup
		.string()
		.ensure()
		.required('Введите имя')
		.min(2, 'Имя должно содержать минимум 2 символа')
		.max(30, 'Имя не должно превышать 30 символов')
		.matches(/^[а-яА-ЯёЁa-zA-Z\s-]+$/, 'Имя может содержать только буквы, пробел и дефис'),

	surname: yup
		.string()
		.ensure()
		.required('Введите фамилию')
		.min(2, 'Фамилия должна содержать минимум 2 символа')
		.max(30, 'Фамилия не должна превышать 30 символов')
		.matches(/^[а-яА-ЯёЁa-zA-Z\s-]+$/, 'Фамилия может содержать только буквы, пробел и дефис'),

	email: yup.string().ensure().required('Введите почту').email('Введите корректный email адрес'),

	telphone: yup
		.string()
		.ensure()
		.required('Введите номер телефона')
		.test('phone-length', 'Номер телефона должен содержать 11 цифр', (value) => {
			const numbers = value.replace(/\D/g, '')

			return numbers.length === 11
		}),

	street: yup
		.string()
		.ensure()
		.when('deliveryId', {
			is: isDeliveryAddressRequired,
			then: (schema) =>
				schema
					.required('Введите улицу')
					.min(2, 'Улица должна содержать минимум 2 символа')
					.max(100, 'Улица не должна превышать 100 символов'),
			otherwise: (schema) => schema,
		}),

	dom: yup
		.string()
		.ensure()
		.when('deliveryId', {
			is: isDeliveryAddressRequired,
			then: (schema) => schema.required('Введите дом').max(20, 'Слишком длинное значение'),
			otherwise: (schema) => schema,
		}),

	room: yup
		.string()
		.ensure()
		.when('deliveryId', {
			is: isDeliveryAddressRequired,
			then: (schema) =>
				schema.required('Введите квартиру или офис').max(20, 'Слишком длинное значение'),
			otherwise: (schema) => schema,
		}),

	comment: yup.string().ensure().max(500, 'Комментарий не должен превышать 500 символов'),
})
