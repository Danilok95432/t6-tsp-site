import { configureStore } from '@reduxjs/toolkit'
import { authApi } from 'src/features/auth/api/auth.api'
import { authReducer } from 'src/features/auth/api/auth.slice'
import { cartReducer } from 'src/features/cart/cartSlice'
import { catalogApi } from 'src/features/catalog/api/catalog.api'
import { homeApi } from 'src/features/home/api/home.api'
import { modalReducer } from 'src/features/modal/store/modal.slice'
import { settingsApi } from 'src/features/settings/api/settings.api'
import { NameSpace } from 'src/shared/helpers/consts'
import { breadCrumbsReducer } from 'src/widgets/breadcrumbs/store/bread-crumbs.slice'

export const store = configureStore({
	reducer: {
		[NameSpace.Modal]: modalReducer,
		[NameSpace.Auth]: authReducer,
		[homeApi.reducerPath]: homeApi.reducer,
		[authApi.reducerPath]: authApi.reducer,
		[catalogApi.reducerPath]: catalogApi.reducer,
		[settingsApi.reducerPath]: settingsApi.reducer,
		[NameSpace.BreadCrumbs]: breadCrumbsReducer,
		cart: cartReducer,
	},
	devTools: true,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({ serializableCheck: false }).concat(
			homeApi.middleware,
			authApi.middleware,
			catalogApi.middleware,
			settingsApi.middleware,
		),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
