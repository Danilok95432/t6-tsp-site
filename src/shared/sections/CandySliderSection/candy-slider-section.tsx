import { type FC, type MouseEvent, type RefObject, useEffect, useRef, useState } from 'react'
import { type FieldValues } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Swiper, type SwiperRef, SwiperSlide } from 'swiper/react'
import cn from 'classnames'

import 'swiper/css'

import styles from './index.module.scss'
import { Container } from 'src/shared/ui/Container/Container'
import { FlexRow } from 'src/shared/ui/FlexRow/FlexRow'
import { Section } from 'src/shared/ui/Section/section'
import { SliderBtns } from 'src/widgets/Slider-btns/slider-btns'
import { sliderOptions } from './consts'
import { HeartIconCatalogSVG } from 'src/shared/ui/icons/heartIconCatalogSVG'
import { useGetBestListQuery } from 'src/features/home/api/home.api'
import {
	useAddToFavoritesMutation,
	useDeleteFromFavoritesMutation,
} from 'src/features/catalog/api/catalog.api'

import skeleton from 'src/assets/img/candy(2).png'
import { toast } from 'react-toastify'

type CandySliderSectionProps = {
	title?: string
}

type FavoriteResponse = {
	status?: string
	errortext?: string
}

type BestItem = {
	id: string | number
	category_id: string | number
	title: string
	item_price: string | number
	item_weight: string | number
	favourite?: boolean
	use_weight?: boolean
	weight_price_kg?: string
	weight_default?: string
	weight_one?: string
	img?: Array<{
		original?: string
	}>
}

export const CandySliderSection: FC<CandySliderSectionProps> = ({ title = 'Наше лучшее' }) => {
	const swiperRef: RefObject<SwiperRef> = useRef<SwiperRef>(null)

	const userID = localStorage.getItem('userID') ?? ''

	const { data } = useGetBestListQuery(userID)

	const [addToFavorites] = useAddToFavoritesMutation()
	const [deleteFromFavorites] = useDeleteFromFavoritesMutation()

	const [favoriteById, setFavoriteById] = useState<Record<string, boolean>>({})
	const [favoriteUpdatingId, setFavoriteUpdatingId] = useState<string | null>(null)

	useEffect(() => {
		if (!data?.best) return

		setFavoriteById(
			data.best.reduce<Record<string, boolean>>((acc, item: BestItem) => {
				acc[String(item.id)] = Boolean(item.favourite)

				return acc
			}, {}),
		)
	}, [data?.best])

	const formatPrice = (value: string | number) => {
		const normalizedValue = String(value).replace(/\s/g, '')
		const numberValue = Number(normalizedValue)

		if (Number.isNaN(numberValue)) {
			return `${value}`
		}

		return `${numberValue.toLocaleString('ru-RU', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})}`
	}

	const createFavoriteFormData = (idItem: string | number) => {
		const formData = new FormData()

		if (userID) {
			formData.append('id_user', userID)
		}

		formData.append('id_item', String(idItem))

		return formData
	}

	const handleHeartClick = async (e: MouseEvent, item: BestItem) => {
		e.preventDefault()
		e.stopPropagation()

		const itemId = String(item.id)
		const isFavorite = favoriteById[itemId] ?? Boolean(item.favourite)

		if (favoriteUpdatingId) return

		try {
			setFavoriteUpdatingId(itemId)

			if (isFavorite) {
				const response = (await deleteFromFavorites(
					createFavoriteFormData(item.id) as unknown as FieldValues,
				).unwrap()) as FavoriteResponse

				if (response?.status === 'error') {
					console.error('Ошибка при удалении из избранного:', response.errortext)
					return
				}

				setFavoriteById((prev) => ({
					...prev,
					[itemId]: false,
				}))
			} else {
				if (!userID) {
					toast.error('Для добавления в избранное, пожалуйста, пройдите авторизацию на сайте.')
					return
				}

				const response = (await addToFavorites(
					createFavoriteFormData(item.id) as unknown as FieldValues,
				).unwrap()) as FavoriteResponse

				if (response?.status === 'error') {
					console.error('Ошибка при добавлении в избранное:', response.errortext)
					return
				}

				setFavoriteById((prev) => ({
					...prev,
					[itemId]: true,
				}))
			}
		} catch (error) {
			console.error('Ошибка при изменении избранного:', error)
		} finally {
			setFavoriteUpdatingId(null)
		}
	}

	return (
		<Section className={styles.candySliderSection}>
			<Container>
				<FlexRow className={styles.headRow}>
					<h2 className={styles.title}>{title}</h2>
				</FlexRow>

				<div className={styles.sliderWrap}>
					<Swiper {...sliderOptions} className={styles.swiper} ref={swiperRef}>
						{data?.best.map((item: BestItem) => {
							const itemId = String(item.id)
							const isFavorite = favoriteById[itemId] ?? Boolean(item.favourite)
							const isFavoriteUpdating = favoriteUpdatingId === itemId

							return (
								<SwiperSlide key={item.id} className={styles.slide}>
									<Link
										to={`/catalog/${item.category_id}/item/${item.id}`}
										className={styles.linkSlide}
									>
										<FlexRow className={styles.card}>
											<FlexRow
												className={cn(styles.heartRow, {
													[styles.filledHeart]: isFavorite,
													[styles.loading]: isFavoriteUpdating,
												})}
												onClick={async (e: MouseEvent) => await handleHeartClick(e, item)}
											>
												<span className={styles.heartIcon}>
													<span className={styles.heartBase}>
														<HeartIconCatalogSVG filled={false} />
													</span>

													<span className={styles.heartFill}>
														<HeartIconCatalogSVG filled />
													</span>
												</span>
											</FlexRow>

											<div className={styles.imageWrap}>
												<img
													className={styles.image}
													src={item.img?.[0]?.original ?? skeleton}
													alt={item.title}
													loading='lazy'
												/>
											</div>

											<div className={styles.name}>{item.title}</div>

											<FlexRow className={styles.metaRow}>
												{Number(item.item_weight) > 0 && !item.use_weight ? (
													<p className={styles.weight}>{`${item.item_weight} гр.`}</p>
												) : (
													<p className={styles.weight}>{`весовой товар`}</p>
												)}
												<span className={styles.price}>
													{item.use_weight
														? `${formatPrice(item.weight_price_kg ?? item.item_price)} ₽/кг`
														: `${formatPrice(item.item_price)} ₽`}
												</span>
											</FlexRow>
										</FlexRow>
									</Link>
								</SwiperSlide>
							)
						})}
					</Swiper>

					<SliderBtns className={styles.sliderBtns} swiperRef={swiperRef} />
				</div>
			</Container>
		</Section>
	)
}
