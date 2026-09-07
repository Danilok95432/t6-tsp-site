export type CreatePaymentRequest = {
	id_order: string | number
	id_siteuser?: string | number
}

export type CreatePaymentResponse = {
	confirmation_token: string
	yoo_id?: string
}
