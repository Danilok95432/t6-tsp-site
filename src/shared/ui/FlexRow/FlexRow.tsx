import { type FC, type ReactNode, type HTMLAttributes } from 'react'
import classNames from 'classnames'
import styles from './index.module.scss'

type FlexRowProps = HTMLAttributes<HTMLDivElement> & {
	className?: string
	children: ReactNode
}

export const FlexRow: FC<FlexRowProps> = ({ className, children, ...props }) => {
	const combinedClassName = classNames(styles.flexRowContainer, className)

	return (
		<div className={combinedClassName} {...props}>
			{children}
		</div>
	)
}
