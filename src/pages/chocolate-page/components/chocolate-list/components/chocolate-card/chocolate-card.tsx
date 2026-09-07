import { useEffect, useState, type MouseEvent } from 'react'
import { type FieldValues } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import cn from 'classnames'

import { FlexRow } from 'src/shared/ui/FlexRow/FlexRow'
import { MainButton } from 'src/shared/ui/MainButton/MainButton'
import { CardIconCatalogSVG } from 'src/shared/ui/icons/cardIconCatalogSVG'
import { HeartIconCatalogSVG } from 'src/shared/ui/icons/heartIconCatalogSVG'
import { MinusSVG } from 'src/shared/ui/icons/minusSvg'
import { PlusSVG } from 'src/shared/ui/icons/plusSVG'

import { useBreakPoint } from 'src/features/useBreakPoint/useBreakPoint'
import {
	useAddItemToCartMutation,
	useAddToFavoritesMutation,
	useDeleteFromFavoritesMutation,
} from 'src/features/catalog/api/catalog.api'

import { type CardItem } from 'src/types/cardItem'
import { AppRoute } from 'src/app/router/consts'

import skeleton from 'src/assets/img/candy(2).png'
import styles from './index.module.scss'
import { useActions } from 'src/app/store/hooks/actions'
import { ConfirmWindow } from 'src/modals/confirmActionModal/confirmActionModal'
import { toast } from 'react-toastify'

interface ChocolateCardProps {
	chocolate: CardItem
	className?: string
	smallCard?: boolean
}

type CartResponse = {
	item_count?: string
	item_weight?: string
	cart_weight?: string
	weight?: string
	status: string
	errortext?: string
}

type WeightProductFields = {
	use_weight?: unknown
	weight_default?: unknown
	weight_price_kg?: unknown
	cart_count?: unknown
	item_count?: unknown
	item_weight?: unknown
}

const getNumber = (value: unknown): number => {
	const normalizedValue = String(value ?? '')
		.replace(/\s/g, '')
		.replace(',', '.')

	const numberValue = Number(normalizedValue)

	return Number.isFinite(numberValue) ? numberValue : 0
}

const getBoolean = (value: unknown): boolean => {
	return value === true || value === 'true' || value === 1 || value === '1'
}

const getCartCount = (item: WeightProductFields): number => {
	const itemCount = getNumber(item.item_count ?? item.cart_count)

	return Number.isFinite(itemCount) ? Math.max(0, itemCount) : 0
}

const formatPrice = (value: number): string => {
	return `${Math.round(value).toLocaleString('ru-RU')} ₽`
}

const MAX_WEIGHT_GRAMS = 10000
const MAX_WEIGHT_ERROR = 'Больше 10 000 гр. по весу нельзя'

const getDefinedResponseWeight = (response: CartResponse | undefined): number | undefined => {
	const responseWeight = response?.item_weight ?? response?.cart_weight ?? response?.weight

	if (responseWeight === undefined || responseWeight === null || responseWeight === '') {
		return undefined
	}

	return Math.max(0, getNumber(responseWeight))
}

