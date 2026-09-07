import { NameSpace } from 'src/shared/helpers/consts'
import { type State } from 'src/types/state'

export const getAdditionalCrumbs = (state: State) => state[NameSpace.BreadCrumbs].additionalCrumbs
