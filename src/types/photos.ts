export type ImageItem = {
	id: string
	thumbnail: string
	original: string
}

export type ImageItemWithText = {
	id: string
	thumbnail: string
	original?: string
	title?: string
	author?: string
	desc?: string
}

export type ImageInfoResponse = {
	id: string
	thumbnail: string
	original?: string
	title?: string
	author?: string
	status: string
	desc?: string
}

export type ImageNewIdResponse = {
	id: string
	status: string
}

export type ImageUploadResponse = {
	status: string
	id_catimage: string
	images: ImageItem[]
}
