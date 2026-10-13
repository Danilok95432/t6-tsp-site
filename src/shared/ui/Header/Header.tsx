import { useNavigate } from 'react-router-dom'

import { Container } from '../Container/Container'
import { FlexRow } from '../FlexRow/FlexRow'
import { LogoSVG } from '../icons/logoSVG'
import { PhoneIconSVG } from '../icons/phoneIconSVG'
import { MainNavigation } from 'src/widgets/main-navigation/main-navigation'

import styles from './index.module.scss'
import { CartIconSVG } from '../icons/cartIconSVG'
import { PersonSVG } from '../icons/personSVG'
import { useGetCountItemsCartQuery } from 'src/features/catalog/api/catalog.api'

export const Header = () => {
	const navigate = useNavigate()
	const token = localStorage.getItem('token')
	const userId = localStorage.getItem('userID') ?? ''

	const authorized = Boolean(token)

	const { data: countCartData } = useGetCountItemsCartQuery(userId, {
		skip: !authorized || !userId,
	})

	const cartItemsCount = Number(countCartData?.cart_items ?? 0)

	return (
		<header className={styles.header}>
			<Container className={styles.headerCont}>
				<FlexRow className={styles.headerRow}>
					<button
						type='button'
						onClick={() => navigate('/')}
						className={styles.logo}
						aria-label='На главную'
					>
						<LogoSVG />
					</button>

					<MainNavigation />

					<a className={styles.phone} href='tel:+78123275032'>
						<PhoneIconSVG color='#171717' bigSize />
						<span>8 (812) 327-50-32</span>
					</a>

					{/* <button type='button' className={styles.requestButton}>
						Отправить заявку
					</button> */}
					<FlexRow className={styles.btns}>
						<div className={styles.vector}>
							<PersonSVG />
						</div>

						<div className={styles.cartVector} onClick={() => navigate('/lk/cart')}>
							<CartIconSVG />

							{cartItemsCount > 0 && <span className={styles.cartBadge}>{cartItemsCount}</span>}
						</div>
					</FlexRow>
				</FlexRow>
			</Container>
		</header>
	)
}
