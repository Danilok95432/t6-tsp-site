export {}

type YooKassaWidgetEvent = 'success' | 'fail' | 'complete' | 'modal_close'

type YooKassaWidget = {
	render: (containerId?: string) => Promise<void>
	destroy: () => void
	on: (event: YooKassaWidgetEvent, callback: () => void) => void
}

type YooKassaWidgetConstructorParams = {
	confirmation_token: string
	return_url?: string
	error_callback: (error: unknown) => void
	customization?: {
		modal?: boolean
		colors?: {
			control_primary?: string
			control_primary_content?: string
			background?: string
			text?: string
			border?: string
			control_secondary?: string
		}
	}
}

declare global {
	interface Window {
		YooMoneyCheckoutWidget?: new (params: YooKassaWidgetConstructorParams) => YooKassaWidget
	}
}
