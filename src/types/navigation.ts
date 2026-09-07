import { type ReactNode } from 'react'

export type NavigationItem = {
	title: string
	link: string
	accent?: boolean
	icon?: ReactNode
	childItems?: NavigationItem[]
	exact?: boolean
}
