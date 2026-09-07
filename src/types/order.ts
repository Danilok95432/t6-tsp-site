export type DeliveryOption = {
	id?: string
	title?: string
	value: string
	label: string
	description?: string
	address?: string
	price?: string | number
	days?: string
}

export type PaymentOption = {
	id?: string
	value: string
	label: string
	description?: string
}

export type CartItem = {
	id: string
	title: string
	price: number
	quantity: number
}

export type CartUserListItem = {
	id: string
	item_name: string
	item_count: string
	item_price: string
	category_id: string
	use_weight: boolean
	item_weight: string
}

export type OneItemOrder = {
	id: string
	order_date: string
	price_items: string
	price_delivery: string
	price_total: string
	items_count: string
	delivery: string
	payment: string
	status: string
	status_keyword: string
	finish_date: string
	cancel_date: string
	delivery_date: string
	order_items: CartUserListItem[]
}

export type OrderItem = {
	number: string
	id: string
	items_count: string
	order_date: string
	order_items: CartUserListItem[]
	price_delivery: string
	price_total: string
	price_items: string
	delivery: string
	status: string
	deliverDate: string
	type: 'current' | 'completed' | 'canceled'
	status_keyword: string
	finish_date?: string
	cancel_date?: string
	delivery_date?: string
}

export type EditSection = 'region' | 'delivery' | 'payment' | 'customer' | null

export type UserOrdersList = {
	orders: OrderItem[]
}

export type UserOrderResponse = {
	order: OrderItem
}
