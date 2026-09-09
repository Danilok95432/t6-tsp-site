import { Container } from 'src/shared/ui/Container/Container'
import { Section } from 'src/shared/ui/Section/section'

import { solutionMock } from '../../consts'

import styles from './index.module.scss'

export const SolutionHeroSection = () => {
	return (
		<Section className={styles.hero}>
			<div className={styles.wrapper}>
				<Container className={styles.cont}>
					<div className={styles.content}>
						<span className={styles.type}>{solutionMock.type}</span>

						<h1 className={styles.title}>{solutionMock.title}</h1>

						<div className={styles.tags}>
							{solutionMock.tags.map((tag) => (
								<span className={styles.tag} key={tag.id}>
									{tag.title}
								</span>
							))}
						</div>
					</div>

					<div className={styles.imageWrapper}>
						<img className={styles.image} src={solutionMock.image} alt={solutionMock.title} />
					</div>
				</Container>
			</div>
		</Section>
	)
}
