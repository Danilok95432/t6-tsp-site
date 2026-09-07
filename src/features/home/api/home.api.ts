import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'src/shared/helpers/base-query'
import { ReducerPath } from 'src/shared/helpers/consts'
import {
	type SliderListResponse,
	type AwardsListResponse,
	type BestListResponse,
	type EliteListResponse,
	type ReviewListResponse,
	type PromoListResponse,
	type PagesListResponse,
	type PageFooterItem,
} from 'src/types/home'

export const homeApi = createApi({
	reducerPath: ReducerPath.Home,
	tagTypes: ['Home'],
	baseQuery: baseQueryWithReauth,
	endpoints: (build) => ({
		getFaqById: build.query<null, string>({
			query: (idEvent) => ({
				url: `home/faq`,
				params: {
					id_event: idEvent,
				},
			}),
		}),
		getPromoList: build.query<PromoListResponse, null>({
			query: () => ({
				url: `promo/list`,
			}),
		}),
		getAwardsList: build.query<AwardsListResponse, null>({
			query: () => ({
				url: `awards/list`,
			}),
		}),
		getSliderList: build.query<SliderListResponse, null>({
			query: () => ({
				url: `slider/list`,
			}),
		}),
		getBestList: build.query<BestListResponse, string>({
			query: (userId) => ({
				url: `best/list`,
				params: {
					id_user: userId,
				},
			}),
		}),
		getInfoEliteList: build.query<EliteListResponse, null>({
			query: () => ({
				url: `advs/list`,
			}),
		}),
		getReviewsList: build.query<ReviewListResponse, null>({
			query: () => ({
				url: `reviews/list`,
			}),
		}),
		getFooterPagesList: build.query<PagesListResponse, null>({
			query: () => ({
				url: `pages/list`,
			}),
		}),
		getFooterPageInfo: build.query<PageFooterItem, string>({
			query: (type) => ({
				url: `pages/getpage`,
				params: {
					type,
				},
			}),
		}),
	}),
})

export const {
	useGetFaqByIdQuery,
	useGetAwardsListQuery,
	useGetSliderListQuery,
	useGetBestListQuery,
	useGetInfoEliteListQuery,
	useGetReviewsListQuery,
	useGetPromoListQuery,
	useGetFooterPageInfoQuery,
	useGetFooterPagesListQuery,
} = homeApi
