import { Navigate, Outlet, useLocation } from 'react-router-dom'

export const PrivateRoute = () => {
	const location = useLocation()
	const token = localStorage.getItem('token')

	if (!token) {
		return <Navigate to='/auth' replace state={{ from: location }} />
	}

	return <Outlet />
}
