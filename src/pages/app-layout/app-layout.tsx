import { Outlet } from 'react-router-dom'
import { FlexRow } from 'src/shared/ui/FlexRow/FlexRow'
import { Footer } from 'src/shared/ui/Footer/Footer'
import { Header } from 'src/shared/ui/Header/Header'

import styles from './index.module.scss'

export const AppLayout = () => {
	return (
		<FlexRow className={styles.app}>
			<Header />
			<Outlet />
			<Footer />
		</FlexRow>
	)
}
