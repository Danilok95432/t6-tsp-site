import React, { type FC, type ReactNode } from 'react'
import classNames from 'classnames'
import styles from './index.module.scss'

type SectionProps = {
	className?: string
	children: ReactNode
	id?: string
}

export const Section: FC<SectionProps> = ({ className, children, id }) => {
	const combinedClassName = classNames(styles.section, className)

	return (
		<section id={id} className={combinedClassName}>
			{children}
		</section>
	)
}
