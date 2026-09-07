import { useEffect, useMemo, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, useWatch, useForm, type SubmitHandler } from 'react-hook-form'

import { Container } from 'src/shared/ui/Container/Container'
import { Section } from 'src/shared/ui/Section/section'
import { FlexRow } from 'src/shared/ui/FlexRow/FlexRow'
import { MainButton } from 'src/shared/ui/MainButton/MainButton'
import { ControlledInput } from 'src/widgets/controlled-input/controlled-input'
import { ControlledSelect } from 'src/widgets/controlled-select/controlled-select'

import styles from './index.module.scss'
import { orderInputsSchema, type OrderInputs } from './schema'
import { type EditSection } from 'src/types/order'
import { DeliveryCard } from './components/delivery-card/delivery-card'
import { OrderStep } from './components/order-step/order-step'
import { OrderSummary } from './components/order-summary/order-summary'
import { PaymentCard } from './components/payment-card/payment-card'
import {
	useCreatePaymentMutation,
	useGetItemsCartQuery,
	useGetLkInfoForOrderQuery,
	useSaveOrderInfoMutation,
} from 'src/features/catalog/api/catalog.api'
import { userID } from 'src/shared/helpers/consts'
import { type SelOption } from 'src/types/select'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppRoute } from 'src/app/router/consts'
import { FeedBackBlock } from 'src/widgets/feedback-block/feedback-block'
import { useGetSearchCityQuery } from 'src/features/settings/api/settings.api'
import { useDebounce } from 'src/shared/helpers/utils'
import { loadYookassaWidget } from 'src/shared/helpers/loadYookassaWidget'

const defaultValues: OrderInputs = {
	citys: [],
	deliveryId: '',
	paymentId: '',
	firstname: '',
	surname: '',
	email: '',
	telphone: '',
	street: '',
	dom: '',
	room: '',
	comment: '',
}

type SelectOptionLike = {
	label?: string
	value?: string
}

type SelectFieldValue = string | SelectOptionLike[] | undefined

const getSelectValue = (value: SelectFieldValue) => {
	if (Array.isArray(value)) {
		return value[0]?.value ?? ''
	}

	return value ?? ''
}

const getSelectLabel = (value: SelectFieldValue, options: SelOption[] = []) => {
	if (Array.isArray(value)) {
		return value[0]?.label ?? ''
	}

	return options.find((option) => option.value === value)?.label ?? value ?? ''
}

