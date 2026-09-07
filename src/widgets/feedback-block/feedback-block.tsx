import { Link } from 'react-router-dom'
import { AppRoute } from 'src/app/router/consts'
import { FlexRow } from 'src/shared/ui/FlexRow/FlexRow'
import cn from 'classnames'

import styles from './index.module.scss'

type Props = {
	fullScreenMode?: boolean
}

export const FeedBackBlock = ({ fullScreenMode }: Props) => {
	return (
		<FlexRow className={cn(styles.feedbackBlock, { [styles.full]: fullScreenMode })}>
			<p>Напишите нам, если что-то не работает или Вы знаете, как сделать лучше</p>
			<Link to={`/${AppRoute.Feedback}`} className={styles.link}>
				Написать нам
			</Link>
		</FlexRow>
	)
}
