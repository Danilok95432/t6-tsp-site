import { type FC } from 'react'

import styles from './index.module.scss'

type RatingStarsProps = {
	value: number
	idPrefix: string
	className?: string
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n))

const slugify = (s: string) =>
	s
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/gi, '-')
		.replace(/(^-|-$)/g, '')

export const RatingStars: FC<RatingStarsProps> = ({ value, idPrefix, className }) => {
	const v = Math.max(0, Math.min(5, Number.isFinite(value) ? value : 0))
	const prefix = slugify(idPrefix)

	return (
		<div className={`${styles.ratingRow} ${className ?? ''}`} aria-label={`Рейтинг ${v} из 5`}>
			{Array.from({ length: 5 }, (_, i) => {
				const fill = clamp01(v - i) // 0..1
				const pct = Math.round(fill * 100)
				const gid = `${prefix}-star-${i}-${pct}` // уникальный id для gradient

				return (
					<span key={i} className={styles.star} aria-hidden='true'>
						<svg viewBox='0 0 24 24' className={styles.starSvg}>
							<defs>
								<linearGradient id={gid} x1='0' x2='1' y1='0' y2='0'>
									<stop offset={`${pct}%`} stopColor='currentColor' />
									<stop offset={`${pct}%`} stopColor='transparent' />
								</linearGradient>
							</defs>

							{/* слабый фон звезды */}
							<path
								className={styles.starBg}
								d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
								fill='currentColor'
							/>

							{/* заливка (в т.ч. половина) */}
							<path
								className={styles.starFill}
								d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
								fill={`url(#${gid})`}
							/>
						</svg>
					</span>
				)
			})}
		</div>
	)
}
