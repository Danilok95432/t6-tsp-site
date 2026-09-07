import {
	FormProvider,
	type SubmitHandler,
	useForm,
	type FieldValues,
	useWatch,
} from 'react-hook-form'
import {
	type KeyboardEvent,
	type MouseEvent,
	type RefObject,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Swiper, type SwiperRef, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import cn from 'classnames'

import { Container } from 'src/shared/ui/Container/Container'
import { FlexRow } from 'src/shared/ui/FlexRow/FlexRow'
import { Section } from 'src/shared/ui/Section/section'
import { MainButton } from 'src/shared/ui/MainButton/MainButton'
import { MinusSVG } from 'src/shared/ui/icons/minusSvg'
import { PlusSVG } from 'src/shared/ui/icons/plusSVG'

import { BreadCrumbs } from 'src/widgets/breadcrumbs/bread-crumbs'
import { SliderBtns } from 'src/widgets/Slider-btns/slider-btns'
import { ChocolateCard } from '../chocolate-list/components/chocolate-card/chocolate-card'

import { useAdditionalCrumbs } from 'src/app/store/hooks/additionalCrumbs'
import {
	useAddItemToCartMutation,
	useDeleteItemFromCartMutation,
	useGetCatalogQuery,
	useGetItemCatalogByIDQuery,
	useGetItemsCartQuery,
} from 'src/features/catalog/api/catalog.api'

import { sliderOptions } from './consts'
import styles from './index.module.scss'

import 'swiper/css'
import 'swiper/css/pagination'
import { type FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { toast } from 'react-toastify'
import { useActions } from 'src/app/store/hooks/actions'
import { ConfirmWindow } from 'src/modals/confirmActionModal/confirmActionModal'
import { Loader } from 'src/shared/ui/loader/loader'
import { FullscreenGallery } from 'src/widgets/fullscreen-gallery/fullscreen-gallery'
import { ControlledInput } from 'src/widgets/controlled-input/controlled-input'
import { yupResolver } from '@hookform/resolvers/yup'
import { type OneItemInputs, oneItemInputsSchema } from './schema'
import { getCatalogReturnUrl } from 'src/shared/helpers/catalog-return'

type CartResponse = {
	item_count?: string
	item_weight?: string
	cart_weight?: string
	weight?: string
	status: string
	errortext?: string
}

type WeightProductFields = {
	id_item?: unknown
	use_weight?: unknown
	weight_default?: unknown
	weight_one?: unknown
	weight_price_kg?: unknown
	cart_count?: unknown
	item_count?: unknown
	item_weight?: unknown
	cart_weight?: unknown
	item_cart_weight?: unknown
	cart_item_weight?: unknown
}

type ApiErrorResponse = {
	status: 'error'
	error: string
}

const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError => {
	return typeof error === 'object' && error !== null && 'status' in error
}

const getApiErrorMessage = (error: unknown): string => {
	if (isFetchBaseQueryError(error)) {
		const errorData = error.data as Partial<ApiErrorResponse> | undefined

		if (errorData?.status === 'error' && errorData?.error) {
			return errorData.error
		}
	}

	return 'Произошла ошибка при загрузке категории'
}

const getNumber = (value: unknown): number => {
	const normalizedValue = String(value ?? '')
		.replace(/\s/g, '')
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

const formatPrice = (value: number): string => {
	return `${Math.round(value).toLocaleString('ru-RU')} ₽`
}

const MAX_WEIGHT_GRAMS = 10000
const MAX_WEIGHT_ERROR = 'Больше 10 000 гр. по весу нельзя'

const roundUpToMultiplicity = (value: number, multiplicity: number): number => {
	if (value <= 0 || multiplicity <= 0) return 0

	return Math.ceil(value / multiplicity) * multiplicity
}

const getCartCount = (item?: WeightProductFields): number => {
	const itemCount = getNumber(item?.item_count ?? item?.cart_count)

	return Number.isFinite(itemCount) ? Math.max(0, itemCount) : 0
}

const getCartWeight = (item?: WeightProductFields): number => {
	return getPositiveNumber(
		item?.item_weight,
		item?.cart_weight,
		item?.item_cart_weight,
		item?.cart_item_weight,
	)
}

const getResponseWeight = (response: CartResponse | undefined, fallbackWeight: number): number => {
	const responseWeight = getPositiveNumber(
		response?.item_weight,
		response?.cart_weight,
		response?.weight,
	)

	return responseWeight > 0 ? responseWeight : Math.max(0, fallbackWeight)
}

const getDefinedResponseWeight = (response: CartResponse | undefined): number | undefined => {
	const responseWeight = response?.item_weight ?? response?.cart_weight ?? response?.weight

	if (responseWeight === undefined || responseWeight === null || responseWeight === '') {
		return undefined
	}

	return Math.max(0, getNumber(responseWeight))
}

export const ChocolateItem = () => {
	const { menuId = '', itemId = '' } = useParams()
	const navigate = useNavigate()
	const userID = localStorage.getItem('userID') ?? ''

	const {
		data,
		error: newsItemError,
		isLoading,
		isError: isNewsItemError,
	} = useGetItemCatalogByIDQuery({
		id: itemId,
		userId: userID,
	})

	const { data: catalogData } = useGetCatalogQuery({
		id: menuId,
		limit: '0',
		step: '1',
		userId: userID,
	})

	const { data: cartData } = useGetItemsCartQuery(userID ?? '')

	const methods = useForm<OneItemInputs>({
		mode: 'onBlur',
		resolver: yupResolver(oneItemInputsSchema),
		defaultValues: {
			weight: '',
		},
	})

	const weightValue = useWatch({
		control: methods.control,
		name: 'weight',
	})

	const swiperRef: RefObject<SwiperRef> = useRef<SwiperRef>(null)

	const chocolate = data
	const cartItem = useMemo(() => {
		const items = (cartData as { items?: WeightProductFields[] } | undefined)?.items ?? []

		return items.find((item) => String(item.id_item) === String(itemId))
	}, [cartData, itemId])

	useAdditionalCrumbs(chocolate?.title)

	const { openModal } = useActions()

	const [addItemToCart] = useAddItemToCartMutation()
	const [deleteItemFromCart] = useDeleteItemFromCartMutation()

	const [cartCount, setCartCount] = useState<number>(0)
	const [cartWeight, setCartWeight] = useState<number>(0)
	const [isCartUpdating, setIsCartUpdating] = useState<boolean>(false)
	const [isFullscreenOpen, setIsFullscreenOpen] = useState(false)
	const [fullscreenInitialSlide, setFullscreenInitialSlide] = useState(0)

	const images = useMemo(() => {
		return [...(chocolate?.images?.filter((image) => Boolean(image?.original)) ?? [])].reverse()
	}, [chocolate?.images])

	const weightProductFields = chocolate as WeightProductFields | undefined
	const isWeightProduct = getBoolean(weightProductFields?.use_weight)
	const defaultWeight = getNumber(weightProductFields?.weight_default)
	const weightStep = getPositiveNumber(weightProductFields?.weight_one, defaultWeight)
	const weightPriceKg = getNumber(weightProductFields?.weight_price_kg)
	const cartItemCount = getCartCount(cartItem)
	const cartItemWeight = getCartWeight(cartItem)
	const hasWeightCartValue = cartCount > 0 || cartWeight > 0
	const rawWeight = getNumber(weightValue)
	const selectedWeight = isWeightProduct
		? rawWeight > 0
			? Math.min(rawWeight, MAX_WEIGHT_GRAMS)
			: cartWeight > 0
				? Math.min(cartWeight, MAX_WEIGHT_GRAMS)
				: Math.min(defaultWeight, MAX_WEIGHT_GRAMS)
		: 0

	const calculatedWeightPrice =
		isWeightProduct && selectedWeight > 0 && weightPriceKg > 0
			? (weightPriceKg / 1000) * selectedWeight
			: 0

	const displayedPrice = isWeightProduct
		? hasWeightCartValue
			? calculatedWeightPrice
			: weightPriceKg
		: getNumber(chocolate?.item_price)

	const hasPrice = displayedPrice > 0

	useEffect(() => {
		if (!isNewsItemError) return

		const message = getApiErrorMessage(newsItemError)

		toast.error(message, {
			toastId: `news-error-${menuId}`,
		})

		navigate('/', { replace: true })
	}, [isNewsItemError, newsItemError, navigate, menuId])

	useEffect(() => {
		if (isWeightProduct) {
			const nextCartCount = cartItemCount
			const nextCartWeight = cartItemWeight
			const nextWeightValue = nextCartWeight > 0 ? nextCartWeight : defaultWeight

			setCartCount(nextCartCount)
			setCartWeight(nextCartWeight)

			if (nextWeightValue > 0) {
				methods.setValue('weight', String(nextWeightValue), {
					shouldDirty: false,
					shouldValidate: true,
				})
			}

			return
		}

		setCartCount(getCartCount(weightProductFields))
	}, [cartItemCount, cartItemWeight, defaultWeight, isWeightProduct, methods, weightProductFields])

	const onSubmit: SubmitHandler<OneItemInputs> = async () => {}
	const catalogReturnPath = useMemo(() => {
		return getCatalogReturnUrl(menuId)
	}, [menuId])

	if (!data || isLoading) return <Loader />

	if (!chocolate) return null

	const hasImages = images.length > 0
	const hasMoreItems = chocolate.moreitems && chocolate.moreitems.length > 0
	const hasWeight = !isWeightProduct && Number(chocolate.item_weight) > 0
	const hasFull = Boolean(chocolate.full)
	const hasComposition = Boolean(chocolate.item_desc)

	const openFullscreen = (index: number) => {
		setFullscreenInitialSlide(index)
		setIsFullscreenOpen(true)
	}

	const createAddFormData = (count: string, itemWeight?: string | number) => {
		const formData = new FormData()

		if (userID) {
			formData.append('id_user', userID)
		}

		formData.append('id_item', itemId)
		formData.append('item_count', count)

		if (itemWeight !== undefined) {
			formData.append('item_weight', String(itemWeight))
		}

		return formData
	}

	const createDeleteFormData = () => {
		const formData = new FormData()

		if (userID) {
			formData.append('id_user', userID)
		}

		formData.append('id_item', itemId)

		return formData
	}

	const setWeightFieldValue = (
		value: number,
		options: { shouldDirty?: boolean; shouldValidate?: boolean } = {},
	) => {
		if (!isWeightProduct) return

		const fallbackWeight = defaultWeight > 0 ? Math.min(defaultWeight, MAX_WEIGHT_GRAMS) : 0
		const nextValue = value > 0 ? Math.min(value, MAX_WEIGHT_GRAMS) : fallbackWeight

		methods.setValue('weight', String(nextValue), {
			shouldDirty: options.shouldDirty ?? true,
			shouldValidate: options.shouldValidate ?? true,
		})
	}

	const getCurrentWeight = () => {
		const currentWeight = getNumber(methods.getValues('weight'))
		const fallbackWeight = defaultWeight > 0 ? Math.min(defaultWeight, MAX_WEIGHT_GRAMS) : 0

		return currentWeight > 0 ? Math.min(currentWeight, MAX_WEIGHT_GRAMS) : fallbackWeight
	}

	const handleQuantityCartChange = async (e: MouseEvent, countValue: string) => {
		e.preventDefault()
		e.stopPropagation()

		const delta = Number(countValue)

		if (isCartUpdating || (delta < 0 && cartCount <= 0)) return

		const updateCart = async () => {
			try {
				setIsCartUpdating(true)

				const response = (await addItemToCart(
					createAddFormData(countValue) as unknown as FieldValues,
				).unwrap()) as CartResponse

				if (response?.status === 'error') {
					console.error('Ошибка при изменении товара в корзине:', response.errortext)
					return
				}

				setCartCount((prev) => {
					const nextCount = Number(response?.item_count)

					if (Number.isFinite(nextCount)) {
						return Math.max(0, nextCount)
					}

					return Math.max(0, prev + delta)
				})
			} catch (error) {
				console.error('Ошибка при изменении товара в корзине:', error)
			} finally {
				setIsCartUpdating(false)
			}
		}

		if (delta < 0 && cartCount === 1) {
			openModal(
				<ConfirmWindow
					text='Вы действительно хотите удалить товар из корзины? Отменить это действие будет нельзя'
					submitHandle={updateCart}
					link={`/catalog/${menuId}/item/${itemId}`}
				/>,
			)

			return
		}

		await updateCart()
	}

	const updateWeightInCart = async (nextWeight: number) => {
		const currentCartWeight = cartWeight > 0 ? cartWeight : 0
		const limitedNextWeight = Math.min(Math.max(0, nextWeight), MAX_WEIGHT_GRAMS)
		const weightDelta = limitedNextWeight - currentCartWeight

		if (!Number.isFinite(weightDelta) || weightDelta === 0) {
			setWeightFieldValue(limitedNextWeight)
			return
		}

		try {
			setIsCartUpdating(true)

			const response = (await addItemToCart(
				createAddFormData('0', weightDelta) as unknown as FieldValues,
			).unwrap()) as CartResponse

			if (response?.status === 'error') {
				console.error('Ошибка при изменении веса товара в корзине:', response.errortext)
				return
			}

			const responseCount = getNumber(response?.item_count)
			const nextCartWeight = getResponseWeight(response, limitedNextWeight)

			setCartCount((prev) => {
				if (response?.item_count !== undefined && Number.isFinite(responseCount)) {
					return Math.max(0, responseCount)
				}

				return nextCartWeight > 0 ? Math.max(1, prev) : 0
			})
			setCartWeight(nextCartWeight)
			setWeightFieldValue(nextCartWeight)
		} catch (error) {
			console.error('Ошибка при изменении веса товара в корзине:', error)
		} finally {
			setIsCartUpdating(false)
		}
	}

	const removeWeightItemFromCart = async () => {
		try {
			setIsCartUpdating(true)

			await deleteItemFromCart(createDeleteFormData() as unknown as FieldValues).unwrap()

			setCartCount(0)
			setCartWeight(0)
			setWeightFieldValue(defaultWeight, {
				shouldDirty: false,
				shouldValidate: true,
			})
		} catch (error) {
			console.error('Ошибка при удалении весового товара из корзины:', error)
			setWeightFieldValue(cartWeight > 0 ? cartWeight : defaultWeight, {
				shouldDirty: false,
				shouldValidate: true,
			})
		} finally {
			setIsCartUpdating(false)
		}
	}

	const handleWeightCartChange = async (e: MouseEvent, weightDelta: number) => {
		e.preventDefault()
		e.stopPropagation()

		if (!isWeightProduct || weightStep <= 0 || isCartUpdating) return

		const currentWeight = getCurrentWeight()

		if (!hasWeightCartValue) {
			if (weightDelta > 0) {
				await handleAddWeightToCart(e)
				return
			}

			const minWeight = weightStep > 0 ? weightStep : defaultWeight
			const nextWeight = Math.max(minWeight, currentWeight + weightDelta)

			setWeightFieldValue(nextWeight)
			return
		}

		if (weightDelta < 0 && currentWeight <= 0) return

		let nextWeight = Math.max(0, currentWeight + weightDelta)

		if (nextWeight > MAX_WEIGHT_GRAMS) {
			nextWeight = MAX_WEIGHT_GRAMS
			toast.error(MAX_WEIGHT_ERROR)
		}

		if (weightDelta < 0 && nextWeight <= 0) {
			openModal(
				<ConfirmWindow
					text='Вы действительно хотите удалить товар из корзины? Отменить это действие будет нельзя'
					submitHandle={() => {
						void removeWeightItemFromCart()
					}}
					link={`/catalog/${menuId}/item/${itemId}`}
				/>,
			)

			return
		}

		setWeightFieldValue(nextWeight)
		await updateWeightInCart(nextWeight)
	}

	const handleWeightInputBlur = async () => {
		if (!isWeightProduct) return

		const rawValue = String(methods.getValues('weight') ?? '')
		const normalizedValue = rawValue.replace(/\D/g, '')

		if (!normalizedValue) {
			setWeightFieldValue(defaultWeight, {
				shouldDirty: false,
				shouldValidate: true,
			})
			return
		}

		let nextWeight = Number(normalizedValue)

		if (!Number.isFinite(nextWeight) || nextWeight < 0) {
			setWeightFieldValue(defaultWeight, {
				shouldDirty: false,
				shouldValidate: true,
			})
			return
		}

		if (nextWeight === 0) {
			setWeightFieldValue(cartWeight > 0 ? cartWeight : defaultWeight, {
				shouldDirty: false,
				shouldValidate: true,
			})

			if (hasWeightCartValue) {
				openModal(
					<ConfirmWindow
						text='Вы действительно хотите удалить товар из корзины? Отменить это действие будет нельзя'
						submitHandle={() => {
							void removeWeightItemFromCart()
						}}
						link={`/catalog/${menuId}/item/${itemId}`}
					/>,
				)
			}

			return
		}

		let isMaxWeightExceeded = nextWeight > MAX_WEIGHT_GRAMS

		if (weightStep > 0) {
			nextWeight = roundUpToMultiplicity(nextWeight, weightStep)
		}

		if (nextWeight > MAX_WEIGHT_GRAMS) {
			isMaxWeightExceeded = true
			nextWeight = MAX_WEIGHT_GRAMS
		}

		if (isMaxWeightExceeded) {
			toast.error(MAX_WEIGHT_ERROR)
		}

		setWeightFieldValue(nextWeight, {
			shouldDirty: false,
			shouldValidate: true,
		})

		if (!hasWeightCartValue || nextWeight === cartWeight) return

		await updateWeightInCart(nextWeight)
	}

	const handleAddWeightToCart = async (e: MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()

		if (!isWeightProduct || isCartUpdating) return

		const isValid = await methods.trigger('weight')

		if (!isValid) return

		const rawCurrentWeight = getNumber(methods.getValues('weight'))
		let currentWeight = getCurrentWeight()

		if (rawCurrentWeight > MAX_WEIGHT_GRAMS) {
			toast.error(MAX_WEIGHT_ERROR)
		}

		currentWeight = Math.min(currentWeight, MAX_WEIGHT_GRAMS)
		setWeightFieldValue(currentWeight)

		if (currentWeight <= 0) return

		try {
			setIsCartUpdating(true)

			const response = (await addItemToCart(
				createAddFormData('1', currentWeight) as unknown as FieldValues,
			).unwrap()) as CartResponse

			if (response?.status === 'error') {
				console.error('Ошибка при добавлении весового товара в корзину:', response.errortext)
				return
			}

			const responseCount = getNumber(response?.item_count)
			const responseWeight = getDefinedResponseWeight(response)
			let nextCartWeight = getResponseWeight(response, currentWeight)

			if (responseWeight === undefined || responseWeight <= 0) {
				const weightResponse = (await addItemToCart(
					createAddFormData('0', currentWeight) as unknown as FieldValues,
				).unwrap()) as CartResponse

				if (weightResponse?.status === 'error') {
					console.error(
						'Ошибка при установке веса весового товара в корзине:',
						weightResponse.errortext,
					)
					return
				}

				nextCartWeight = getResponseWeight(weightResponse, currentWeight)
			}

			setCartCount(
				response?.item_count !== undefined && Number.isFinite(responseCount)
					? Math.max(1, responseCount)
					: 1,
			)
			setCartWeight(nextCartWeight)
			setWeightFieldValue(nextCartWeight)
		} catch (error) {
			console.error('Ошибка при добавлении весового товара в корзину:', error)
		} finally {
			setIsCartUpdating(false)
		}
	}

	return (
		<Section className={styles.chocolatePage}>
			<FormProvider {...methods}>
				<form
					className={styles.form}
					onSubmit={methods.handleSubmit(onSubmit)}
					noValidate
					autoComplete='off'
				>
					<Container className={styles.cont}>
						<FlexRow className={styles.headRow}>
							<BreadCrumbs
								crumbsLinksMap={[
									{
										title: catalogData?.title ?? 'Шоколад',
										link: 'catalog',
									},
								]}
								isCatalog
								idLink={menuId}
								catalogReturnPath={catalogReturnPath}
							/>
						</FlexRow>

						<FlexRow className={styles.previewProduct}>
							{hasImages && (
								<FlexRow className={styles.slider}>
									<Swiper
										{...sliderOptions}
										ref={swiperRef}
										className={styles.sliderMain}
										modules={[Pagination]}
										pagination={{ clickable: true }}
									>
										{images.map((slideEl, idx) => {
											return (
												<SwiperSlide key={`${slideEl.original}-${idx}`}>
													<FlexRow className={styles.slideRow}>
														<button
															type='button'
															className={styles.imgWrapper}
															onClick={() => openFullscreen(idx)}
															aria-label='Открыть изображение в полноэкранном режиме'
														>
															<img
																className={styles.sliderImg}
																src={slideEl.original}
																alt={chocolate.title ?? 'image'}
															/>
														</button>
													</FlexRow>
												</SwiperSlide>
											)
										})}
									</Swiper>

									{images.length > 1 && (
										<SliderBtns className={styles.sliderBtns} swiperRef={swiperRef} />
									)}
								</FlexRow>
							)}

							{!hasImages && <div className={styles.noSlider}></div>}

							<FlexRow className={styles.infoWrapper}>
								<FlexRow className={styles.info}>
									{chocolate.title && <p className={styles.title}>{chocolate.title}</p>}

									{hasWeight && <p className={styles.weight}>{`${chocolate.item_weight} гр.`}</p>}

									{hasFull && (
										<div
											className={styles.desc}
											dangerouslySetInnerHTML={{ __html: chocolate.full }}
										/>
									)}

									{hasComposition && (
										<p className={styles.composition}>{`Состав: ${chocolate.item_desc}`}</p>
									)}

									{hasComposition && (
										<p className={styles.composition}>
											{chocolate.item_width !== '0' &&
											chocolate.item_height !== '0' &&
											chocolate.item_length !== '0'
												? `Размер упаковки: ${chocolate.item_width}х${chocolate.item_height}х${chocolate.item_length} мм`
												: `Размеры не указаны`}
										</p>
									)}
								</FlexRow>

								<FlexRow className={styles.buySection}>
									{hasPrice && <p className={styles.price}>{formatPrice(displayedPrice)}</p>}

									{isWeightProduct ? (
										<div
											className={cn(styles.mobileBuyBtn, {
												[styles.filled]: hasWeightCartValue,
												[styles.default]: !hasWeightCartValue,
												[styles.loading]: isCartUpdating,
												[styles.disabled]: isCartUpdating,
											})}
											onClick={async (e: MouseEvent) => {
												e.preventDefault()
												e.stopPropagation()

												if (!hasWeightCartValue && !isCartUpdating) {
													await handleAddWeightToCart(e)
												}
											}}
										>
											{hasWeightCartValue ? (
												<FlexRow className={styles.counterCart}>
													<div
														className={styles.vector}
														onClick={async (e: MouseEvent) =>
															await handleWeightCartChange(e, -weightStep)
														}
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
															name='weight'
															type='number'
															className={styles.counterInput}
															margin='0'
															onBlur={() => {
																void handleWeightInputBlur()
															}}
															onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
																e.stopPropagation()

																if (e.key === 'Enter') {
																	e.preventDefault()
																	e.currentTarget.blur()
																}
															}}
															disabled={isCartUpdating}
														/>
													</div>

													<p className={styles.gramm}>гр.</p>

													<div
														className={styles.vector}
														onClick={async (e: MouseEvent) =>
															await handleWeightCartChange(e, weightStep)
														}
													>
														<PlusSVG color='#C09F3D' />
													</div>
												</FlexRow>
											) : (
												<p>В корзину</p>
											)}
										</div>
									) : (
										<MainButton
											type='button'
											className={cn(styles.buyButton, {
												[styles.filled]: cartCount > 0,
												[styles.loading]: isCartUpdating,
											})}
											disabled={isCartUpdating}
											onClick={(e: MouseEvent) => {
												e.preventDefault()
												e.stopPropagation()
											}}
										>
											{cartCount === 0 ? (
												<p
													className={styles.btnText}
													onClick={async (e: MouseEvent) => await handleQuantityCartChange(e, '1')}
												>
													В корзину
												</p>
											) : (
												<FlexRow className={styles.counterCart}>
													<div
														className={styles.vector}
														onClick={async (e: MouseEvent) =>
															await handleQuantityCartChange(e, '-1')
														}
													>
														<MinusSVG />
													</div>

													<p>{cartCount}</p>

													<div
														className={styles.vector}
														onClick={async (e: MouseEvent) =>
															await handleQuantityCartChange(e, '1')
														}
													>
														<PlusSVG />
													</div>
												</FlexRow>
											)}
										</MainButton>
									)}
								</FlexRow>
							</FlexRow>
						</FlexRow>

						{hasMoreItems && (
							<FlexRow className={styles.alsoItems}>
								<p className={styles.subtitle}>Попробуйте также</p>

								<div className={styles.alsoList}>
									{chocolate.moreitems.map((el) => {
										return (
											<ChocolateCard
												key={el.id}
												chocolate={el}
												className={styles.alsoCard}
												smallCard
											/>
										)
									})}
								</div>
							</FlexRow>
						)}
					</Container>

					{isFullscreenOpen && (
						<FullscreenGallery
							images={images}
							initialSlide={fullscreenInitialSlide}
							title={chocolate.title ?? 'Изображение товара'}
							onClose={() => setIsFullscreenOpen(false)}
						/>
					)}
				</form>
			</FormProvider>
		</Section>
	)
}
