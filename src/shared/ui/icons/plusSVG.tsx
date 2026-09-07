import { type FC } from 'react'

type SVGProps = {
	color?: string
}

export const PlusSVG: FC<SVGProps> = ({ color = 'black' }) => {
	return (
		<svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
			<path
				d='M8.84785 8.85535V16H7.11857V8.85535H0V7.14465H7.11857V0H8.84785V7.14465H16V8.85535H8.84785Z'
				fill={color}
			/>
		</svg>
	)
}
