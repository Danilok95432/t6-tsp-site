import {
	type BaseQueryFn,
	type FetchArgs,
	fetchBaseQuery,
	type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { authActions } from 'src/features/auth/api/auth.slice'
import { MAIN_PROD_URL } from './consts'

const baseQuery = fetchBaseQuery({
	baseUrl: MAIN_PROD_URL,
	prepareHeaders: (headers) => {
		const token = localStorage.getItem('token')

		if (token) {
			headers.set('Authorization', token)
		}

		return headers
	},
})

const getUrl = (args: string | FetchArgs) => {
	return typeof args === 'string' ? args : args.url
}

const isPublicAuthEndpoint = (args: string | FetchArgs) => {
	const url = getUrl(args)

	return (
		url.includes('/auth/auth') ||
		url.includes('/registration') ||
		url.includes('/reg_recovery') ||
		url.includes('/auth/refresh')
	)
}

export const baseQueryWithReauth: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError
> = async (args, api, extraOptions) => {
	const result = await baseQuery(args, api, extraOptions)

	if (result.error?.status === 401 && !isPublicAuthEndpoint(args)) {
		api.dispatch(authActions.setAuth(false))
		api.dispatch(authActions.setUser(null))

		localStorage.removeItem('token')
		localStorage.removeItem('userID')
	}

	return result
}
