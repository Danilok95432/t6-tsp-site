import { type SelOption } from './select'

export type User = {
	id: string
	email: string
	username: string
}

export type LoginData = {
	username: string
	password: string
}

export type AuthResponse = {
	token: string
	user: User
	status: string
}

export type FeedbackInfoResponse = {
	firstname: string
	telphone: string
	email: string
	text: string
	message_themes: SelOption[]
	topic_id: string
}

export type PersonalResponse = {
	firstname: string
	surname: string
	email: string
	telphone: string
	use_spam: boolean
	use_company: boolean
	org_name: string
	citys: SelOption[]
	citys_id: string
	street: string
	dom: string
	room: string
}
