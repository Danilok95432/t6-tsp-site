/* eslint-disable @typescript-eslint/naming-convention */
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, type SubmitHandler, FormProvider } from 'react-hook-form'
import { useAdditionalCrumbs } from 'src/app/store/hooks/additionalCrumbs'
import { type LkInputs, lkInputsSchema } from './schema'
import { Container } from 'src/shared/ui/Container/Container'
import { FlexRow } from 'src/shared/ui/FlexRow/FlexRow'
import { MainButton } from 'src/shared/ui/MainButton/MainButton'
import { Section } from 'src/shared/ui/Section/section'
import { ControlledCheckbox } from 'src/widgets/controlled-checkbox/controlled-checkbox'
import { ControlledInput } from 'src/widgets/controlled-input/controlled-input'

import styles from './index.module.scss'
import {
	useGetPersonalInfoQuery,
	useLogoutUserMutation,
	useSavePersonalInfoMutation,
} from 'src/features/auth/api/auth.api'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { booleanToNumberString } from 'src/shared/helpers/utils'
import { ControlledSelect } from 'src/widgets/controlled-select/controlled-select'
import { useNavigate } from 'react-router-dom'

export const InfoPage = () => {
	const { data } = useGetPersonalInfoQuery(null)
	const [logout] = useLogoutUserMutation()
	const [savePersonalInfo] = useSavePersonalInfoMutation()
	useAdditionalCrumbs('Личные данные')
	const navigate = useNavigate()
	const methods = useForm<LkInputs>({
		mode: 'onBlur',
		resolver: yupResolver(lkInputsSchema),
		defaultValues: {
			password: '',
			password2: '',
		},
	})
	const onSubmit: SubmitHandler<LkInputs> = async (data) => {
		const formData = new FormData()
		formData.append('firstname', data.firstname)
		formData.append('fathname', data.fathname ?? '')
		formData.append('surname', data.surname)
		formData.append('email', data.email)
		formData.append('telphone', data.telphone)
		formData.append('password', data.password ?? '')
		formData.append('password2', data.password2 ?? '')
		formData.append('use_spam', booleanToNumberString(data.use_spam))
		formData.append('use_company', booleanToNumberString(data.use_company))
		formData.append(
			'citys',
			typeof data.citys === 'string' ? data.citys : data.citys ? data.citys[0].value : '0',
		)
		formData.append('street', data.street ?? '')
		formData.append('dom', data.dom ?? '')
		formData.append('room', data.room ?? '')
		if (data.use_company) {
			formData.append('org_name', data.org_name ?? '')
		}
		const res = await savePersonalInfo(formData)
		if (res && 'data' in res) {
			toast.success('Данные успешно сохранены')
			if (data.password && data.password2) {
				await logout({})
				localStorage.removeItem('token')
				localStorage.removeItem('userID')
				navigate('/auth')
			}
		} else {
			toast.error('Ошибка при сохранении данных')
		}
	}

	const orgChecked = methods.watch('use_company')

	useEffect(() => {
		if (data) {
			const citysOptions = data.citys ?? []
			const cityOption = citysOptions.find((el) => Number(el.value) === Number(data.citys_id))
			const { citys_id, citys, ...restData } = data
			methods.reset({
				citys: cityOption ? [cityOption] : [],
				...restData,
			})
		}
	}, [data])

	return (
		<Section className={styles.regSection}>
			<Container className={styles.regCont}>
				<h1 className={styles.title}>Личные данные</h1>
				<FormProvider {...methods}>
					<form
						className={styles.form}
						onSubmit={methods.handleSubmit(onSubmit)}
						noValidate
						autoComplete='off'
					>
						<ControlledInput name='surname' label='Фамилия*' margin='0 0 32px 0' />
						<ControlledInput name='firstname' label='Имя*' margin='0 0 32px 0' />
						<ControlledInput name='fathname' label='Отчество' margin='0 0 32px 0' />
						<ControlledInput name='email' label='Email*' margin='0 0 32px 0' />
						<ControlledInput name='telphone' label='Телефон*' margin='0 0 32px 0' isPhone />
						<ControlledCheckbox
							name='use_company'
							label='Я представляю организацию'
							type='checkbox'
							$margin='0 0 32px 0'
						/>
						<FlexRow className={styles.orgBlock}>
							{orgChecked && (
								<ControlledInput
									name='org_name'
									label='Название организации*'
									margin='0 0 32px 0'
									className={styles.input}
								/>
							)}
							<ControlledSelect
								name='citys'
								label='Город*'
								selectOptions={data?.citys ?? []}
								margin='0 0 32px 0'
								className={styles.input}
							/>
							<ControlledInput
								name='street'
								label='Улица*'
								margin='0 0 32px 0'
								className={styles.input}
							/>
							<FlexRow className={styles.orgRow}>
								<ControlledInput
									name='dom'
									label='Дом*'
									margin='0 0 32px 0'
									className={styles.input}
								/>
								<ControlledInput
									name='room'
									label='Квартира/офис'
									margin='0 0 32px 0'
									className={styles.input}
								/>
							</FlexRow>
						</FlexRow>
						<FlexRow className={styles.inputRow}>
							<ControlledInput
								name='password'
								label='Новый пароль'
								type='password'
								className={styles.input}
								margin='0 0 32px 0'
							/>
						</FlexRow>
						<FlexRow className={styles.inputRow}>
							<ControlledInput
								name='password2'
								label='Подтверждение нового пароля*'
								type='password'
								className={styles.input}
							/>
						</FlexRow>
						<FlexRow className={styles.controlsWrapper}>
							<ControlledCheckbox
								name='use_spam'
								label='Хочу получать новости на почту'
								type='checkbox'
							/>
							<FlexRow className={styles.controls}>
								<MainButton className={styles.cancelBtn}>Отмена</MainButton>
								<MainButton type='submit' className={styles.enterBtn}>
									Сохранить изменения
								</MainButton>
							</FlexRow>
						</FlexRow>
					</form>
				</FormProvider>
			</Container>
		</Section>
	)
}
