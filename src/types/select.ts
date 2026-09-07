export type SelOption = {
	label: string
	value: string
}

export type RoleSelOption = {
	label: string
	value: string
	label_single?: string
}

export type SubEventOptions = {
	label: string
	value: string
	id_event_role: string
	selected: boolean
	use_group: boolean
}

export type MultiSelOption = {
	label: string
	value: string
	selected: boolean
	is_group?: boolean
}
