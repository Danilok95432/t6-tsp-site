/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/metrika.ts

declare global {
	interface Window {
		ym?: (...args: unknown[]) => void
	}
}

type MetrikaConfig = {
	id: number | string
}

export function initYandexMetrika({ id }: MetrikaConfig) {
	if (document.querySelector('script[data-yandex-metrika="true"]')) {
		return
	}

	const script = document.createElement('script')
	script.async = true
	script.src = 'https://mc.yandex.ru/metrika/tag.js'
	script.dataset.yandexMetrika = 'true'

	document.head.appendChild(script)

	window.ym =
		window.ym ??
		function (...args: unknown[]) {
			;(window.ym as any).a = (window.ym as any).a || []
			;(window.ym as any).a.push(args)
		}
	;(window.ym as any).l = Date.now()

	window.ym(id, 'init', {
		clickmap: true,
		trackLinks: true,
		accurateTrackBounce: true,
		webvisor: true,
	})
}
