import { useEffect, useRef } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Container } from 'src/shared/ui/Container/Container'
import { Section } from 'src/shared/ui/Section/section'

import styles from './index.module.scss'
import { AppRoute } from 'src/app/router/consts'
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form'
import { type AuthInputs, authInputsSchema } from './schema'
import { ControlledInput } from 'src/widgets/controlled-input/controlled-input'
import { yupResolver } from '@hookform/resolvers/yup'
import { FlexRow } from 'src/shared/ui/FlexRow/FlexRow'
import { MainButton } from 'src/shared/ui/MainButton/MainButton'
import { ControlledCheckbox } from 'src/widgets/controlled-checkbox/controlled-checkbox'
import { useBreakPoint } from 'src/features/useBreakPoint/useBreakPoint'
import { useActions } from 'src/app/store/hooks/actions'
import { useLoginUserMutation, useRegActivateRecoverMutation } from 'src/features/auth/api/auth.api'
import { toast } from 'react-toastify'
import { type LoginResponse, getErrorMessage } from '../registration-page/registration-page'
import { YandexSVG } from 'src/shared/ui/icons/yandexSVG'
import { VkSVG } from 'src/shared/ui/icons/vkSVG'
import { FeedBackBlock } from 'src/widgets/feedback-block/feedback-block'

type RecoverResponse = {
	status?: string
	errortext?: string
	error?: string
	message?: string
}

export const AuthPage = () => {
	const { setAuth, setUser } = useActions()

	const [loginUser] = useLoginUserMutation()
	const [regActivateRecover] = useRegActivateRecoverMutation()

	const breakPoint = useBreakPoint()
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()

	const recoveryRequestSentRef = useRef(false)

	const methods = useForm<AuthInputs>({
		mode: 'onBlur',
		resolver: yupResolver(authInputsSchema),
	})

	useEffect(() => {
		const act = searchParams.get('act')
		const username = searchParams.get('username')
		const recoverysekret = searchParams.get('recoverysekret')

		if (recoveryRequestSentRef.current) return
		if (act !== 'activate' || !username || !recoverysekret) return

		recoveryRequestSentRef.current = true

		const activateRecover = async () => {
			try {
				const recoverFormData = new FormData()

				recoverFormData.append('email', username)
				recoverFormData.append('recoverysekret', recoverysekret)

				const response = (await regActivateRecover(recoverFormData).unwrap()) as RecoverResponse

				if (response?.status === 'error') {
					toast.error(response.errortext ?? response.error ?? 'Ошибка восстановления пароля')
					return
				}

				toast.success('Пароль успешно изменен. Авторизуйтесь с новым паролем')
			} catch (error) {
				toast.error(getErrorMessage(error, 'Ошибка восстановления пароля'))
			} finally {
				navigate('/auth', { replace: true })
			}
		}

		void activateRecover()
	}, [searchParams, regActivateRecover, navigate])

	const onSubmit: SubmitHandler<AuthInputs> = async (data) => {
		try {
			const loginFormData = new FormData()

			loginFormData.append('user_name', data.user_name)
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
			toast.error(getErrorMessage(error, 'Ошибка регистрации или авторизации'))
		}
	}

	return (
		<Section className={styles.authSection}>
			<Container className={styles.authCont}>
				<h1 className={styles.title}>Авторизация</h1>

				<FormProvider {...methods}>
					<form
						className={styles.form}
						onSubmit={methods.handleSubmit(onSubmit)}
						noValidate
						autoComplete='off'
					>
						<ControlledInput name='user_name' label='Электронная почта' margin='0 0 32px 0' />

						<FlexRow className={styles.inputRow}>
							<ControlledInput
								name='password'
								label='Пароль'
								type='password'
								className={styles.input}
							/>
						</FlexRow>

						<FlexRow className={styles.dop}>
							<a href='/auth/recover'>Забыли пароль?</a>
							<ControlledCheckbox name='remember' label='Запомнить меня' type='checkbox' />
						</FlexRow>

						{breakPoint === 'S' && (
							<MainButton type='submit' className={styles.enterBtnMobile}>
								Войти
							</MainButton>
						)}

						<FlexRow className={styles.controlsWrapper}>
							<FlexRow className={styles.controls}>
								<MainButton type='submit' className={styles.enterBtn}>
									Войти
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
								<Link to={`${AppRoute.AUTH}/${AppRoute.REGISTRATION}`} className={styles.link}>
									Зарегистрироваться
								</Link>
							</FlexRow>
						</FlexRow>
						<FeedBackBlock />
					</form>
				</FormProvider>
			</Container>
		</Section>
	)
}
