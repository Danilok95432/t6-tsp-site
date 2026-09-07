import { useLazyCheckAuthQuery } from 'src/features/auth/api/auth.api'
import { MainRoutes } from '../router/MainRoutes'
import { useActions } from '../store/hooks/actions'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import { initYandexMetrika } from 'src/services/metrika'
import { useGetSiteSettingsQuery } from 'src/features/settings/api/settings.api'
import { getYandexMetrikaId } from 'src/shared/helpers/utils'

export const App = () => {
	const [checkAuth, { data: authData }] = useLazyCheckAuthQuery()
	const { setAuth, setUser } = useActions()
	const { data } = useGetSiteSettingsQuery(null)

	useEffect(() => {
		if (localStorage.getItem('token')) {
			checkAuth(null).catch((err) => console.error(err))
		}
	}, [])

	useEffect(() => {
		if (authData) {
			localStorage.setItem('token', authData.token)
			setAuth(true)
			setUser(authData.user)
		}
	}, [authData])

	useEffect(() => {
		const metricId = getYandexMetrikaId(data?.metric)

		if (!metricId) return

		initYandexMetrika({
			id: metricId,
		})
	}, [data?.metric])

	return (
		<Routes>
			<Route path='/*' element={<MainRoutes />} />
		</Routes>
	)
}
