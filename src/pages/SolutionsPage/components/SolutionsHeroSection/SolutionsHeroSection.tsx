import { Link } from 'react-router-dom'

import { Container } from 'src/shared/ui/Container/Container'
import { Section } from 'src/shared/ui/Section/section'

import mockImg from 'src/assets/img/solutionsMockImg.png'

import styles from './index.module.scss'
import { ArrowSVG } from 'src/shared/ui/icons/arrowSVG'

export const SolutionsHeroSection = () => {
	return (
		<Section className={styles.hero}>
			<div className={styles.wrapper}>
				<Container className={styles.cont}>
					<div className={styles.content}>
						<div className={styles.breadcrumbs}>
							<Link to='/'>Главная</Link>

							<ArrowSVG />

							<span>Все решения</span>
						</div>

						<h1 className={styles.title}>Все решения</h1>

						<p className={styles.description}>
							Повышаем безопасность, автоматизируем внутренние процессы, обслуживаем и обновляем
							установленные системы
						</p>
					</div>

					<div className={styles.imageWrapper}>
						<img src={mockImg} alt='' className={styles.image} />
					</div>
				</Container>
			</div>
		</Section>
	)
}
