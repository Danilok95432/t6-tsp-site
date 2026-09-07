import { type FC } from 'react'

import cn from 'classnames'
import { createPortal } from 'react-dom'

import { useAppSelector } from 'src/app/store/hooks/store'
import { getModalContent } from './store/modal.selectors'

import styles from './index.module.scss'

export const Modal: FC = () => {
	const currentModalContent = useAppSelector(getModalContent)

	if (!currentModalContent) {
		return null
	}

	return createPortal(
		<div className={cn(styles.modal, { [styles.active]: currentModalContent })}>
			<div className={cn(styles.modalContent)} onClick={(e) => e.stopPropagation()}>
				{currentModalContent}
			</div>
		</div>,
		document.getElementById('modal-root') as HTMLElement,
	)
}
