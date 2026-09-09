import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { Container } from 'src/shared/ui/Container/Container'
import { Section } from 'src/shared/ui/Section/section'

import styles from './index.module.scss'
import {
	type RequestFormInputs,
	requestFormSchema,
	requestFormDefaultValues,
} from 'src/shared/sections/RequestSection/schema'
import { ControlledCheckbox } from 'src/widgets/controlled-checkbox/controlled-checkbox'
import { ControlledInput } from 'src/widgets/controlled-input/controlled-input'

export const SolutionRequestSection = () => {
	const methods = useForm<RequestFormInputs>({
		resolver: yupResolver(requestFormSchema),
		defaultValues: requestFormDefaultValues,
	})

	const onSubmit: SubmitHandler<RequestFormInputs> = (data) => {
		console.log(data)
	}

	return (
		<Section id='request' className={styles.section}>
			<Container>
				<div className={styles.wrapper}>
					<h2 className={styles.title}>Оставьте заявку, и мы с вами свяжемся</h2>

					<FormProvider {...methods}>
						<form className={styles.form} onSubmit={methods.handleSubmit(onSubmit)}>
							<ControlledInput
								name='name'
								placeholder='Как к вам обращаться? *'
								className={styles.input}
							/>

							<div className={styles.contacts}>
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
								height='120px'
								className={styles.input}
							/>

							<div className={styles.checkboxes}>
								<ControlledCheckbox
									name='messenger'
									type='checkbox'
									customLabel={
										<span className={styles.checkboxLabel}>Напишите мне в мессенджер</span>
									}
								/>

								<ControlledCheckbox
									name='privacy'
									type='checkbox'
									customLabel={
										<span className={styles.checkboxLabel}>
											Я соглашаюсь с{' '}
											<a href='/privacy' onClick={(event) => event.stopPropagation()}>
												политикой конфиденциальности
											</a>{' '}
											и правилами обработки персональных данных
										</span>
									}
								/>
							</div>

							<button type='submit' className={styles.submit}>
								Отправить заявку
							</button>
						</form>
					</FormProvider>
				</div>
			</Container>
		</Section>
	)
}
