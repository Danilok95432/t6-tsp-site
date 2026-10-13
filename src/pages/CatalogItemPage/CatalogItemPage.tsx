import { Link, useParams } from 'react-router-dom'

import { Container } from 'src/shared/ui/Container/Container'

import {
	useAddItemToCartMutation,
	useGetItemCatalogByIDQuery,
} from 'src/features/catalog/api/catalog.api'

import { formatProductPrice, mockItem, type CatalogItemMock } from './consts'

import styles from './index.module.scss'
import { ConfirmWindow } from 'src/modals/confirmActionModal/confirmActionModal'
import { useState, type MouseEvent } from 'react'
import { type FieldValues } from 'react-hook-form'
import { useActions } from 'src/app/store/hooks/actions'
import { FlexRow } from 'src/shared/ui/FlexRow/FlexRow'
import { MinusSVG } from 'src/shared/ui/icons/minusSvg'
import { PlusSVG } from 'src/shared/ui/icons/plusSVG'
import { MainButton } from 'src/shared/ui/MainButton/MainButton'

import imgMock from 'src/assets/img/itemImgMock.png'

import cn from 'classnames'

type CartResponse = {
	item_count?: string
	item_weight?: string
	cart_weight?: string
	weight?: string
	status: string
	errortext?: string
}

const USE_MOCK_DATA = true

export const CatalogItemPage = () => {
	const { categoryId, itemId } = useParams<{
		categoryId: string
		itemId: string
	}>()

	const userID = localStorage.getItem('userId') ?? ''

	const {
		data,
		error: itemError,
		isLoading,
		isError: isItemError,
	} = useGetItemCatalogByIDQuery({
		id: itemId ?? '',
		userId: userID,
	})

	const { openModal } = useActions()
	const [cartCount, setCartCount] = useState<number>(0)
	const [isCartUpdating, setIsCartUpdating] = useState<boolean>(false)

	const [addItemToCart] = useAddItemToCartMutation()

	const createAddFormData = (count: string, itemWeight?: string | number) => {
		const formData = new FormData()

		if (userID) {
			formData.append('id_user', userID)
		}

		formData.append('id_item', itemId ?? '')
		formData.append('item_count', count)

		return formData
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
					link={`/catalog/${categoryId}/item/${itemId}`}
				/>,
			)

			return
		}

		await updateCart()
	}

	/*
	 * Пока используем mock.
	 *
	 * Когда API будет полностью готово:
	 *
	 * const item = data
	 */
	const item: CatalogItemMock | undefined = USE_MOCK_DATA
		? mockItem
		: (data as CatalogItemMock | undefined)

	if (!USE_MOCK_DATA && isLoading) {
		return (
			<main>
				<Container>
					<div className={styles.loader}>Загрузка товара...</div>
				</Container>
			</main>
		)
	}

	if (!USE_MOCK_DATA && (isItemError || !item)) {
		console.error(itemError)

		return (
			<main>
				<Container>
					<div className={styles.error}>Не удалось загрузить товар</div>
				</Container>
			</main>
		)
	}

	if (!item) return null

	const mainImage = item.img?.length > 0 ? item.img?.[0]?.original : imgMock

	return (
		<main className={styles.page}>
			<section className={styles.hero}>
				<Container className={styles.heroCont}>
					<div className={styles.breadcrumbs}>
						<Link to='/'>Главная</Link>

						<span>›</span>

						<Link to='/catalog'>Каталог</Link>

						<span>›</span>

						<Link to={`/catalog/${item.category_id}`}>{item.category_title}</Link>
					</div>

					<div className={styles.heroContent}>
						<div className={styles.heroInfo}>
							<h1 className={cn(styles.title, { [styles.smallTitle]: item.title.length > 40 })}>
								{item.title}
							</h1>

							<p className={styles.article}>Артикул: {item.article}</p>
						</div>

						<div className={styles.heroImage}>
							{mainImage && <img src={mainImage} alt={item.title} />}
						</div>
					</div>
				</Container>
			</section>

			<section className={styles.productInfo}>
				<Container>
					<div className={styles.infoLayout}>
						<div className={styles.content}>
							<p className={styles.description}>{item.description}</p>

							<div className={styles.characteristics}>
								<h2 className={styles.sectionTitle}>Характеристики</h2>

								<div className={styles.characteristicsList}>
									{item?.characteristics?.map((characteristic) => (
										<div className={styles.characteristic} key={characteristic.id}>
											<span className={styles.characteristicTitle}>{characteristic.title}</span>

											<span className={styles.dots} />

											<span className={styles.characteristicValue}>{characteristic.value}</span>
										</div>
									))}
								</div>
							</div>
						</div>

						<aside className={styles.buyCard}>
							<div className={styles.price}>
								{item.individualPrice ? (
									'По запросу'
								) : (
									<>
										<strong>{formatProductPrice(item.item_price)} ₽</strong>

										<span>/шт.</span>
									</>
								)}
							</div>

							<MainButton
								type='button'
								className={cn(styles.cartBtn, {
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
											onClick={async (e: MouseEvent) => await handleQuantityCartChange(e, '-1')}
										>
											<MinusSVG />
										</div>

										<p>{cartCount}</p>

										<div
											className={styles.vector}
											onClick={async (e: MouseEvent) => await handleQuantityCartChange(e, '1')}
										>
											<PlusSVG />
										</div>
									</FlexRow>
								)}
							</MainButton>
						</aside>
					</div>
				</Container>
			</section>

			{item.similar.length > 0 && (
				<section className={styles.similarSection}>
					<Container>
						<h2 className={styles.similarTitle}>Похожие товары</h2>

						<div className={styles.similarList}>
							{item.similar.map((product) => (
								<Link
									key={product.id}
									to={`/catalog/${product.category_id}/item/${product.id}`}
									className={styles.similarProduct}
								>
									<div className={styles.similarImage}>
										{product.img?.[0]?.original && (
											<img src={product.img[0].original} alt={product.title} />
										)}
									</div>

									<h3 className={styles.similarProductTitle}>{product.title}</h3>

									<p className={styles.similarProductPrice}>
										{product.individualPrice
											? 'По запросу'
											: `${formatProductPrice(product.item_price)} ₽/шт.`}
									</p>
								</Link>
							))}
						</div>
					</Container>
				</section>
			)}
		</main>
	)
}
