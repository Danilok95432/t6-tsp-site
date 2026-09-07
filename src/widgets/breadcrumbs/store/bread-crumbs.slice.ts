import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { NameSpace } from 'src/shared/helpers/consts'

type BreadCrumbsState = {
	additionalCrumbs: string | null
}

const initialState: BreadCrumbsState = {
	additionalCrumbs: null,
}

export const breadCrumbsSlice = createSlice({
	name: NameSpace.BreadCrumbs,
	initialState,
	reducers: {
		setAdditionalCrumbs: (state, action: PayloadAction<string | null>) => {
			state.additionalCrumbs = action.payload
		},
	},
})

export const breadCrumbsActions = breadCrumbsSlice.actions
export const breadCrumbsReducer = breadCrumbsSlice.reducer
