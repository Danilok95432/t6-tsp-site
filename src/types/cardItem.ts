import { type ImageItemWithText } from './photos'
import { type SelOption } from './select'

export interface MoreCardItem {
	id: string
	title: string
	item_weight: string
	item_price: string
	img: ImageItemWithText[]
}

export interface CardItem {
	id: string
	images: ImageItemWithText[]
	type?: 'chocolate' | 'candy' | 'set' | 'coctail' | 'special'
	title: string
	artikul: string
	item_weight: string
	item_price: string
	item_desc: string
	short: string
	full: string
	img: ImageItemWithText[]
	moreitems: CardItem[]
	favourite: boolean
	in_cart: boolean
	cart_count: number
	category_id: string
	use_weight: boolean
	weight_default: string
	weight_one: string
	weight_price_kg: string
	item_width: string
	item_length: string
	item_height: string
}

export interface IFavotiteItem {
	id: string
	title: string
	weight: string
	price: string
	img: ImageItemWithText[]
}

export interface IFavoriteCatalog {
	items: IFavotiteItem[]
	totalitems: number
}

export type ItemsInOrder = {
	id_item: string
	item_name: string
	item_count: string
	item_price: string
	item_fullprice: string
}

export type DeliveryOption = {
	label: string
	value: string
	price: string
	days: string
	address: string
}

export interface ILKInfoOrder {
	citys: SelOption[]
	payments: SelOption[]
	delivery: DeliveryOption[]
	firstname: string
	surname: string
	email: string
	telphone: string
	street: string
	dom: string
	room: string
	items: ItemsInOrder[]
	cart_price: string
	comment: string
}

export interface ICatalog {
	items: CardItem[]
	title: string
	totalitems: number
}

export type SubCatItem = {
	id: string
	title: string
}

export type CatalogListItem = {
	id: string
	title: string
	main_button: string
	img: ImageItemWithText[]
	subcats: SubCatItem[]
}

export interface CatalogListItemsResponse {
	catalogs: CatalogListItem[]
}

export interface CartListItem {
	id_item: string
	item_name: string
	item_count: string
	item_price: string
	item_fullprice: string
	category_id: string
	use_weight: string
	item_weight: string
}

export interface CartListItemsResponse {
	items: CartListItem[]
	cart_price: string
}
