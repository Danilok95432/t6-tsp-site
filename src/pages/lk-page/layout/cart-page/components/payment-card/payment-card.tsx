import clsx from 'clsx'

import styles from './index.module.scss'
import { type PaymentOption } from 'src/types/order'
import { CheckCartSVG } from 'src/shared/ui/icons/checkCartSVG'

type Props = {
	option: PaymentOption
	active: boolean
	onClick: () => void
}

export const PaymentCard = ({ option, active, onClick }: Props) => {
	return (
		<button type='button' className={clsx(styles.card, active && styles.active)} onClick={onClick}>
			<div className={styles.title}>{option.label}</div>
			<div className={styles.check}>{active ? <CheckCartSVG /> : ''}</div>
		</button>
	)
}
