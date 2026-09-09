import * as yup from 'yup'

export const requestFormSchema = yup.object({
	name: yup.string().trim().required('Введите имя'),

	email: yup.string().trim().email('Введите корректный адрес электронной почты'),

	phone: yup
		.string()
		.required('Введите номер телефона')
		.matches(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, 'Введите номер телефона полностью'),

	comment: yup.string().trim().max(1000, 'Комментарий не должен превышать 1000 символов'),

	messenger: yup.boolean().default(true),

	privacy: yup
		.boolean()
		.oneOf([true], 'Необходимо согласие на обработку персональных данных')
		.required(),
})

export type RequestFormInputs = yup.InferType<typeof requestFormSchema>

export const requestFormDefaultValues: RequestFormInputs = {
	name: '',
	email: '',
	phone: '',
	comment: '',
	messenger: true,
	privacy: true,
}
