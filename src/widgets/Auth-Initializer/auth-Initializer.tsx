import { useEffect } from 'react'
import { useActions } from 'src/app/store/hooks/actions'
import { useCheckAuthQuery } from 'src/features/auth/api/auth.api'

export const AuthInitializer = () => {
	const { setAuth, setUser } = useActions()
	const token = localStorage.getItem('token')

	const { data, isError } = useCheckAuthQuery(null, {
		skip: !token,
	})

	useEffect(() => {
		if (data?.status === 'ok' && data.token && data.user) {
			localStorage.setItem('token', String(data.token))
			localStorage.setItem('userID', String(data.user.id))

			setAuth(true)
			setUser(data.user)
		}

		if (isError) {
			localStorage.removeItem('token')
			localStorage.removeItem('userID')

			setAuth(false)
			setUser(null)
		}
	}, [data, isError, setAuth, setUser])

	return null
}
