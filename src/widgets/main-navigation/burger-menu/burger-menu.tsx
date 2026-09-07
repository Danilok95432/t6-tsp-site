import { useEffect, useState } from 'react'
import cn from 'classnames'

import { NavLink } from 'react-router-dom'

import styles from './index.module.scss'
import { setActive } from 'src/shared/helpers/utils'
import { useGetCategoriesCatalogQuery } from 'src/features/catalog/api/catalog.api'

export const BurgerMenu = () => {
	const [isOpen, setIsOpen] = useState(false)
	const { data } = useGetCategoriesCatalogQuery(null)

	const toggleMenu = () => {
		setIsOpen(!isOpen)
	}

	const scrollToSection = (sectionId: string) => {
		const element = document.getElementById(sectionId)
		if (element) {
			element.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			})
		}
	}

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}

		return () => {
			document.body.style.overflow = ''
		}
	}, [isOpen])

	const getSortedCatalogs = () => {
		const catalogs = data?.catalogs ?? []
		const novinki = catalogs.find((cat) => cat.title === 'Новинки')
		const thematic = catalogs.find((cat) => cat.title === 'Тематическая серия')
		const others = catalogs.filter(
			(cat) => cat.title !== 'Новинки' && cat.title !== 'Тематическая серия',
		)
		return [...(novinki ? [novinki] : []), ...others, ...(thematic ? [thematic] : [])]
	}

	const sortedCatalogs = getSortedCatalogs()

	return (
		<div className={styles.burgerMenu}>
			<div className={styles.burgerIcon} onClick={toggleMenu}>
				<span></span>
				<span></span>
				<span></span>
			</div>

			<nav className={cn(styles.navMenu, { [styles._openMenu]: isOpen })}>
				<div className={cn(styles.burgerIcon, styles._openIcon)} onClick={toggleMenu}>
					<span></span>
					<span></span>
					<span></span>
				</div>
				<ul>
					{sortedCatalogs.map((menuEl, index) => (
						<li className={styles.menuItem} key={index}>
							<NavLink
								className={({ isActive }) => setActive(isActive, styles.activeLink)}
								to={`/catalog/${menuEl.id}`}
								onClick={() => {
									toggleMenu()
									scrollToSection(`/catalog/${menuEl.id}`)
								}}
							>
								{menuEl.title}
							</NavLink>
						</li>
					))}
				</ul>
			</nav>
		</div>
	)
}
