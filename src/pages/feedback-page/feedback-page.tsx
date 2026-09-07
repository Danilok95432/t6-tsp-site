/* eslint-disable @typescript-eslint/naming-convention */
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, type SubmitHandler, FormProvider } from 'react-hook-form'
import { Container } from 'src/shared/ui/Container/Container'
import { FlexRow } from 'src/shared/ui/FlexRow/FlexRow'
import { MainButton } from 'src/shared/ui/MainButton/MainButton'
import { Section } from 'src/shared/ui/Section/section'
import { ControlledInput } from 'src/widgets/controlled-input/controlled-input'

import styles from './index.module.scss'
import {
	useGetFeedBackInfoQuery,
	useSaveFeedbackInfoMutation,
} from 'src/features/auth/api/auth.api'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { ControlledSelect } from 'src/widgets/controlled-select/controlled-select'
import { type FeedbackInputs, feedbackInputsSchema } from './schema'
import { BreadCrumbs } from 'src/widgets/breadcrumbs/bread-crumbs'
import { useNavigate } from 'react-router-dom'

export const FeedbackPage = () => {
	const { data } = useGetFeedBackInfoQuery(null)
	const [saveFeedbackInfo] = useSaveFeedbackInfoMutation()
	const navigate = useNavigate()
	const methods = useForm<FeedbackInputs>({
		mode: 'onBlur',
		resolver: yupResolver(feedbackInputsSchema),
	})
	const onSubmit: SubmitHandler<FeedbackInputs> = async (data) => {
		const formData = new FormData()
		formData.append('fio', data.fio)
		formData.append('email', data.email)
		formData.append('telphone', data.telphone)
		formData.append('message', data.message)
		formData.append(
			'id_message_theme',
			typeof data.message_themes === 'string'
				? data.message_themes
				: data.message_themes
					? data.message_themes[0].value
					: '0',
		)
		const res = await saveFeedbackInfo(formData)
		if (res && 'data' in res) {
			toast.success('Обратная связь успешно отправлена')
			navigate('/')
		} else {
			toast.error('Ошибка при сохранении данных')
		}
	}

	useEffect(() => {
		if (data) {
			methods.reset({
				...data,
			})
		}
	}, [data])

	return (
		<Section className={styles.regSection}>
			<Container className={styles.regCont}>
				<BreadCrumbs crumbsLinksMap={[{ title: 'Обратная связь', link: 'feedback' }]} />
				<h1 className={styles.title}>Обратная связь</h1>
				<FormProvider {...methods}>
					<form
						className={styles.form}
						onSubmit={methods.handleSubmit(onSubmit)}
						noValidate
						autoComplete='off'
					>
						<ControlledInput name='fio' label='Имя*' margin='0 0 32px 0' />
						<ControlledInput name='email' label='Email*' margin='0 0 32px 0' />
						<ControlledInput name='telphone' label='Телефон*' margin='0 0 32px 0' isPhone />
						<ControlledSelect
							name='message_themes'
							label='Тема обращения *'
							selectOptions={data?.message_themes ?? []}
							margin='0 0 32px 0'
						/>
						<ControlledInput
							name='message'
							label='Текст обращения *'
							margin='0 0 32px 0'
							isTextarea
						/>
						<FlexRow className={styles.controlsWrapper}>
							<FlexRow className={styles.controls}>
								<MainButton type='submit' className={styles.enterBtn}>
									Отправить
								</MainButton>
							</FlexRow>
						</FlexRow>
					</form>
				</FormProvider>
			</Container>
		</Section>
	)
}
