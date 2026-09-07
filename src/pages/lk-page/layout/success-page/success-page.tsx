import { Container } from 'src/shared/ui/Container/Container'
import { Section } from 'src/shared/ui/Section/section'

import styles from './index.module.scss'
import { SuccessOrderSVG } from 'src/shared/ui/icons/successOrderSVG'
import { useSearchParams } from 'react-router-dom'

export const SuccessPage = () => {
	const [searchParams] = useSearchParams()

	const isPaid = searchParams.get('paid') === 'true'
	return (
		<Section className={styles.lkSection}>
			<Container className={styles.lkCont}>
				<h1 className={styles.title}>
					<SuccessOrderSVG />
					<span>{isPaid ? 'Ваш заказ оформлен и оплачен' : 'Ваш заказ оформлен'}</span>
				</h1>
				<p>Наши специалисты свяжутся с Вами для подтверждения заказа</p>
			</Container>
		</Section>
	)
}
