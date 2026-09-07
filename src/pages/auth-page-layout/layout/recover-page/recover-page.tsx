import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'

import { Container } from 'src/shared/ui/Container/Container'
import { Section } from 'src/shared/ui/Section/section'
import { MainButton } from 'src/shared/ui/MainButton/MainButton'
import { ControlledInput } from 'src/widgets/controlled-input/controlled-input'
import { AppRoute } from 'src/app/router/consts'
import { FlexRow } from 'src/shared/ui/FlexRow/FlexRow'

import { type RecoverInputs, recoverInputsSchema } from './schema'
import styles from './index.module.scss'
import { useRegRecoverMutation } from 'src/features/auth/api/auth.api'

type RecoverStep = 'email' | 'code' | 'password'

export const RecoverPage = () => {
	const navigate = useNavigate()
	const [regRecover] = useRegRecoverMutation()
	const [step, setStep] = useState<RecoverStep>('email')
	const [isLoading, setIsLoading] = useState(false)

	const methods = useForm<RecoverInputs>({
		mode: 'onBlur',
		resolver: yupResolver(recoverInputsSchema),
		defaultValues: {
			email: '',
			code: '',
			password: '',
			repeat_password: '',
		},
	})

	const { trigger, getValues, handleSubmit } = methods

	const sendRecoverCode = async () => {
		const isValid = await trigger('email')

		if (!isValid) {
			return
		}

		const data = getValues()

		try {
			setIsLoading(true)
			const formData = new FormData()
			formData.append('email', data.email)
			await regRecover(formData).unwrap()
			toast.success(
				'Перейдите по ссылке, отправленной на почтовый ящик, для продолжения восстановления пароля',
			)
			setStep('code')
		} catch {
			toast.error('Ошибка. Введенный email не найден')
		} finally {
			setIsLoading(false)
			navigate(`/auth`)
		}
	}

	const onSubmit: SubmitHandler<RecoverInputs> = async (data) => {
		if (step !== 'password') {
			return
		}

		try {
			setIsLoading(true)

			console.log('Запрос на смену пароля:', {
				email: data.email,
				code: data.code,
				password: data.password,
				repeat_password: data.repeat_password,
			})

			toast.success('Пароль успешно изменён')
			navigate(`/auth`)
		} catch {
			toast.error('Не удалось изменить пароль')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Section className={styles.authSection}>
			<Container className={styles.authCont}>
				<h1 className={styles.title}>Восстановление пароля</h1>

				<FormProvider {...methods}>
					<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
						{step === 'email' && (
							<FlexRow className={styles.step}>
								<ControlledInput
									className={styles.input}
									name='email'
									type='email'
									placeholder='Введите почту'
								/>
								<FlexRow className={styles.linksRow}>
									<Link className={styles.link} to={`${AppRoute.AUTH}`}>
										Вернуться к авторизации
									</Link>
									<MainButton
										className={styles.enterBtn}
										type='button'
										onClick={sendRecoverCode}
										disabled={isLoading}
									>
										Получить код
									</MainButton>
								</FlexRow>
							</FlexRow>
						)}
					</form>
				</FormProvider>
			</Container>
		</Section>
	)
}
