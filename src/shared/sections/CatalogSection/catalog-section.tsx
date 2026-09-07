import { Container } from 'src/shared/ui/Container/Container'
import { FlexRow } from 'src/shared/ui/FlexRow/FlexRow'
import { Section } from 'src/shared/ui/Section/section'

import styles from './index.module.scss'
import { Link } from 'react-router-dom'
import { useGetCategoriesCatalogQuery } from 'src/features/catalog/api/catalog.api'
import { AppRoute } from 'src/app/router/consts'

import skeleton from 'src/assets/img/catalog(1).png'
import { useBreakPoint } from 'src/features/useBreakPoint/useBreakPoint'

export const CatalogSection = () => {
	const { data } = useGetCategoriesCatalogQuery(null)
	const breakPoint = useBreakPoint()

	const filteredCatalogs = (data?.catalogs ?? []).filter(
		(el) => el.title !== 'Новинки' && el.title !== 'Тематическая серия',
	)

	return (
		<Section className={styles.catalog}>
			<Container>
				<FlexRow className={styles.headRow}>
					<h2>Каталог продукции</h2>
				</FlexRow>
				<FlexRow className={styles.catalogRow}>
					{filteredCatalogs.map((el) => {
						if (breakPoint === 'S')
							return (
								<Link to={`/catalog/${el.id}`} className={styles.catalogLinkWrapper} key={el.id}>
									<FlexRow className={styles.catalogEl}>
										<div className={styles.imgWrapper}>
											<img
												src={el.img && el.img.length > 0 ? el.img[0].original : skeleton}
												alt=''
											/>
										</div>
										<p className={styles.title}>{el.title}</p>
										<FlexRow className={styles.bottomRow}>
											<FlexRow className={styles.linksRow}>
												{el.subcats?.map((elem) => (
													<Link
														to={`/catalog/${el.id}/item/${elem.id}`}
														key={elem.id}
														className={styles.link}
													>
														{elem.title}
													</Link>
												))}
											</FlexRow>
											<Link to={`${AppRoute.Catalog}/${el.id}`} className={styles.catalogBtn}>
												<p>{`В каталог "${el.title}"`}</p>
											</Link>
										</FlexRow>
									</FlexRow>
								</Link>
							)
						else
							return (
								<FlexRow className={styles.catalogEl} key={el.id}>
									<div className={styles.imgWrapper}>
										<img src={el.img && el.img.length > 0 ? el.img[0].original : skeleton} alt='' />
									</div>
									<p className={styles.title}>{el.title}</p>
									<FlexRow className={styles.bottomRow}>
										<FlexRow className={styles.linksRow}>
											{el.subcats?.map((elem) => (
												<Link
													to={`/catalog/${el.id}/item/${elem.id}`}
													key={elem.id}
													className={styles.link}
												>
													{elem.title}
												</Link>
											))}
										</FlexRow>
										<Link to={`${AppRoute.Catalog}/${el.id}`} className={styles.catalogBtn}>
											<p>{`В каталог "${el.title}"`}</p>
										</Link>
									</FlexRow>
								</FlexRow>
							)
					})}
				</FlexRow>
			</Container>
		</Section>
	)
}
