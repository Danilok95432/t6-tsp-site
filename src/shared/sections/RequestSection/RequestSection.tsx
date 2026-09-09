import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { Container } from 'src/shared/ui/Container/Container'
import { Section } from 'src/shared/ui/Section/section'

import { requestFormDefaultValues, requestFormSchema, type RequestFormInputs } from './schema'

import styles from './index.module.scss'
import { ControlledCheckbox } from 'src/widgets/controlled-checkbox/controlled-checkbox'
import { ControlledInput } from 'src/widgets/controlled-input/controlled-input'
import { MailIconSVG } from 'src/shared/ui/icons/mailIconSVG'

export const RequestSection = () => {
	const methods = useForm<RequestFormInputs>({
		resolver: yupResolver(requestFormSchema),
		defaultValues: requestFormDefaultValues,
		mode: 'onSubmit',
	})

	const {
		handleSubmit,
		formState: { isSubmitting },
	} = methods

	const onSubmit: SubmitHandler<RequestFormInputs> = (data) => {
		console.log(data)
	}

	return (
		<Section id='request' className={styles.requestSection}>
			<Container>
				<div className={styles.wrapper}>
					<div className={styles.info}>
						<h2 className={styles.title}>
							Оставьте заявку,
							<br />и мы с вами свяжемся
						</h2>

						<p className={styles.description}>
							По вопросам разработки индивидуального
							<br />
							решения отправьте запрос на почту:
						</p>

						<a className={styles.emailLink} href='mailto:info@info.ru'>
							<MailIconSVG />

							<span>info@info.ru</span>
						</a>
					</div>

					<FormProvider {...methods}>
						<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
							<ControlledInput
								name='name'
								placeholder='Как к вам обращаться? *'
								className={styles.input}
							/>

							<div className={styles.contactsRow}>
								<ControlledInput
									name='email'
									type='email'
									placeholder='Электронная почта'
									className={styles.input}
								/>

								<ControlledInput
									name='phone'
									isPhone
									placeholder='Номер телефона *'
									className={styles.input}
								/>
							</div>

							<ControlledInput
								name='comment'
								isTextarea
								placeholder='Комментарий'
								className={styles.textarea}
								height='88px'
							/>

							<div className={styles.checkboxes}>
								<ControlledCheckbox
									name='messenger'
									type='checkbox'
									className={styles.checkbox}
									customLabel={
										<span className={styles.checkboxText}>Напишите мне в мессенджер</span>
									}
								/>

								<ControlledCheckbox
									name='privacy'
									type='checkbox'
									className={styles.checkbox}
									customLabel={
										<span className={styles.checkboxText}>
											Я соглашаюсь с{' '}
											<a href='/privacy' onClick={(event) => event.stopPropagation()}>
												политикой конфиденциальности
											</a>{' '}
											и{' '}
											<a href='/personal-data' onClick={(event) => event.stopPropagation()}>
												правилами обработки персональных данных
											</a>
										</span>
									}
								/>
							</div>

							<button type='submit' className={styles.submitBtn} disabled={isSubmitting}>
								Отправить заявку
							</button>
						</form>
					</FormProvider>
				</div>
			</Container>
		</Section>
	)
}
