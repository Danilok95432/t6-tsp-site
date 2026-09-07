import styles from './index.module.scss'

type Props = {
	title: string
	isEditing: boolean
	canEdit?: boolean
	onEdit?: () => void
	children: React.ReactNode
}

export const OrderStep = ({ title, isEditing, canEdit, onEdit, children }: Props) => {
	return (
		<div className={styles.step}>
			<div className={styles.header}>
				<h2 className={styles.title}>{title}</h2>

				{!isEditing && canEdit && onEdit && (
					<button type='button' className={styles.editBtn} onClick={onEdit}>
						Изменить
					</button>
				)}
			</div>

			<div>{children}</div>
		</div>
	)
}
