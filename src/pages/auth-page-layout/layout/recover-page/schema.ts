import * as yup from 'yup'

export type RecoverInputs = {
	email: string
	code: string
	password: string
	repeat_password: string
}

export const recoverInputsSchema: yup.ObjectSchema<RecoverInputs> = yup.object({
	email: yup.string().required('Введите почту').email('Введите корректную почту'),

	code: yup
		.string()
		.required('Введите код восстановления')
		.matches(/^[0-9]{4,6}$/, 'Код должен содержать от 4 до 6 цифр'),

	password: yup
		.string()
		.required('Введите новый пароль')
		.min(6, 'Пароль должен содержать минимум 6 символов'),

	repeat_password: yup
		.string()
		.required('Повторите новый пароль')
		.oneOf([yup.ref('password')], 'Пароли не совпадают'),
})
