import { type SelOption } from './select'

export type SettingsResponse = {
	use_promo: boolean | string
	use_awards: boolean | string
	use_mainslider: boolean | string
	use_best: boolean | string
	use_adv: boolean | string
	use_catalog: boolean | string
	use_reviews: boolean | string
	contact_address: string
	contact_telphone: string
	contact_email: string
	contact_vk: string
	info_copyright: string
	site_title: string
	metric: string
}

export type CitysResponse = {
	citys: SelOption[]
}
