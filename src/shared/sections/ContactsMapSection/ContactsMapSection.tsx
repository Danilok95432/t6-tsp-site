import { useEffect, useRef } from 'react'

import { Container } from 'src/shared/ui/Container/Container'
import { Section } from 'src/shared/ui/Section/section'

import styles from './index.module.scss'

declare global {
	interface Window {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		ymaps?: any
	}
}

const YANDEX_MAPS_API_KEY = 'YOUR_YANDEX_MAPS_API_KEY'

const address = 'Тамбов, бульвар Энтузиастов, 2А'

const loadYandexMaps = async (): Promise<void> => {
	return await new Promise((resolve, reject) => {
		if (window.ymaps) {
			window.ymaps.ready(() => resolve())
			return
		}

		const existingScript = document.querySelector('script[data-yandex-maps]')

		if (existingScript) {
			existingScript.addEventListener('load', () => {
				window.ymaps?.ready(() => resolve())
			})

			existingScript.addEventListener('error', reject)

			return
		}

		const script = document.createElement('script')

		script.src = `https://api-maps.yandex.ru/2.1/?apikey=${YANDEX_MAPS_API_KEY}&lang=ru_RU`
		script.async = true
		script.dataset.yandexMaps = 'true'

		script.onload = () => {
			window.ymaps?.ready(() => resolve())
		}

		script.onerror = () => {
			reject(new Error('Не удалось загрузить Яндекс Карты'))
		}

		document.head.appendChild(script)
	})
}

export const ContactsMapSection = () => {
	const mapRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let mapInstance: any

		const initMap = async () => {
			try {
				await loadYandexMaps()

				if (!window.ymaps || !mapRef.current) return

				/*
				 * Начальная точка — Тамбов.
				 * После геокодирования карта переместится
				 * точно на адрес организации.
				 */
				mapInstance = new window.ymaps.Map(mapRef.current, {
					center: [52.7213, 41.4522],
					zoom: 12,
					controls: ['zoomControl'],
				})

				const result = await window.ymaps.geocode(address)

				const firstGeoObject = result.geoObjects.get(0)

				if (!firstGeoObject) return

				const coordinates = firstGeoObject.geometry.getCoordinates()

				const placemark = new window.ymaps.Placemark(
					coordinates,
					{
						hintContent: 'ООО «Название организации»',
						balloonContent: `
							<strong>ООО «Название организации»</strong><br />
							${address}
						`,
					},
					{
						preset: 'islands#blueIcon',
					},
				)

				mapInstance.geoObjects.add(placemark)

				mapInstance.setCenter(coordinates, 15)
			} catch (error) {
				console.error('Ошибка загрузки карты:', error)
			}
		}

		void initMap()

		return () => {
			mapInstance?.destroy()
		}
	}, [])

	return (
		<Section id='contacts' className={styles.contactsSection}>
			<Container>
				<h2 className={styles.title}>Контакты и карта</h2>

				<div className={styles.contacts}>
					<div className={styles.contactItem}>
						<svg width='13' height='13' viewBox='0 0 16 16' fill='none' aria-hidden='true'>
							<path
								d='M12.2 6.7C12.2 9.5 8 13.5 8 13.5C8 13.5 3.8 9.5 3.8 6.7C3.8 4.38 5.68 2.5 8 2.5C10.32 2.5 12.2 4.38 12.2 6.7Z'
								stroke='currentColor'
								strokeWidth='1.3'
							/>

							<circle cx='8' cy='6.7' r='1.4' stroke='currentColor' strokeWidth='1.3' />
						</svg>

						<span>Тамбов, бул. Энтузиастов, 2А</span>
					</div>

					<span className={styles.contactItem}>пн–пт 10:00-18:00, сб 10:00-17:00</span>

					<a href='tel:+747523952578' className={styles.contactItem}>
						тел. 8 (4752) 395-25-78,
					</a>

					<span className={styles.emailWrapper}>
						почта{' '}
						<a href='mailto:info@shop.ru' className={styles.email}>
							info@shop.ru
						</a>
					</span>
				</div>

				<div className={styles.mapWrapper}>
					<div ref={mapRef} className={styles.map} aria-label='Карта расположения организации' />
				</div>
			</Container>
		</Section>
	)
}
