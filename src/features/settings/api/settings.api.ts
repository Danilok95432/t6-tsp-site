import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'src/shared/helpers/base-query'
import { ReducerPath } from 'src/shared/helpers/consts'
import { type CitysResponse, type SettingsResponse } from 'src/types/settings'

export const settingsApi = createApi({
	reducerPath: ReducerPath.Settings,
	tagTypes: ['Settings'],
	baseQuery: baseQueryWithReauth,
	endpoints: (build) => ({
		getSiteSettings: build.query<SettingsResponse, null>({
			query: () => ({
				url: `sitesettings/getinfo`,
			}),
		}),
		getSearchCity: build.query<CitysResponse, string>({
			query: (search) => ({
				url: `order/search_city`,
				params: { search },
			}),
		}),
	}),
})

export const { useGetSiteSettingsQuery, useGetSearchCityQuery } = settingsApi
