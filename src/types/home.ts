import { type ImageItemWithText } from './photos'

export type AwardsItem = {
	id: string
	img: ImageItemWithText[]
	itemdesc: string
	itemname: string
	title: string
	use_main: boolean
	color: string
}

export type AwardsListResponse = {
	awards: AwardsItem[]
}

export type SliderItem = {
	id: string
	img: ImageItemWithText[]
	itemlink: string
	title: string
	itemdesc: string
	use_main: boolean
	category_id: string
}

export type SliderListResponse = {
	slider: SliderItem[]
}

export type ReviewItem = {
	id: string
	name: string
	rating: string
	role: string
	comment: string
	date: string
}

export type ReviewListResponse = {
	reviews: ReviewItem[]
}

export type PageFooterItem = {
	id: string
	page_name: string
	parent_name: string
	page_text: string
}

export type PagesListResponse = {
	pages: PageFooterItem[]
}

export type BestItem = {
	id: string
	title: string
	item_weight: string
	item_price: string
	img: ImageItemWithText[]
	category_id: string
	favourite: boolean
}

export type BestListResponse = {
	best: BestItem[]
}

export type EliteItem = {
	id: string
	adv_text: string
}

export type EliteListResponse = {
	block_name: string
	advs: EliteItem[]
}

export type PromoListResponse = {
	block_name: string
	block_desc: string
	img: ImageItemWithText[]
}
