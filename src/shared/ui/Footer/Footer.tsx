import { Container } from '../Container/Container'
import { FlexRow } from '../FlexRow/FlexRow'
import { LocationIconSVG } from '../icons/locationIconSVG'
import { MailIconSVG } from '../icons/mailIconSVG'
import { PhoneIconSVG } from '../icons/phoneIconSVG'
import styles from './index.module.scss'

export const Footer = () => {
	const infoLinks = [
		{ id: '1', title: 'Решения', link: '#' },
		{ id: '2', title: 'Каталог', link: '#' },
		{ id: '3', title: 'Команда', link: '#' },
		{ id: '4', title: 'Проекты', link: '#' },
		{ id: '5', title: 'Документы', link: '#' },
		{ id: '6', title: 'Контакты', link: '#' },
	]

	const middleIndex = Math.ceil(infoLinks.length / 2)

	const linkColumns = [infoLinks.slice(0, middleIndex), infoLinks.slice(middleIndex)]

	return (
		<footer className={styles.footer}>
			<Container className={styles.cont}>
				<FlexRow className={styles.top}>
					<div className={styles.info}>
						<div className={styles.company}>ООО «Название организации»</div>

						<a href='/privacy' className={styles.privacy}>
							Положение о защите персональных данных
						</a>
					</div>

					<nav className={styles.navigation}>
						{linkColumns.map((column, index) => (
							<div className={styles.navColumn} key={index}>
								{column.map(({ id, title, link }) => (
									<a className={styles.link} href={link} key={id}>
										{title}
									</a>
								))}
							</div>
						))}
					</nav>

					<button className={styles.requestButton} type='button'>
						Отправить заявку
					</button>
				</FlexRow>

				<div className={styles.divider} />

				<FlexRow className={styles.bottom}>
					<div className={styles.copyright}>Все права защищены © СПб, 2026</div>

					<div className={styles.contacts}>
						<a href='tel:+79126581189' className={styles.contact}>
							<span className={styles.icon}>
								<PhoneIconSVG />
							</span>

							<span>8 (912) 658-11-89</span>
						</a>

						<a href='mailto:info@shop.ru' className={styles.contactMail}>
							<span className={styles.icon}>
								<MailIconSVG />
							</span>

							<span>info@shop.ru</span>
						</a>

						<div className={styles.contact}>
							<span className={styles.icon}>
								<LocationIconSVG />
							</span>

							<span>г. Тамбов, бул. Энтузиастов, 2А</span>
						</div>
					</div>
				</FlexRow>
			</Container>
		</footer>
	)
}
