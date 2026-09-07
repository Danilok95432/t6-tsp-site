import { type FC, useEffect, useState } from 'react'

import { Link, useLocation } from 'react-router-dom'

import styles from './index.module.scss'
import { useAppSelector } from 'src/app/store/hooks/store'
import { AppRoute } from 'src/app/router/consts'
import { getAdditionalCrumbs } from './store/bread-crumbs.selectors'
import { SeparatorIconNavigationSVG } from 'src/shared/ui/icons/separatorIconNavigationSVG'
import { type NavigationItem } from 'src/types/navigation'
import { NavigationHomeIconSVG } from 'src/shared/ui/icons/NavigationHomeIconSVG'
import classNames from 'classnames'

type BreadCrumbsProps = {
	crumbsLinksMap: NavigationItem[]
	isHeadNav?: boolean
	isCatalog?: boolean
	idLink?: string
	catalogReturnPath?: string
}

export const BreadCrumbs: FC<BreadCrumbsProps> = ({
	crumbsLinksMap,
	isHeadNav = false,
	isCatalog = false,
	idLink = '',
	catalogReturnPath,
}) => {
	const { pathname } = useLocation()
	const [pathNames, setPathNames] = useState<string[]>([''])

	const additionalCrumbs = useAppSelector(getAdditionalCrumbs)
	const crumbsLinksArr = crumbsLinksMap.map((el) => el.link)

	const defineLinkTitle = (link: string) => {
		const searchEl = crumbsLinksMap.find((el) => el.link === link)
		if (searchEl?.title) {
			return searchEl?.title
		}
	}

	useEffect(() => {
		const segments = pathname.split('/').filter(Boolean)

		const fullPathnames = segments.map((_, idx) => {
			return segments.slice(0, idx + 1).join('/')
		})

		const filteredPathnames = fullPathnames.filter((path) => crumbsLinksArr.includes(path))

		setPathNames(() => {
			if (additionalCrumbs) {
				return [...filteredPathnames, additionalCrumbs]
			}

			return filteredPathnames
		})
	}, [pathname, additionalCrumbs])
	if (isHeadNav) {
		return (
			<ul className={classNames(styles.headList, styles.breadCrumbsList)}>
				<li>
					<Link to={AppRoute.HOME}>
						{' '}
						<NavigationHomeIconSVG />{' '}
					</Link>{' '}
					<SeparatorIconNavigationSVG />
				</li>
				{crumbsLinksMap?.map((pathEl, idx) => {
					const pathSegments = pathname.split('/').filter(Boolean)
					const linkSegments = pathEl.link.split('/').filter(Boolean)
					const isActive =
						pathSegments.length === linkSegments.length &&
						pathSegments.every((segment, i) => segment === linkSegments[i])

					return (
						<li key={idx} id={pathEl.title} className={classNames({ [styles.active]: isActive })}>
							<Link to={pathEl.link}>{defineLinkTitle(pathEl.link)}</Link>
						</li>
					)
				})}
			</ul>
		)
	}
	return (
		<ul className={styles.breadCrumbsList}>
			<li>
				<Link to={AppRoute.HOME}>
					{' '}
					<NavigationHomeIconSVG />{' '}
				</Link>{' '}
				<SeparatorIconNavigationSVG />
			</li>

			{pathNames?.map((pathEl, idx) => {
				if (pathNames.length - 1 === idx && pathEl !== 'awards') {
					return (
						<li key={pathEl}>
							<span>{additionalCrumbs ?? defineLinkTitle(pathEl)}</span>
						</li>
					)
				}

				if (pathEl === 'laureates' || pathEl === 'awards') {
					return (
						<li key={pathEl}>
							<Link to={`${pathEl}`}>{defineLinkTitle(pathEl)}</Link>
							<SeparatorIconNavigationSVG />
						</li>
					)
				}

				return (
					<li key={pathEl} id={pathEl}>
						<Link to={isCatalog ? catalogReturnPath ?? `/${pathEl}/${idLink}` : `/${pathEl}`}>
							{defineLinkTitle(pathEl)}
						</Link>
						<SeparatorIconNavigationSVG />
					</li>
				)
			})}
		</ul>
	)
}
