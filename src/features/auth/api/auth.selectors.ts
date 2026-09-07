import { NameSpace } from 'src/shared/helpers/consts'
import { type State } from 'src/types/state'

export const isAuthUser = (state: State) => state[NameSpace.Auth].isAuth
export const authUser = (state: State) => state[NameSpace.Auth].currentUser
