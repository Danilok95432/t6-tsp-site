import { useCallback, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { BurgerMenu } from './burger-menu/burger-menu'

import styles from './index.module.scss'
import { type NavigationItem, navigationItems } from './consts'

export const MainNavigation = () => {
	const location = useLocation()
	const navigate = useNavigate()

	const scrollToSection = useCallback((sectionId: string) => {
		const element = document.getElementById(sectionId)

		if (!element) return

		const header = document.querySelector('header')
		const headerHeight = header?.getBoundingClientRect().height ?? 0

		const elementTop = element.getBoundingClientRect().top + window.scrollY - headerHeight

		window.scrollTo({
			top: elementTop,
			behavior: 'smooth',
		})
	}, [])

	const handleNavigation = (item: NavigationItem) => {
		if (item.link) {
			navigate(item.link)
			return
		}

		if (!item.sectionId) return

		const hash = `#${item.sectionId}`

		// Уже на главной — просто скроллим.
		if (location.pathname === '/') {
			window.history.pushState(null, '', hash)
			scrollToSection(item.sectionId)
			return
		}

		// На другой странице — сначала переходим на главную.
		// useEffect ниже выполнит скролл после её отрисовки.
		navigate(`/${hash}`)
	}

	useEffect(() => {
		if (location.pathname !== '/' || !location.hash) return

		const sectionId = decodeURIComponent(location.hash.slice(1))

		// Даём главной странице успеть отрисовать нужную секцию.
		const timeout = window.setTimeout(() => {
			scrollToSection(sectionId)
		}, 100)

		return () => window.clearTimeout(timeout)
	}, [location.pathname, location.hash, scrollToSection])

	return (
		<>
			<nav className={styles.navigation}>
				<ul className={styles.navWrapper}>
					{navigationItems.map((item) => {
						const hasChildren = Boolean(item.children?.length)

						return (
							<li className={styles.navItem} key={item.id}>
								<button
									type='button'
									className={styles.navLink}
									onClick={() => handleNavigation(item)}
								>
									<span>{item.title}</span>

									{hasChildren && (
										<span className={styles.arrow}>
											<svg
												width='10'
												height='6'
												viewBox='0 0 10 6'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
											>
												<path
													d='M1 1L5 5L9 1'
													stroke='currentColor'
													strokeLinecap='round'
													strokeLinejoin='round'
												/>
											</svg>
										</span>
									)}
								</button>

								{hasChildren && (
									<div className={styles.dropdown}>
										<div className={styles.dropdownContent}>
											{item.children?.map((child) => (
												<button
													type='button'
													key={child.id}
													className={styles.dropdownLink}
													onClick={() => handleNavigation(child)}
												>
													{child.title}
												</button>
											))}
										</div>
									</div>
								)}
							</li>
						)
					})}
				</ul>
			</nav>

			<div className={styles.burger}>
				<BurgerMenu />
			</div>
		</>
	)
}
