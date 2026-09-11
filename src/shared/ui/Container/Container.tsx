import React, { type FC, type ReactNode } from 'react'
import classNames from 'classnames'
import styles from './index.module.scss'

type ContainerProps = {
	className?: string
	children: ReactNode
	off?: boolean
	bigCont?: boolean
}

export const Container: FC<ContainerProps> = ({ className, children, off, bigCont }) => {
	const combinedClassName = classNames(styles.container, className, {
		[styles.offCont]: off,
		[styles.bigCont]: bigCont,
	})

	return <div className={combinedClassName}>{children}</div>
}
