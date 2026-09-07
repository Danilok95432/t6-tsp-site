import { type ReactNode } from 'react'

import { createSlice } from '@reduxjs/toolkit'
import { NameSpace } from 'src/shared/helpers/consts'

type ModalState = {
	content: null | ReactNode
}

const initialState: ModalState = {
	content: null,
}

const modalSlice = createSlice({
	name: NameSpace.Modal,
	initialState,
	reducers: {
		openModal: (state, action) => {
			state.content = action.payload
		},
		closeModal: (state) => {
			state.content = null
		},
	},
})

export const modalActions = modalSlice.actions

export const modalReducer = modalSlice.reducer
