import { type store } from 'src/app/store'

export type State = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
