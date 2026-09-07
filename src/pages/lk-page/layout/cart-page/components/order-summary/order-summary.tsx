import styles from './index.module.scss'

type Props = {
	itemsTotal: string
	deliveryPrice: string
	totalPrice: string
}

export const OrderSummary = ({ itemsTotal, deliveryPrice, totalPrice }: Props) => {
	return (
		<div className={styles.card}>
			<div className={styles.row}>
				<span>Товаров на:</span>
				<p>{itemsTotal} ₽</p>
			</div>

			{/* <div className={styles.row}>
				<span>Доставка:</span>
				<p>{deliveryPrice} ₽</p>
			</div> */}

			<div className={styles.divider} />

			<div className={styles.totalRow}>
				<span>Итого:</span>
				<p>{totalPrice} ₽</p>
			</div>
		</div>
	)
}
