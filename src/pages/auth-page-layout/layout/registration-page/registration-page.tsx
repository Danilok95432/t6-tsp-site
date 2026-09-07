import { Link, useNavigate } from 'react-router-dom'
import { Container } from 'src/shared/ui/Container/Container'
import { Section } from 'src/shared/ui/Section/section'

import styles from './index.module.scss'
import { useAdditionalCrumbs } from 'src/app/store/hooks/additionalCrumbs'
import { AppRoute } from 'src/app/router/consts'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, type SubmitHandler, FormProvider } from 'react-hook-form'
import { FlexRow } from 'src/shared/ui/FlexRow/FlexRow'
import { MainButton } from 'src/shared/ui/MainButton/MainButton'
import { ControlledCheckbox } from 'src/widgets/controlled-checkbox/controlled-checkbox'
import { ControlledInput } from 'src/widgets/controlled-input/controlled-input'
import { type RegInputs, regInputsSchema } from './schema'
import { booleanToNumberString } from 'src/shared/helpers/utils'
import { useActions } from 'src/app/store/hooks/actions'
import { useLoginUserMutation, useRegistrationUserMutation } from 'src/features/auth/api/auth.api'
import { toast } from 'react-toastify'
import { type User } from 'src/types/response'
import { VkSVG } from 'src/shared/ui/icons/vkSVG'
import { YandexSVG } from 'src/shared/ui/icons/yandexSVG'
import { FeedBackBlock } from 'src/widgets/feedback-block/feedback-block'

export type ServerError = {
	errortext?: string
	status?: string
}

export type LoginResponse = {
	token: string
	user: User
	errortext?: string
	status?: string
}

type RegistrationResponse = {
	status?: string
	errortext?: string
}

export const getErrorMessage = (error: unknown, fallback: string) => {
	if (
		error &&
		typeof error === 'object' &&
		'data' in error &&
		error.data &&
		typeof error.data === 'object' &&
		'errortext' in error.data
	) {
		return String((error.data as ServerError).errortext ?? fallback)
	}

	if (error instanceof Error) {
		return error.message
	}

	return fallback
}

export const RegistrationPage = () => {
	const { setAuth, setUser } = useActions()
	const [regUser] = useRegistrationUserMutation()
	const [loginUser] = useLoginUserMutation()

	useAdditionalCrumbs('Регистрация')

	const methods = useForm<RegInputs>({
		mode: 'onBlur',
		resolver: yupResolver(regInputsSchema),
	})

	const navigate = useNavigate()

	const onSubmit: SubmitHandler<RegInputs> = async (data) => {
		const formData = new FormData()
		formData.append('firstname', data.firstname)
		formData.append('surname', data.surname)
		formData.append('email', data.email)
		formData.append('telphone', data.telphone)
		formData.append('use_spam', booleanToNumberString(data.use_spam))
		formData.append('password', data.password)
		formData.append('password2', data.password2)

		try {
			const regResponse = (await regUser(formData).unwrap()) as RegistrationResponse

			if (regResponse.status !== 'ok') {
				toast.error(`Ошибка регистрации: ${regResponse.errortext ?? 'Ошибка регистрации'}`)
				return
			}

			toast.success('Регистрация прошла успешно')

			const loginFormData = new FormData()
			loginFormData.append('user_name', data.email)
			loginFormData.append('password', data.password)

			const loginResponse = (await loginUser(loginFormData).unwrap()) as LoginResponse

			if (!loginResponse.token || !loginResponse.user) {
				toast.error(`Ошибка авторизации: ${loginResponse.errortext ?? 'Ошибка авторизации'}`)
				return
			}

			localStorage.setItem('token', String(loginResponse.token))
			localStorage.setItem('userID', String(loginResponse.user.id))
			setAuth(true)
			setUser(loginResponse.user)

			toast.success('Авторизация прошла успешно')
			navigate('/lk')
		} catch (error) {
			toast.error(
				`Ошибка регистрации или авторизации: ${getErrorMessage(error, 'Ошибка регистрации или авторизации')}`,
			)
		}
	}

	return (
		<Section className={styles.regSection}>
			<Container className={styles.regCont}>
				<h1 className={styles.title}>Регистрация</h1>

				<FormProvider {...methods}>
					<form
						className={styles.form}
						onSubmit={methods.handleSubmit(onSubmit)}
						noValidate
						autoComplete='off'
					>
						<ControlledInput name='firstname' label='Имя*' margin='0 0 32px 0' />
						<ControlledInput name='surname' label='Фамилия*' margin='0 0 32px 0' />
						<ControlledInput name='email' label='Email*' margin='0 0 32px 0' />
						<ControlledInput name='telphone' label='Телефон*' margin='0 0 32px 0' isPhone />

						<FlexRow className={styles.inputRow}>
							<ControlledInput
								name='password'
								label='Пароль'
								type='password'
								className={styles.input}
								margin='0 0 32px 0'
							/>
						</FlexRow>

						<FlexRow className={styles.inputRow}>
							<ControlledInput
								name='password2'
								label='Подтверждение пароля*'
								type='password'
								className={styles.input}
								margin='0 0 32px 0'
							/>
						</FlexRow>

						<FlexRow className={styles.contolsBlock}>
							<ControlledCheckbox
								name='use_spam'
								label='Хочу получать новости на почту'
								type='checkbox'
							/>

							<FlexRow className={styles.controlsWrapper}>
								<FlexRow className={styles.controls}>
									<MainButton type='submit' className={styles.enterBtn}>
										Зарегистрироваться
									</MainButton>
									<FlexRow className={styles.socialsRow}>
										<MainButton type='submit' className={styles.enterSocials}>
											<YandexSVG />
											Войти с Яндекс ID
										</MainButton>
										<MainButton type='submit' className={styles.enterSocials}>
											<VkSVG />
											Войти через VK
										</MainButton>
									</FlexRow>
									<Link to={AppRoute.AUTH} className={styles.link}>
										Авторизоваться
									</Link>
								</FlexRow>
							</FlexRow>
							<FeedBackBlock />
						</FlexRow>
					</form>
				</FormProvider>
			</Container>
		</Section>
	)
}
