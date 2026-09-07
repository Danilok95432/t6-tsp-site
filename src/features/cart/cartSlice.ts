// src/features/cart/model/cartSlice.ts

import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from 'src/app/store'

interface CartState {
	totalCount: number
	items: Record<string, number>
}

const initialState: CartState = {
	totalCount: 0,
	items: {},
}

export const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		setCartItems: (
			state,
			action: PayloadAction<Array<{ id_item: string | number; item_count: string | number }>>,
		) => {
			const items: Record<string, number> = {}
			let totalCount = 0

			action.payload.forEach((item) => {
				const id = String(item.id_item)
				const count = Math.max(0, Number(item.item_count) || 0)

				if (count > 0) {
					items[id] = count
					totalCount += count
				}
			})

			state.items = items
			state.totalCount = totalCount
		},

		setCartItemCount: (state, action: PayloadAction<{ id: string | number; count: number }>) => {
			const id = String(action.payload.id)

			const prevCount = state.items[id] ?? 0
			const nextCount = Math.max(0, action.payload.count)

			if (nextCount === 0) {
				// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
				delete state.items[id]
			} else {
				state.items[id] = nextCount
			}

			state.totalCount = Math.max(0, state.totalCount + nextCount - prevCount)
		},

		clearCart: (state) => {
			state.items = {}
			state.totalCount = 0
		},
	},
})

export const { setCartItems, setCartItemCount, clearCart } = cartSlice.actions

export const selectCartTotalCount = (state: RootState) => state.cart.totalCount

export const selectCartItemCount = (id: string | number) => (state: RootState) => {
	return state.cart.items[String(id)] ?? 0
}

export const cartReducer = cartSlice.reducer
