import * as yup from 'yup'

export type OneItemInputs = {
	weight: string
}

export const oneItemInputsSchema: yup.ObjectSchema<OneItemInputs> = yup.object({
	weight: yup.string().required('').matches(/^\d+$/, 'Вес должен содержать только цифры'),
})
