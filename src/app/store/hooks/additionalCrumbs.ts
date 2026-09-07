import { useEffect } from 'react'
import { useActions } from './actions'

export const useAdditionalCrumbs = (additionalCrumb: string | undefined) => {
	const { setAdditionalCrumbs } = useActions()

	useEffect(() => {
		if (additionalCrumb) {
			setAdditionalCrumbs(additionalCrumb)
		}
		return () => {
			setAdditionalCrumbs(null)
		}
	}, [additionalCrumb])
}
