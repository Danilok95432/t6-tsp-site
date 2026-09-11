import { type FC } from 'react'

type SVGPROPS = {
	color?: string
	className?: string
}

export const DocumentSVG: FC<SVGPROPS> = ({ color = '#D4D4D4', className }) => {
	return (
		<svg
			width='291'
			height='384'
			viewBox='0 0 291 384'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			className={className}
		>
			<path
				d='M8 0.5H240.451C242.766 0.500038 244.952 1.56943 246.373 3.39746L288.922 58.1406C289.945 59.4567 290.5 61.0763 290.5 62.7432V376C290.5 380.142 287.142 383.5 283 383.5H8C3.85786 383.5 0.5 380.142 0.5 376V8C0.5 3.85787 3.85786 0.5 8 0.5Z'
				fill='white'
				stroke={color}
			/>
			<path d='M243.43 1.5V53C243.43 57.4183 247.011 61 251.43 61H290.531' stroke={color} />
		</svg>
	)
}
