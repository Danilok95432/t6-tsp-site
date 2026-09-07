const YOOKASSA_WIDGET_SCRIPT_ID = 'yookassa-checkout-widget'

export const loadYookassaWidget = async () => {
	return await new Promise<void>((resolve, reject) => {
		if (window.YooMoneyCheckoutWidget) {
			resolve()
			return
		}

		const existingScript = document.getElementById(YOOKASSA_WIDGET_SCRIPT_ID)

		if (existingScript) {
			existingScript.addEventListener('load', () => resolve())
			existingScript.addEventListener('error', () =>
				reject(new Error('Не удалось загрузить виджет ЮKassa')),
			)
			return
		}

		const script = document.createElement('script')

		script.id = YOOKASSA_WIDGET_SCRIPT_ID
		script.src = 'https://yookassa.ru/checkout-widget/v1/checkout-widget.js'
		script.async = true

		script.onload = () => resolve()
		script.onerror = () => reject(new Error('Не удалось загрузить виджет ЮKassa'))

		document.body.appendChild(script)
	})
}
