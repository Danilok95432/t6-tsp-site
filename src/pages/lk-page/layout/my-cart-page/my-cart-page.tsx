import { useEffect, useMemo, useState, type KeyboardEvent, type MouseEvent } from 'react'
import { FormProvider, type FieldValues, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { Container } from 'src/shared/ui/Container/Container'
import { Section } from 'src/shared/ui/Section/section'
import { FlexRow } from 'src/shared/ui/FlexRow/FlexRow'
import { MainButton } from 'src/shared/ui/MainButton/MainButton'
import { ControlledInput } from 'src/widgets/controlled-input/controlled-input'

import { useAdditionalCrumbs } from 'src/app/store/hooks/additionalCrumbs'
import { AppRoute } from 'src/app/router/consts'

import {
	useAddItemToCartMutation,
	useClearCartMutation,
	useDeleteItemFromCartMutation,
	useGetItemsCartQuery,
} from 'src/features/catalog/api/catalog.api'

import { MinusSVG } from 'src/shared/ui/icons/minusSvg'
import { PlusSVG } from 'src/shared/ui/icons/plusSVG'

import skeleton from 'src/assets/img/candy(2).png'
import cn from 'classnames'
import styles from './index.module.scss'
import { DeleteItemFromCartSVG } from 'src/shared/ui/icons/deleteItemFromCartSVG'
import { useActions } from 'src/app/store/hooks/actions'
import { ConfirmWindow } from 'src/modals/confirmActionModal/confirmActionModal'
import { type ImageItemWithText } from 'src/types/photos'
import { FeedBackBlock } from 'src/widgets/feedback-block/feedback-block'

export interface CartListItem {
	id_item: string
	item_name: string
	item_count: string
	item_price: string
	item_fullprice: string
	img: ImageItemWithText[]
	category_id: string
	use_weight?: string | number | boolean
	weight_default?: string | number
	weight_one?: string | number
	weight_price_kg?: string | number
	item_weight?: string | number
	cart_weight?: string | number
	item_cart_weight?: string | number
	cart_item_weight?: string | number
}

export interface CartListItemsResponse {
	items: CartListItem[]
	cart_price: string
}

type CartCounterFormValues = Record<string, string>

type CartMutationResponse = {
	status?: string
	errortext?: string
	item_count?: string
	item_weight?: string
	cart_weight?: string
	weight?: string
}

const MAX_ITEM_COUNT = 99
const MAX_WEIGHT_GRAMS = 10000
const MAX_WEIGHT_ERROR = 'Больше 10 000 гр. по весу нельзя'

const getCounterName = (idItem: string) => `counter_${idItem}`

const getNumber = (value: unknown): number => {
	const normalizedValue = String(value ?? '')
		.replace(/\s/g, '')
		.replace(/[^\d.,-]/g, '')
		.replace(',', '.')

	const numberValue = Number(normalizedValue)

	return Number.isFinite(numberValue) ? numberValue : 0
}

const getPositiveNumber = (...values: unknown[]): number => {
	for (const value of values) {
		const numberValue = getNumber(value)

		if (numberValue > 0) return numberValue
	}

	return 0
}

const getBoolean = (value: unknown): boolean => {
	return value === true || value === 'true' || value === 1 || value === '1'
}

const roundUpToMultiplicity = (value: number, multiplicity: number): number => {
	if (value <= 0 || multiplicity <= 0) return 0

	return Math.ceil(value / multiplicity) * multiplicity
}

const getCartItemCount = (item: CartListItem): number => {
	const itemCount = getNumber(item.item_count)

	return Number.isFinite(itemCount) ? Math.max(0, itemCount) : 0
}

const getCartItemWeight = (item: CartListItem): number => {
	return getPositiveNumber(
		item.item_weight,
		item.cart_weight,
		item.item_cart_weight,
		item.cart_item_weight,
	)
}

const getWeightStep = (item: CartListItem): number => {
	return getPositiveNumber(item.weight_one, item.weight_default)
}

const getResponseWeight = (
	response: CartMutationResponse | undefined,
	fallbackWeight: number,
): number => {
	const responseWeight = getPositiveNumber(
		response?.item_weight,
		response?.cart_weight,
		response?.weight,
	)

	return responseWeight > 0 ? responseWeight : Math.max(0, fallbackWeight)
}

const formatPrice = (value: string | number) => {
	const normalizedValue = String(value)
		.replace(/\s/g, '')
		.replace(/[^\d.,-]/g, '')
		.replace(',', '.')

	const numberValue = Number(normalizedValue)

	if (Number.isNaN(numberValue)) {
		return `${value} ₽`
	}

	return `${numberValue.toLocaleString('ru-RU', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})} ₽`
}

export const MyCartPage = () => {
	useAdditionalCrumbs('Моя корзина')

	const navigate = useNavigate()
	const { openModal } = useActions()
	const userID = localStorage.getItem('userID') ?? ''

	const { data, isLoading, isFetching } = useGetItemsCartQuery(userID ?? '')

	const [addItemToCart] = useAddItemToCartMutation()
	const [deleteItemFromCart] = useDeleteItemFromCartMutation()
	const [clearCart] = useClearCartMutation()

	const [updatingItemId, setUpdatingItemId] = useState<string | null>(null)
	const [isClearing, setIsClearing] = useState(false)

	const methods = useForm<CartCounterFormValues>({
		mode: 'onBlur',
	})

	const { getValues, setValue } = methods

	const cartData = data as CartListItemsResponse | undefined

	const cartItems = useMemo(() => {
		return cartData?.items ?? []
	}, [cartData])

	useEffect(() => {
		cartItems.forEach((item) => {
			const isWeightProduct = getBoolean(item.use_weight)
			const counterValue = isWeightProduct ? getCartItemWeight(item) : getCartItemCount(item)

			setValue(getCounterName(item.id_item), String(counterValue), {
				shouldDirty: false,
				shouldValidate: false,
			})
		})
	}, [cartItems, setValue])

	const createAddFormData = (idItem: string, count: string, itemWeight?: string | number) => {
		const formData = new FormData()

		if (userID) {
			formData.append('id_user', userID)
		}

		formData.append('id_item', idItem)
		formData.append('item_count', count)

		if (itemWeight !== undefined) {
			formData.append('item_weight', String(itemWeight))
		}

		return formData
	}

	const createDeleteFormData = (idItem: string) => {
		const formData = new FormData()

		if (userID) {
			formData.append('id_user', userID)
		}

		formData.append('id_item', idItem)

		return formData
	}

	const createClearDeleteFormData = () => {
		const formData = new FormData()

		if (userID) {
			formData.append('id_user', userID)
		}

		return formData
	}

	const resetCounterInput = (item: CartListItem) => {
		const isWeightProduct = getBoolean(item.use_weight)
		const counterValue = isWeightProduct ? getCartItemWeight(item) : getCartItemCount(item)

		setValue(getCounterName(item.id_item), String(counterValue), {
			shouldDirty: false,
			shouldValidate: false,
		})
	}

	const changeCartItemCount = async (item: CartListItem, count: string) => {
		const delta = Number(count)
		const currentCount = getCartItemCount(item)
		const nextCount = currentCount + delta
		const counterName = getCounterName(item.id_item)

		if (!Number.isFinite(delta) || delta === 0) return
		if (delta < 0 && currentCount <= 0) return

		if (nextCount > MAX_ITEM_COUNT) {
			toast.error('Не более 99 единиц одного товара в одном заказе')

			setValue(counterName, String(MAX_ITEM_COUNT), {
				shouldDirty: false,
				shouldValidate: false,
			})

			return
		}

		if (nextCount < 0) {
			resetCounterInput(item)
			return
		}

		const updateCartItemCount = async () => {
			try {
				setUpdatingItemId(item.id_item)

				const response = (await addItemToCart(
					createAddFormData(item.id_item, count) as unknown as FieldValues,
				).unwrap()) as CartMutationResponse

				if (response?.status === 'error') {
					console.error('Ошибка при изменении товара в корзине:', response.errortext)
					resetCounterInput(item)
					return
				}

				setValue(counterName, String(nextCount), {
					shouldDirty: false,
					shouldValidate: false,
				})
			} catch (error) {
				console.error('Ошибка при изменении товара в корзине:', error)
				resetCounterInput(item)
			} finally {
				setUpdatingItemId(null)
			}
		}

		if (delta < 0 && nextCount === 0) {
			resetCounterInput(item)

			openModal(
				<ConfirmWindow
					text='Вы действительно хотите удалить товар из корзины? Отменить это действие будет нельзя'
					submitHandle={() => {
						void updateCartItemCount()
					}}
					link='/lk/cart'
				/>,
			)

			return
		}

		await updateCartItemCount()
	}

	const changeCartItemWeight = async (
		item: CartListItem,
		weightDelta: number,
		baseWeight?: number,
		options: { skipMaxWeightToast?: boolean } = {},
	) => {
		const weightStep = getWeightStep(item)
		const counterName = getCounterName(item.id_item)
		const formWeight = getNumber(getValues(counterName))
		const currentWeight = baseWeight ?? (formWeight > 0 ? formWeight : getCartItemWeight(item))
		let nextWeight = currentWeight + weightDelta

		if (weightStep <= 0) return
		if (!Number.isFinite(weightDelta) || weightDelta === 0) return
		if (weightDelta < 0 && currentWeight <= 0) return

		if (nextWeight < 0) {
			resetCounterInput(item)
			return
		}

		if (nextWeight > MAX_WEIGHT_GRAMS) {
			nextWeight = MAX_WEIGHT_GRAMS

			if (!options.skipMaxWeightToast) {
				toast.error(MAX_WEIGHT_ERROR)
			}
		}

		const nextWeightDelta = nextWeight - currentWeight

		if (nextWeightDelta === 0) {
			setValue(counterName, String(nextWeight), {
				shouldDirty: false,
				shouldValidate: false,
			})
			return
		}

		const updateCartItemWeight = async () => {
			try {
				setUpdatingItemId(item.id_item)

				const response = (await addItemToCart(
					createAddFormData(item.id_item, '1', nextWeightDelta) as unknown as FieldValues,
				).unwrap()) as CartMutationResponse

				if (response?.status === 'error') {
					console.error('Ошибка при изменении веса товара в корзине:', response.errortext)
					resetCounterInput(item)
					return
				}

				setValue(counterName, String(getResponseWeight(response, nextWeight)), {
					shouldDirty: false,
					shouldValidate: false,
				})
			} catch (error) {
				console.error('Ошибка при изменении веса товара в корзине:', error)
				resetCounterInput(item)
			} finally {
				setUpdatingItemId(null)
			}
		}

		if (nextWeightDelta < 0 && nextWeight <= 0) {
			resetCounterInput(item)

			openModal(
				<ConfirmWindow
					text='Вы действительно хотите удалить товар из корзины? Отменить это действие будет нельзя'
					submitHandle={() => {
						void updateCartItemWeight()
					}}
					link='/lk/cart'
				/>,
			)

			return
		}

		await updateCartItemWeight()
	}

	const handleIncrease = async (e: MouseEvent, item: CartListItem, value: string) => {
		e.preventDefault()
		e.stopPropagation()

		if (getBoolean(item.use_weight)) {
			await changeCartItemWeight(item, Number(value))
			return
		}

		await changeCartItemCount(item, value)
	}

	const handleCounterBlur = async (item: CartListItem) => {
		const counterName = getCounterName(item.id_item)
		const isWeightProduct = getBoolean(item.use_weight)
		const currentValue = isWeightProduct ? getCartItemWeight(item) : getCartItemCount(item)
		const weightStep = getWeightStep(item)

		const rawValue = String(getValues(counterName) ?? '')
		const normalizedValue = rawValue.replace(/\D/g, '')

		if (!normalizedValue) {
			resetCounterInput(item)
			return
		}

		let nextValue = Number(normalizedValue)

		if (!Number.isFinite(nextValue) || nextValue < 0) {
			resetCounterInput(item)
			return
		}

		if (isWeightProduct) {
			if (weightStep <= 0) {
				resetCounterInput(item)
				return
			}

			let isMaxWeightExceeded = nextValue > MAX_WEIGHT_GRAMS

			nextValue = roundUpToMultiplicity(nextValue, weightStep)

			if (nextValue > MAX_WEIGHT_GRAMS) {
				isMaxWeightExceeded = true
				nextValue = MAX_WEIGHT_GRAMS
			}

			if (isMaxWeightExceeded) {
				toast.error(MAX_WEIGHT_ERROR)
			}

			if (nextValue === currentValue) {
				setValue(counterName, String(currentValue), {
					shouldDirty: false,
					shouldValidate: false,
				})
				return
			}

			setValue(counterName, String(nextValue), {
				shouldDirty: false,
				shouldValidate: false,
			})

			await changeCartItemWeight(item, nextValue - currentValue, currentValue, {
				skipMaxWeightToast: true,
			})
			return
		}

		if (nextValue > MAX_ITEM_COUNT) {
			toast.error('Не более 99 единиц одного товара в одном заказе')
			nextValue = MAX_ITEM_COUNT

			setValue(counterName, String(MAX_ITEM_COUNT), {
				shouldDirty: false,
				shouldValidate: false,
			})
		}

		if (nextValue === currentValue) {
			setValue(counterName, String(currentValue), {
				shouldDirty: false,
				shouldValidate: false,
			})
			return
		}

		await changeCartItemCount(item, String(nextValue - currentValue))
	}

	const handleRemoveFromCart = async (e: MouseEvent, item: CartListItem) => {
		e.preventDefault()
		e.stopPropagation()

		openModal(
			<ConfirmWindow
				text='Вы действительно хотите удалить товар из корзины? Отменить это действие будет нельзя'
				submitHandle={() => {
					const removeItem = async () => {
						try {
							setUpdatingItemId(item.id_item)

							await deleteItemFromCart(
								createDeleteFormData(item.id_item) as unknown as FieldValues,
							).unwrap()
						} catch (error) {
							console.error('Ошибка при удалении товара из корзины:', error)
						} finally {
							setUpdatingItemId(null)
						}
					}

					void removeItem()
				}}
				link='/lk/cart'
			/>,
		)
	}

	const handleClearCart = () => {
		openModal(
			<ConfirmWindow
				text='Вы действительно хотите удалить все товары из корзины? Отменить это действие будет нельзя'
				submitHandle={() => {
					const clearItems = async () => {
						try {
							setIsClearing(true)
							await clearCart(createClearDeleteFormData()).unwrap()
						} catch (error) {
							console.error('Ошибка при очистке корзины:', error)
						} finally {
							setIsClearing(false)
						}
					}

					void clearItems()
				}}
				link='/lk/cart'
			/>,
		)
	}

	return (
		<FormProvider {...methods}>
			<Section className={styles.section}>
				<Container className={styles.cont}>
					<h1 className={styles.title}>Моя корзина</h1>

					<FlexRow className={styles.clearRow}>
						<MainButton
							type='button'
							className={styles.clearBtn}
							onClick={handleClearCart}
							disabled={isClearing || cartItems.length === 0}
						>
							{isClearing ? 'Очищаем...' : 'Очистить корзину'}
						</MainButton>
					</FlexRow>

					<FlexRow className={styles.cartRow}>
						{isLoading ? (
							<p>Загрузка корзины...</p>
						) : cartItems.length === 0 ? (
							<p>Корзина пуста</p>
						) : (
							cartItems.map((item) => {
								const isWeightProduct = getBoolean(item.use_weight)
								const weightStep = getWeightStep(item)
								const count = getCartItemCount(item)
								const itemWeight = getCartItemWeight(item)
								const hasCartValue = isWeightProduct ? itemWeight > 0 : count > 0
								const price = isWeightProduct
									? getPositiveNumber(item.weight_price_kg, item.item_price)
									: item.item_price
								const isItemUpdating = updatingItemId === item.id_item

								return (
									<FlexRow className={styles.elementRow} key={item.id_item}>
										<div
											className={styles.deleteVectorMobile}
											onClick={async (e) => await handleRemoveFromCart(e, item)}
										>
											<DeleteItemFromCartSVG isMobile />
										</div>
										<Link
											to={`/catalog/${item.category_id}/item/${item.id_item}`}
											className={styles.linkRowCart}
										>
											<FlexRow className={styles.contentRow}>
												<img
													className={styles.img}
													src={item.img && item.img.length > 0 ? item.img[0].original : skeleton}
													alt=''
												/>

												<p className={styles.title}>{item.item_name}</p>
											</FlexRow>
										</Link>

										<FlexRow className={styles.infoRow}>
											<FlexRow className={styles.priceRow}>
												<p className={styles.price}>{formatPrice(price)}</p>
												<p>{isWeightProduct ? 'цена за 1 кг' : 'цена за 1 шт.'}</p>
											</FlexRow>

											<div
												className={cn(styles.smallBuyBtn, styles.mobileBuyBtn, {
													[styles.filled]: hasCartValue,
													[styles.loading]: isItemUpdating,
													[styles.disabled]: isItemUpdating || isFetching,
												})}
											>
												<FlexRow className={styles.counterCart}>
													<div
														className={styles.vector}
														onClick={async (e) => {
															if (isItemUpdating || isFetching) return
															if (isWeightProduct && weightStep <= 0) return

															await handleIncrease(
																e,
																item,
																isWeightProduct ? String(-weightStep) : '-1',
															)
														}}
													>
														<MinusSVG color='#C09F3D' />
													</div>

													<div
														className={styles.counterInputWrapper}
														onMouseDown={(e) => {
															e.stopPropagation()
														}}
														onClick={(e) => {
															e.preventDefault()
															e.stopPropagation()
														}}
													>
														<ControlledInput
															name={getCounterName(item.id_item)}
															type='number'
															className={styles.counterInput}
															margin='0'
															onBlur={() => {
																void handleCounterBlur(item)
															}}
															onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
																e.stopPropagation()

																if (e.key === 'Enter') {
																	e.preventDefault()
																	e.currentTarget.blur()
																}
															}}
															disabled={isItemUpdating || isFetching}
														/>
													</div>

													{isWeightProduct && <p className={styles.gramm}>гр.</p>}

													<div
														className={styles.vector}
														onClick={async (e) => {
															if (isItemUpdating || isFetching) return
															if (isWeightProduct && weightStep <= 0) return

															await handleIncrease(
																e,
																item,
																isWeightProduct ? String(weightStep) : '1',
															)
														}}
													>
														<PlusSVG color='#C09F3D' />
													</div>
												</FlexRow>
											</div>

											<p className={styles.totalPrice}>{formatPrice(item.item_fullprice)}</p>

											<div
												className={styles.deleteVector}
												onClick={async (e) => await handleRemoveFromCart(e, item)}
											>
												<DeleteItemFromCartSVG />
											</div>
										</FlexRow>
									</FlexRow>
								)
							})
						)}
					</FlexRow>

					<FlexRow className={styles.resultRow}>
						<p>Итого:</p>

						<FlexRow className={styles.resultPriceRow}>
							<p className={styles.price}>{formatPrice(cartData?.cart_price ?? 0)}</p>
						</FlexRow>

						<MainButton
							type='button'
							className={styles.submitBtn}
							disabled={cartItems.length === 0}
							onClick={() => navigate(`/lk/${AppRoute.LKcart}`)}
						>
							Оформить заказ
						</MainButton>
					</FlexRow>
					<FeedBackBlock fullScreenMode />
				</Container>
			</Section>
		</FormProvider>
	)
}
