import { Section } from 'src/shared/ui/Section/section'
import styles from './index.module.scss'
import { Container } from 'src/shared/ui/Container/Container'
import { FlexRow } from 'src/shared/ui/FlexRow/FlexRow'
import { useGetInfoEliteListQuery } from 'src/features/home/api/home.api'

export const ClassSection = () => {
	const { data } = useGetInfoEliteListQuery(null)
	return (
		<Section className={styles.class}>
			<Container className={styles.classCont}>
				<FlexRow className={styles.headRow}>
					<h2>{data?.block_name}</h2>
				</FlexRow>
				<div className={styles.classRow}>
					{data?.advs.map((el, idx) => {
						return (
							<FlexRow className={styles.classEl} key={el.id}>
								<p>{el.adv_text}</p>
							</FlexRow>
						)
					})}
				</div>
			</Container>
		</Section>
	)
}
