import { createApi } from '@reduxjs/toolkit/query/react'
import { type FieldValues } from 'react-hook-form'
import { baseQueryWithReauth } from 'src/shared/helpers/base-query'
import { ReducerPath } from 'src/shared/helpers/consts'
import {
	type CatalogListItemsResponse,
	type CardItem,
	type ICatalog,
	type CartListItemsResponse,
	type ILKInfoOrder,
} from 'src/types/cardItem'
import { type UserOrderResponse, type UserOrdersList } from 'src/types/order'
import { type CreatePaymentResponse } from 'src/types/payments'

type BaseMutationResponse = {
	status: string
	errortext?: string
	id?: string
}

export type CartMutationResponse = BaseMutationResponse & {
	item_count?: string
	cart_items?: string
}

const getAuthHeaders = (withBearer = false) => {
	const token = localStorage.getItem('token')

	if (!token) {
		return undefined
	}

	return {
		Authorization: withBearer ? `Bearer ${token}` : token,
	}
}

export const catalogApi = createApi({
	reducerPath: ReducerPath.Catalog,
	tagTypes: ['Catalog', 'CatalogItem', 'Cart', 'Favorites', 'Orders'],
	baseQuery: baseQueryWithReauth,
	endpoints: (build) => ({
		getCatalog: build.query<
			ICatalog,
			{ id?: string; limit?: string; step?: string; userId?: string }
		>({
			query: ({ id, limit, step, userId }) => ({
				url: 'catalog/item',
				params: {
					id,
					limit,
					step,
					id_user: userId,
				},
			}),
			providesTags: ['Catalog', 'Cart', 'Favorites'],
		}),

		getItemCatalogByID: build.query<CardItem, { id: string; userId?: string }>({
			query: ({ id, userId }) => ({
				url: 'catalog/tovar',
				params: {
					id,
					id_user: userId,
				},
			}),
			providesTags: (_result, _error, { id }) => [
				'Catalog',
				'Cart',
				'Favorites',
				{ type: 'CatalogItem' as const, id },
			],
		}),

		getCategoriesCatalog: build.query<CatalogListItemsResponse, null>({
			query: () => ({
				url: 'catalog/list_items',
			}),
		}),

		getUserFavorites: build.query<ICatalog, null>({
			query: () => ({
				url: 'user_favourites/list',
				headers: getAuthHeaders(true),
			}),
			providesTags: ['Favorites'],
		}),

		getItemsCart: build.query<CartListItemsResponse, string>({
			query: (idUser) => ({
				url: 'cart/list',
				headers: getAuthHeaders(),
				params: {
					id_user: idUser,
				},
			}),
			providesTags: ['Cart'],
		}),

		getCountItemsCart: build.query<{ cart_items: string }, string>({
			query: (idUser) => ({
				url: 'cart/items_count',
				headers: getAuthHeaders(),
				params: {
					id_user: idUser,
				},
			}),
			providesTags: ['Cart'],
		}),

		addItemToCart: build.mutation<CartMutationResponse, FieldValues>({
			query: (formData) => ({
				url: 'cart/add_to_cart',
				headers: getAuthHeaders(),
				method: 'POST',
				body: formData,
			}),
			invalidatesTags: ['Cart', 'Catalog', 'CatalogItem'],
		}),

		deleteItemFromCart: build.mutation<BaseMutationResponse | string, FieldValues>({
			query: (formData) => ({
				url: 'cart/delete_from_cart',
				headers: getAuthHeaders(true),
				method: 'POST',
				body: formData,
			}),
			invalidatesTags: ['Cart', 'Catalog', 'CatalogItem'],
		}),

		clearCart: build.mutation<null, FieldValues>({
			query: (formData) => ({
				url: 'cart/clear',
				headers: getAuthHeaders(true),
				method: 'POST',
				body: formData,
			}),
			invalidatesTags: ['Cart', 'Catalog', 'CatalogItem'],
		}),

		addToFavorites: build.mutation<BaseMutationResponse, FieldValues>({
			query: (formData) => ({
				url: 'favourite/add',
				headers: getAuthHeaders(),
				method: 'POST',
				body: formData,
			}),
			invalidatesTags: ['Favorites', 'Catalog', 'CatalogItem'],
		}),

		deleteFromFavorites: build.mutation<BaseMutationResponse, FieldValues>({
			query: (formData) => ({
				url: 'favourite/delete',
				headers: getAuthHeaders(),
				method: 'POST',
				body: formData,
			}),
			invalidatesTags: ['Favorites', 'Catalog', 'CatalogItem'],
		}),

		getItemsFavorites: build.query<ICatalog, string>({
			query: (idUser) => ({
				url: 'favourite/list',
				headers: getAuthHeaders(true),
				params: {
					id_user: idUser,
				},
			}),
			providesTags: ['Favorites'],
		}),

		getLkInfoForOrder: build.query<ILKInfoOrder, string>({
			query: (idUser) => ({
				url: 'order/getinfo',
				headers: getAuthHeaders(true),
				params: {
					id_user: idUser,
				},
			}),
		}),

		saveOrderInfo: build.mutation<BaseMutationResponse, FieldValues>({
			query: (formData) => ({
				url: 'order/save',
				headers: getAuthHeaders(),
				method: 'POST',
				body: formData,
			}),
			invalidatesTags: ['Cart'],
		}),
		getUserOrdersList: build.query<UserOrdersList, { idUser: string; type?: string }>({
			query: ({ idUser, type }) => ({
				url: 'user_orders/list',
				headers: getAuthHeaders(true),
				params: {
					id_user: idUser,
					type,
				},
			}),
			providesTags: ['Orders'],
		}),
		getUserOrdersListItemInfo: build.query<UserOrderResponse, string>({
			query: (id) => ({
				url: 'user_orders/item',
				headers: getAuthHeaders(true),
				params: {
					id,
				},
			}),
			providesTags: ['Orders'],
		}),
		cancelOrderItem: build.mutation<UserOrdersList, string>({
			query: (id) => ({
				url: 'user_orders/cancel',
				headers: getAuthHeaders(true),
				params: {
					id,
				},
			}),
			invalidatesTags: ['Orders'],
		}),
		createPayment: build.mutation<CreatePaymentResponse, FieldValues>({
			query: (body) => ({
				url: '/payments/create',
				method: 'POST',
				body,
			}),
		}),
	}),
})

export const {
	useGetCatalogQuery,
	useGetItemCatalogByIDQuery,
	useGetCategoriesCatalogQuery,
	useGetUserFavoritesQuery,
	useAddItemToCartMutation,
	useDeleteItemFromCartMutation,
	useClearCartMutation,
	useGetItemsCartQuery,
	useAddToFavoritesMutation,
	useDeleteFromFavoritesMutation,
	useGetItemsFavoritesQuery,
	useGetLkInfoForOrderQuery,
	useGetCountItemsCartQuery,
	useSaveOrderInfoMutation,
	useGetUserOrdersListQuery,
	useGetUserOrdersListItemInfoQuery,
	useCancelOrderItemMutation,
	useCreatePaymentMutation,
} = catalogApi
