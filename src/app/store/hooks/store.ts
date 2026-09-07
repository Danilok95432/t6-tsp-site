import { type TypedUseSelectorHook, useSelector } from 'react-redux'
import type { State } from 'src/types/state'

export const useAppSelector: TypedUseSelectorHook<State> = useSelector