export const ChocolateCard = ({ chocolate, className, smallCard }: ChocolateCardProps) => {
	const weightProductFields = chocolate as WeightProductFields
	const isWeightProduct = getBoolean(weightProductFields.use_weight)
	const weightDefault = getNumber(weightProductFields.weight_default)
	const weightPriceKg = getNumber(weightProductFields.weight_price_kg)

	const [filled, setFilled] = useState<boolean>(Boolean(chocolate.favourite))
	const [cartCount, setCartCount] = useState<number>(getCartCount(weightProductFields))
	const [isHovered, setIsHovered] = useState<boolean>(false)
	const [isJumping, setIsJumping] = useState<boolean>(false)
	const [isCartUpdating, setIsCartUpdating] = useState<boolean>(false)
	const [isFavoriteUpdating, setIsFavoriteUpdating] = useState<boolean>(false)

	const breakPoint = useBreakPoint()
	const { menuId = '' } = useParams()
	const { openModal } = useActions()

	const [addItemToCart] = useAddItemToCartMutation()
	const [addToFavorites] = useAddToFavoritesMutation()
	const [deleteFromFavorites] = useDeleteFromFavoritesMutation()

	const userID = localStorage.getItem('userID') ?? ''

	const hasCartValue = cartCount > 0
	const priceText = isWeightProduct
		? `${formatPrice(weightPriceKg)}/кг`
		: `${chocolate.item_price} ₽`
	const isWeightButtonDisabled = isWeightProduct && hasCartValue
	const isBuyButtonDisabled = isCartUpdating || isWeightButtonDisabled

	useEffect(() => {
		setFilled(Boolean(chocolate.favourite))
	}, [chocolate.favourite])

	useEffect(() => {
		setCartCount(getCartCount(weightProductFields))
	}, [chocolate.cart_count, weightProductFields.item_count])

	const createAddFormData = (count: string, itemWeight?: string | number) => {
		const formData = new FormData()

		if (userID) {
			formData.append('id_user', userID)
		}

		formData.append('id_item', String(chocolate.id))
		formData.append('item_count', count)
		if (itemWeight !== undefined) {
			formData.append('item_weight', String(itemWeight))
		}

		return formData
	}

	const createFavoriteFormData = () => {
		const formData = new FormData()

		if (userID) {
			formData.append('id_user', userID)
		}

		formData.append('id_item', String(chocolate.id))

		return formData
	}

	const startJumpAnimation = () => {
		setIsJumping(true)

		setTimeout(() => {
			setIsJumping(false)
		}, 400)
	}

	const handleAddToCart = async (e: MouseEvent, countValue: string) => {
		e.preventDefault()
		e.stopPropagation()

		if (isWeightProduct) return

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

				if (delta > 0) {
					startJumpAnimation()
				}
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
					link={`/catalog/${menuId}`}
				/>,
			)

			return
		}

		await updateCart()
	}

	const handleAddWeightToCart = async (e: MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()

		if (!isWeightProduct || isCartUpdating || hasCartValue) return
		if (weightDefault <= 0) {
			console.error('Не указан weight_default для весового товара')
			return
		}

		const currentWeight = Math.min(weightDefault, MAX_WEIGHT_GRAMS)

		if (weightDefault > MAX_WEIGHT_GRAMS) {
			toast.error(MAX_WEIGHT_ERROR)
		}

		try {
			setIsCartUpdating(true)

			const response = (await addItemToCart(
				createAddFormData('1', currentWeight) as unknown as FieldValues,
			).unwrap()) as CartResponse

			if (response?.status === 'error') {
				console.error('Ошибка при добавлении весового товара в корзину:', response.errortext)
				return
			}

			const responseWeight = getDefinedResponseWeight(response)

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
			}

			const nextCount = Number(response?.item_count)

			setCartCount(Number.isFinite(nextCount) ? Math.max(1, nextCount) : 1)
			startJumpAnimation()
		} catch (error) {
			console.error('Ошибка при добавлении весового товара в корзину:', error)
		} finally {
			setIsCartUpdating(false)
		}
	}

	const handleBuyClick = async (e: MouseEvent) => {
		if (isWeightProduct) {
			await handleAddWeightToCart(e)
			return
		}

		await handleAddToCart(e, '1')
	}

	const handleHeartClick = async (e: MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()

		if (isFavoriteUpdating) return

		try {
			setIsFavoriteUpdating(true)

			if (filled) {
				const response = await deleteFromFavorites(
					createFavoriteFormData() as unknown as FieldValues,
				).unwrap()

				if (response?.status === 'error') {
					console.error('Ошибка при удалении из избранного:', response.errortext)
					return
				}

				setFilled(false)
			} else {
				if (!userID) {
					toast.error('Для добавления в избранное, пожалуйста, пройдите авторизацию на сайте.')
					return
				}
				const response = await addToFavorites(
					createFavoriteFormData() as unknown as FieldValues,
				).unwrap()

				if (response?.status === 'error') {
					console.error('Ошибка при добавлении в избранное:', response.errortext)
					return
				}

				setFilled(true)
			}
		} catch (error) {
			console.error('Ошибка при изменении избранного:', error)
		} finally {
			setIsFavoriteUpdating(false)
		}
	}

	const imageSrc = chocolate.img && chocolate.img.length > 0 ? chocolate.img[0].original : skeleton
	const linkTo = `${AppRoute.Catalog}/${chocolate.category_id ?? menuId}/item/${chocolate.id}`
	const weightText = isWeightProduct
		? 'весовой товар'
		: Number(chocolate.item_weight) > 0
			? `${chocolate.item_weight} гр.`
			: ''
	const weightMobileButtonText = hasCartValue ? 'В корзине' : 'В корзину'

	if (smallCard) {
		return (
			<Link to={linkTo}>
				<div className={cn(styles.smallCard, className)}>
					<FlexRow className={styles.smallIcon}>
						<div
							className={cn(styles.vector, {
								[styles.filledHeart]: filled,
								[styles.loading]: isFavoriteUpdating,
							})}
							onClick={handleHeartClick}
						>
							<HeartIconCatalogSVG filled={filled} />
						</div>
					</FlexRow>

					<div className={styles.smallImage}>
						<img src={imageSrc} alt={chocolate.title} />
					</div>

					<FlexRow className={styles.smallContent}>
						<FlexRow className={styles.smallInfoWrapper}>
							<h3 className={styles.title}>{priceText}</h3>
							<p className={styles.subtitle}>{chocolate.title}</p>
							{weightText && <p className={styles.weight}>{weightText}</p>}
						</FlexRow>

						{breakPoint !== 'S' && (
							<MainButton
								type='button'
								className={cn(styles.smallBuyBtn, {
									[styles.filled]: !isWeightProduct && hasCartValue && breakPoint === 'S',
									[styles.loading]: isCartUpdating,
								})}
								disabled={isBuyButtonDisabled}
								onMouseEnter={() => setIsHovered(true)}
								onMouseLeave={() => setIsHovered(false)}
								onClick={handleBuyClick}
							>
								<CardIconCatalogSVG
									small
									filled={isHovered}
									className={isJumping ? styles.jump : ''}
								/>

								{!isWeightProduct && hasCartValue && (
									<div className={styles.counter}>{cartCount}</div>
								)}
							</MainButton>
						)}

						{breakPoint === 'S' && (
							<MainButton
								type='button'
								className={cn(styles.smallBuyBtn, styles.mobileBuyBtn, {
									[styles.filled]: !isWeightProduct && hasCartValue,
									[styles.loading]: isCartUpdating,
									[styles.disabled]: isBuyButtonDisabled,
								})}
								disabled={isBuyButtonDisabled}
								onClick={(e: MouseEvent) => {
									e.preventDefault()
									e.stopPropagation()
								}}
							>
								{isWeightProduct ? (
									<p className={styles.btnText} onClick={handleBuyClick}>
										{weightMobileButtonText}
									</p>
								) : cartCount === 0 ? (
									<p className={styles.btnText} onClick={handleBuyClick}>
										В корзину
									</p>
								) : (
									<FlexRow className={styles.smallCounterCart}>
										<div
											className={styles.vector}
											onClick={async (e: MouseEvent) => await handleAddToCart(e, '-1')}
										>
											<MinusSVG />
										</div>

										<p>{cartCount}</p>

										<div
											className={styles.vector}
											onClick={async (e: MouseEvent) => await handleAddToCart(e, '1')}
										>
											<PlusSVG />
										</div>
									</FlexRow>
								)}
							</MainButton>
						)}
					</FlexRow>
				</div>
			</Link>
		)
	}

	return (
		<Link to={linkTo}>
			<div className={cn(styles.card, className)}>
				<FlexRow className={styles.icon}>
					<div
						className={cn(styles.vector, {
							[styles.filledHeart]: filled,
							[styles.loading]: isFavoriteUpdating,
						})}
						onClick={handleHeartClick}
					>
						<HeartIconCatalogSVG filled={filled} />
					</div>
				</FlexRow>

				<div className={styles.image}>
					<img src={imageSrc} alt={chocolate.title} />
				</div>

				<FlexRow className={styles.content}>
					<FlexRow className={styles.infoWrapper}>
						<h3 className={styles.title}>{priceText}</h3>
						<p className={styles.subtitle}>{chocolate.title}</p>
						{weightText && <p className={styles.weight}>{weightText}</p>}
					</FlexRow>

					{breakPoint !== 'S' && (
						<MainButton
							type='button'
							className={cn(styles.buyBtn, {
								[styles.filled]: !isWeightProduct && hasCartValue && breakPoint === 'S',
								[styles.loading]: isCartUpdating,
								[styles.disabled]: isBuyButtonDisabled,
							})}
							disabled={isBuyButtonDisabled}
							onMouseEnter={() => setIsHovered(true)}
							onMouseLeave={() => setIsHovered(false)}
							onClick={handleBuyClick}
						>
							<CardIconCatalogSVG filled={isHovered} className={isJumping ? styles.jump : ''} />

							{!isWeightProduct && hasCartValue && (
								<div className={styles.counter}>{cartCount}</div>
							)}
						</MainButton>
					)}

					{breakPoint === 'S' && (
						<MainButton
							type='button'
							className={cn(styles.buyBtn, styles.mobileBuyBtn, {
								[styles.filled]: !isWeightProduct && hasCartValue,
								[styles.loading]: isCartUpdating,
								[styles.disabled]: isBuyButtonDisabled,
							})}
							disabled={isBuyButtonDisabled}
							onClick={(e: MouseEvent) => {
								e.preventDefault()
								e.stopPropagation()
							}}
						>
							{isWeightProduct ? (
								<p className={styles.btnText} onClick={handleBuyClick}>
									{weightMobileButtonText}
								</p>
							) : cartCount === 0 ? (
								<p className={styles.btnText} onClick={handleBuyClick}>
									В корзину
								</p>
							) : (
								<FlexRow className={styles.counterCart}>
									<div
										className={styles.vector}
										onClick={async (e: MouseEvent) => await handleAddToCart(e, '-1')}
									>
										<MinusSVG />
									</div>

									<p>{cartCount}</p>

									<div
										className={styles.vector}
										onClick={async (e: MouseEvent) => await handleAddToCart(e, '1')}
									>
										<PlusSVG />
									</div>
								</FlexRow>
							)}
						</MainButton>
					)}
				</FlexRow>
			</div>
		</Link>
	)
}
