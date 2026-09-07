import { Container } from 'src/shared/ui/Container/Container'
import { Section } from 'src/shared/ui/Section/section'

import styles from './index.module.scss'
import { FlexRow } from 'src/shared/ui/FlexRow/FlexRow'
import { lkTabNavigation } from './consts'
import { MainButton } from 'src/shared/ui/MainButton/MainButton'
import { useLogoutUserMutation } from 'src/features/auth/api/auth.api'
import { useNavigate } from 'react-router-dom'

export const LkPage = () => {
	const [logout] = useLogoutUserMutation()
	const navigate = useNavigate()
	const handleLogout = async () => {
		await logout({})
		localStorage.removeItem('token')
		localStorage.removeItem('userID')
		navigate('/')
	}
	return (
		<Section className={styles.lkSection}>
			<Container className={styles.lkCont}>
				<h1 className={styles.title}>Личный кабинет</h1>
				<div className={styles.classRow}>
					{lkTabNavigation?.map((el, idx) => {
						return (
							<a href={el.link} key={idx}>
								<FlexRow className={styles.classEl}>
									<p>{el.title}</p>
								</FlexRow>
							</a>
						)
					})}
				</div>
				<MainButton type='submit' className={styles.cancelBtn} onClick={handleLogout}>
					Выйти из профиля
				</MainButton>
			</Container>
		</Section>
	)
}
