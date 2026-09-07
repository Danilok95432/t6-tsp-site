import { createBreakpoint } from 'react-use'
import { DisplayBreakpoints } from 'src/shared/helpers/consts'

export const useBreakPoint = createBreakpoint({
	sliderBtnsPoint: 1450,
	L: DisplayBreakpoints.Lg,
	ShortLg: DisplayBreakpoints.ShortLg,
	M: DisplayBreakpoints.Md,
	S: DisplayBreakpoints.Sm,
})
