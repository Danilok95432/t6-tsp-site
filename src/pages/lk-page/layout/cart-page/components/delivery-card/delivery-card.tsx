import clsx from 'clsx'

import styles from './index.module.scss'
import { type DeliveryOption } from 'src/types/order'
import { CheckCartSVG } from 'src/shared/ui/icons/checkCartSVG'
import { FlexRow } from 'src/shared/ui/FlexRow/FlexRow'

type Props = {
	option?: DeliveryOption
	active: boolean
	onClick: () => void
}

export const DeliveryCard = ({ option, active, onClick }: Props) => {
	return (
		<button type='button' className={clsx(styles.card, active && styles.active)} onClick={onClick}>
			<FlexRow className={styles.infoRow}>
				<div className={styles.title}>{option?.label}</div>
				{/* {option?.price !== '0.00' && (
					<div className={styles.desc}>Стоимость: {option?.price} ₽</div>
				)} */}
				{option?.address !== '' && <div className={styles.desc}>Адрес: {option?.address}</div>}
				{/* {option?.days && <div className={styles.meta}>Дней доставки: {option?.days}</div>} */}
			</FlexRow>

			<div className={styles.check}>{active ? <CheckCartSVG /> : ''}</div>
		</button>
	)
}
