import { INITIAL_COUNT } from '../../consts'
import styles from './index.module.scss'

export const ProductsLoader = () => {
	return (
		<>
			{Array.from({ length: INITIAL_COUNT }).map((_, index) => (
				<div className={styles.productSkeleton} key={index}>
					<div className={styles.productImageSkeleton} />

					<div className={styles.productTitleSkeleton} />

					<div className={styles.productPriceSkeleton} />
				</div>
			))}
		</>
	)
}