export const CartPage = () => {
	const { data } = useGetItemsCartQuery(userID)
	const { data: orderData } = useGetLkInfoForOrderQuery(userID)
	const [citySearch, setCitySearch] = useState('')

	const debouncedCitySearch = useDebounce(citySearch.trim(), 400)

	const { data: citysData, isFetching: isCitysFetching } = useGetSearchCityQuery(
		debouncedCitySearch,
		{
			skip: debouncedCitySearch.length < 3,
		},
	)
	const [saveOrder] = useSaveOrderInfoMutation()

	const methods = useForm<OrderInputs>({
		mode: 'onBlur',
		resolver: yupResolver(orderInputsSchema),
		defaultValues,
	})

	const {
		handleSubmit,
		setValue,
		trigger,
		getValues,
		reset,
		formState: { errors },
	} = methods

	const [editingSection, setEditingSection] = useState<EditSection>('region')
	const [createdOrderId, setCreatedOrderId] = useState<string | number | null>(null)

	const values = useWatch({
		control: methods.control,
	})

	const cartItems = data?.items ?? []

	const itemsTotal = useMemo(() => {
		return cartItems.reduce((acc, item) => {
			if (item.use_weight) return acc + Number(item.item_fullprice)
			else return acc + Number(item.item_price) * Number(item.item_count)
		}, 0)
	}, [cartItems])

	const cityValue = getSelectValue(values.citys ?? [])
	const cityLabel = getSelectLabel(values.citys ?? [], orderData?.citys)

	const selectedDelivery = orderData?.delivery.find((item) => item.value === values.deliveryId)

	const selectedPayment = orderData?.payments.find((item) => item.value === values.paymentId)

	const deliveryPrice = selectedDelivery?.price ? Number(selectedDelivery.price) : 0
	const totalPrice = itemsTotal + 0

	const isRegionFilled = Boolean(cityValue && cityValue !== '0')
	const isDeliveryFilled = Boolean(values.deliveryId)
	const isPaymentFilled = Boolean(values.paymentId)

	const isAddressRequired = values.deliveryId === '1'

	const isAddressFilled =
		!isAddressRequired ||
		(Boolean(values.street?.trim()) &&
			Boolean(values.dom?.trim()) &&
			Boolean(values.room?.trim()) &&
			!errors.street &&
			!errors.dom &&
			!errors.room)

	const isCustomerFilled =
		Boolean(values.firstname?.trim()) &&
		Boolean(values.surname?.trim()) &&
		Boolean(values.email?.trim()) &&
		Boolean(values.telphone?.trim()) &&
		!errors.firstname &&
		!errors.surname &&
		!errors.email &&
		!errors.telphone &&
		isAddressFilled

	const isOrderReady = isRegionFilled && isDeliveryFilled && isPaymentFilled && isCustomerFilled

	const navigate = useNavigate()
	const onSubmit: SubmitHandler<OrderInputs> = async (data) => {
		const formData = new FormData()

		formData.append('id_city', cityValue)
		formData.append('id_order_payment', data.paymentId)
		formData.append('id_order_delivery', data.deliveryId)
		formData.append('surname', data.surname)
		formData.append('firstname', data.firstname)
		formData.append('email', data.email)
		formData.append('telphone', data.telphone)
		formData.append('street', data.street)
		formData.append('dom', data.dom ?? '')
		formData.append('room', data.room ?? '')
		formData.append('comment', data.comment)

		try {
			setCreatedOrderId(null)

			const res = await saveOrder(formData).unwrap()

			if (data.paymentId !== '1') {
				toast.success('Заказ оформлен. Информацию о заказе можно найти в личном кабинете')
				navigate(`${AppRoute.LK}/${AppRoute.LKcart}/success`)
				return
			}

			const orderId = res.id

			if (!orderId) {
				toast.error('Заказ оформлен, но сервер не вернул id заказа')
				return
			}

			setCreatedOrderId(orderId)
			setEditingSection(null)
			toast.success('Заказ оформлен. Доступна оплата заказа')
		} catch (e) {
			toast.error('Ошибка при попытке оформления заказа. Попробуйте ещё раз')
		}
	}

	const [createPayment, { isLoading: isPaymentLoading }] = useCreatePaymentMutation()

	const handlePayOrder = async (id?: string | number) => {
		if (!id) return

		try {
			const formData = new FormData()
			formData.append('id_order', String(id))

			const payment = await createPayment(formData).unwrap()

			await loadYookassaWidget()

			if (!window.YooMoneyCheckoutWidget) {
				throw new Error('Виджет ЮKassa не загружен')
			}

			const successUrl = `${window.location.origin}${AppRoute.LK}/${AppRoute.LKcart}/success?paid=true`

			const checkout = new window.YooMoneyCheckoutWidget({
				confirmation_token: payment.confirmation_token,

				return_url: successUrl,

				customization: {
					modal: true,
				},

				error_callback: (error) => {
					console.error('Ошибка виджета ЮKassa:', error)
					toast.error('Ошибка при открытии формы оплаты')
				},
			})

			checkout.on('success', () => {
				checkout.destroy()
				navigate(`${AppRoute.LK}/${AppRoute.LKcart}/success?paid=true`)
			})

			checkout.on('modal_close', () => {
				checkout.destroy()
			})

			await checkout.render()
		} catch (error) {
			console.error('Ошибка при оплате заказа:', error)
			toast.error('Ошибка при попытке оплаты заказа')
		}
	}

	const handleSaveRegion = async () => {
		const valid = await trigger('citys')

		if (!valid) return

		setEditingSection('delivery')
	}

	const handleSaveDelivery = async () => {
		const valid = await trigger('deliveryId')

		if (!valid) return

		setEditingSection('payment')
	}

	const handleSavePayment = async () => {
		const valid = await trigger('paymentId')

		if (!valid) return

		setEditingSection('customer')
	}

	const handleSaveCustomer = async () => {
		const valid = await trigger([
			'firstname',
			'surname',
			'email',
			'telphone',
			'street',
			'dom',
			'room',
			'comment',
		])

		if (!valid) return

		setEditingSection(null)
	}

	useEffect(() => {
		if (!orderData) return

		reset({
			...defaultValues,
			firstname: orderData.firstname ?? '',
			surname: orderData.surname ?? '',
			email: orderData.email ?? '',
			telphone: orderData.telphone ?? '',
			street: orderData.street ?? '',
			dom: orderData.dom ?? '',
			room: orderData.room ?? '',
			comment: orderData.comment ?? '',
			citys: [],
			deliveryId: '',
			paymentId: '',
		})
	}, [orderData, reset])

	return (
		<Section className={styles.section}>
			<Container className={styles.cont}>
				<h1 className={styles.title}>Оформление заказа</h1>

				<FormProvider {...methods}>
					<form
						className={styles.layout}
						onSubmit={handleSubmit(onSubmit)}
						noValidate
						autoComplete='off'
					>
						<div className={styles.main}>
							<OrderStep
								title='1. Регион доставки'
								isEditing={editingSection === 'region'}
								canEdit
								onEdit={() => setEditingSection('region')}
							>
								{editingSection === 'region' ? (
									<div className={styles.stepContent}>
										<ControlledSelect
											name='citys'
											label='Город доставки'
											isRequired
											selectOptions={debouncedCitySearch.length >= 3 ? citysData?.citys ?? [] : []}
											onSearchChange={setCitySearch}
											isLoading={isCitysFetching}
											margin='0 0 24px 0'
										/>

										<FlexRow className={styles.actionsRow}>
											<MainButton
												type='button'
												onClick={handleSaveRegion}
												className={styles.enterBtn}
											>
												Далее
											</MainButton>
										</FlexRow>
									</div>
								) : (
									<div className={styles.summaryText}>Город доставки: {cityLabel}</div>
								)}
							</OrderStep>

							{isRegionFilled && (
								<OrderStep
									title='2. Доставка'
									isEditing={editingSection === 'delivery'}
									canEdit={isDeliveryFilled}
									onEdit={() => setEditingSection('delivery')}
								>
									{editingSection === 'delivery' ? (
										<div className={styles.stepContent}>
											<div className={styles.cards}>
												{orderData?.delivery.map((option) => (
													<DeliveryCard
														key={option.value}
														option={option}
														active={values.deliveryId === option.value}
														onClick={() =>
															setValue('deliveryId', option.value, {
																shouldValidate: true,
																shouldDirty: true,
															})
														}
													/>
												))}
											</div>

											<FlexRow className={styles.actionsBetween}>
												<MainButton
													type='button'
													onClick={() => setEditingSection('region')}
													className={styles.backBtn}
												>
													Назад
												</MainButton>

												<MainButton
													type='button'
													onClick={handleSaveDelivery}
													className={styles.enterBtn}
												>
													Далее
												</MainButton>
											</FlexRow>
										</div>
									) : selectedDelivery ? (
										<DeliveryCard
											key={selectedDelivery.value}
											option={selectedDelivery}
											active={values.deliveryId === selectedDelivery.value}
											onClick={() =>
												setValue('deliveryId', selectedDelivery.value, {
													shouldValidate: true,
													shouldDirty: true,
												})
											}
										/>
									) : null}
								</OrderStep>
							)}

							{isDeliveryFilled && (
								<OrderStep
									title='3. Оплата'
									isEditing={editingSection === 'payment'}
									canEdit={isPaymentFilled}
									onEdit={() => setEditingSection('payment')}
								>
									{editingSection === 'payment' ? (
										<div className={styles.stepContent}>
											<div className={styles.cards}>
												{orderData?.payments.map((option) => (
													<PaymentCard
														key={option.value}
														option={option}
														active={values.paymentId === option.value}
														onClick={() =>
															setValue('paymentId', option.value, {
																shouldValidate: true,
																shouldDirty: true,
															})
														}
													/>
												))}
											</div>

											<FlexRow className={styles.actionsBetween}>
												<MainButton
													type='button'
													onClick={() => setEditingSection('delivery')}
													className={styles.backBtn}
												>
													Назад
												</MainButton>

												<MainButton
													type='button'
													onClick={handleSavePayment}
													className={styles.enterBtn}
												>
													Далее
												</MainButton>
											</FlexRow>
										</div>
									) : selectedPayment ? (
										<PaymentCard
											key={selectedPayment.value}
											option={selectedPayment}
											active={values.paymentId === selectedPayment.value}
											onClick={() =>
												setValue('paymentId', selectedPayment.value, {
													shouldValidate: true,
													shouldDirty: true,
												})
											}
										/>
									) : null}
								</OrderStep>
							)}

							{isPaymentFilled && (
								<OrderStep
									title='4. Покупатель'
									isEditing={editingSection === 'customer'}
									canEdit={isCustomerFilled}
									onEdit={() => setEditingSection('customer')}
								>
									{editingSection === 'customer' ? (
										<div className={styles.stepContent}>
											<FlexRow className={styles.formRow}>
												<ControlledInput
													name='firstname'
													label='Имя*'
													margin='0'
													className={styles.input}
												/>

												<ControlledInput
													name='surname'
													label='Фамилия*'
													margin='0'
													className={styles.input}
												/>

												<ControlledInput
													name='email'
													label='Email*'
													margin='0'
													className={styles.input}
												/>

												<ControlledInput
													name='telphone'
													label='Телефон*'
													margin='0'
													className={styles.input}
													isPhone
												/>
												{values.deliveryId === '1' && (
													<>
														<ControlledInput
															name='street'
															label='Улица'
															margin='0'
															className={styles.input}
														/>

														<ControlledInput
															name='dom'
															label='Дом'
															margin='0'
															className={styles.input}
														/>

														<ControlledInput
															name='room'
															label='Квартира / офис'
															margin='0'
															className={styles.input}
														/>
													</>
												)}

												<ControlledInput
													name='comment'
													label='Комментарий к заказу'
													margin='0'
													isTextarea
													height='200px'
													className={styles.input}
												/>
											</FlexRow>

											<FlexRow className={styles.actionsBetween}>
												<MainButton
													type='button'
													onClick={() => setEditingSection('payment')}
													className={styles.backBtn}
												>
													Назад
												</MainButton>

												<MainButton
													type='button'
													onClick={handleSaveCustomer}
													className={styles.enterBtn}
												>
													Далее
												</MainButton>
											</FlexRow>
										</div>
									) : isCustomerFilled ? (
										<div className={styles.customerSummary}>
											<div>Имя: {getValues('firstname')}</div>
											<div>Фамилия: {getValues('surname')}</div>
											<div>E-mail: {getValues('email')}</div>
											<div>Телефон: {getValues('telphone')}</div>
											<div>Улица: {getValues('street')}</div>
											<div>Дом: {getValues('dom')}</div>
											<div>Квартира / офис: {getValues('room')}</div>

											{getValues('comment') && <div>Комментарий: {getValues('comment')}</div>}
										</div>
									) : null}
								</OrderStep>
							)}

							<div className={styles.step}>
								<h2 className={styles.stepTitle}>5. Товары в заказе</h2>

								<div className={styles.items}>
									{cartItems.map((item) => (
										<Link
											key={item.id_item}
											to={`/catalog/${item.category_id}/item/${item.id_item}`}
											className={styles.itemRowLinkOrder}
										>
											<div key={item.id_item} className={styles.itemRow}>
												<div className={styles.itemName}>{item.item_name}</div>

												<div className={styles.itemQty}>
													{item.use_weight === '1'
														? `${item.item_weight} гр.`
														: `${item.item_count} шт.`}
												</div>

												<div className={styles.itemPrice}>
													{item.use_weight
														? Number(item.item_fullprice)
														: (Number(item.item_price) * Number(item.item_count)).toLocaleString(
																'ru-RU',
															)}{' '}
													₽
												</div>
											</div>
										</Link>
									))}
								</div>
							</div>

							{isOrderReady && (
								<FlexRow className={styles.submitRow}>
									<MainButton
										type='button'
										onClick={() => setEditingSection('customer')}
										className={styles.backBtn}
										disabled={Boolean(createdOrderId)}
									>
										Назад
									</MainButton>

									{createdOrderId && values.paymentId === '1' ? (
										<MainButton
											type='button'
											className={styles.submitBtn}
											onClick={() => {
												void handlePayOrder(createdOrderId)
											}}
											disabled={isPaymentLoading}
										>
											{isPaymentLoading ? 'Открываем оплату...' : 'Оплатить заказ'}
										</MainButton>
									) : (
										<MainButton type='submit' className={styles.submitBtn}>
											Оформить заказ
										</MainButton>
									)}
								</FlexRow>
							)}
						</div>

						<aside className={styles.sidebar}>
							<OrderSummary
								itemsTotal={String(itemsTotal)}
								deliveryPrice={String(deliveryPrice)}
								totalPrice={String(totalPrice)}
							/>
						</aside>
					</form>
					<FeedBackBlock fullScreenMode />
				</FormProvider>
			</Container>
		</Section>
	)
}
