import { FlexRow } from 'src/shared/ui/FlexRow/FlexRow'
import styles from './index.module.scss'
import { useGetFooterPageInfoQuery } from 'src/features/home/api/home.api'

export const ContactsPage = () => {
	const { data } = useGetFooterPageInfoQuery('contacts')
	// const yandexMapsUrlFirst = `https://yandex.ru/maps/?mode=search&text=${encodeURIComponent('ул. Сестрорецкая, дом 6')}`
	// const yandexMapsUrlSecond = `https://yandex.ru/maps/?mode=search&text=${encodeURIComponent('Ленинградская область, поселок Сосново, ул. Октябрьская, д. 6. ТЦ Сосновский (1 этаж)')}`
	// const yandexMapsUrlThird = `https://yandex.ru/maps/?mode=search&text=${encodeURIComponent('г. Мытищи, Осташковское шоссе, 1к13 «Мытищинская Ярмарка» Ангар 32')}`
	return (
		<div className={styles.elementPage}>
			<h2 className={styles.title}>{data?.page_name}</h2>
			<FlexRow className={styles.content}>
				<p className={styles.desc}>
					{data?.page_text && (
						<div className={styles.desc} dangerouslySetInnerHTML={{ __html: data.page_text }} />
					)}
				</p>
			</FlexRow>
			{/* <FlexRow className={styles.rowSection}>
				<FlexRow className={classNames(styles.content, styles.lessGap)}>
					<p className={styles.subtitle}>Производство и пункт выдачи в Санкт-Петербурге</p>
					<FlexRow className={styles.customDesc}>
						<p className={styles.bold}>Телефон для частных лиц:</p>
						<p>+7 (999) 220-23-43</p>
					</FlexRow>
					<FlexRow className={styles.customDesc}>
						<p className={styles.bold}>Телефон для оптовых продаж:</p>
						<p>+7 (921) 937-10-17, +7 (921) 182-94-04</p>
					</FlexRow>
					<FlexRow className={styles.customDesc}>
						<p className={styles.bold}>Адрес:</p>
						<p>
							ул. Сестрорецкая, дом 6, ст. м. Черная речка (посмотреть{' '}
							<a href={yandexMapsUrlFirst}>на карте</a>)
						</p>
					</FlexRow>
					<FlexRow className={styles.customDesc}>
						<p className={styles.bold}>Время работы пункта выдачи:</p>
						<p>Пн-Пт: 09:00 - 16:30 (по МСК), обеденный перерыв: 15:00-15:30.</p>
						<p>Сб-Вс: выходной.</p>
					</FlexRow>
					<FlexRow className={styles.customDesc}>
						<p className={styles.bold}>Электронная почта:</p>
						<p>imperator-shokolad@yandex.ru</p>
					</FlexRow>
					<div className={styles.disclaimer}>
						<p>
							ВНИМАНИЕ!
							<br /> До 26-го декабря кафе и пункт выдачи на Сестрорецкой, 6 по вторникам и пятницам
							работает до 20-00. В остальные дни по обычному графику.
						</p>
						<p>В честь наступающего нового года весь ассортимент в кафе со скидкой 10%</p>
					</div>
				</FlexRow>
				<FlexRow className={classNames(styles.content, styles.lessGap)}>
					<p className={styles.subtitle}>Кафе и фирменный магазин в п. Сосново, Ленобласть</p>
					<FlexRow className={styles.customDesc}>
						<p className={styles.bold}>Адрес:</p>
						<p>
							Ленинградская область, поселок Сосново, ул. Октябрьская, д. 6. ТЦ Сосновский (1 этаж)
							(посмотреть <a href={yandexMapsUrlSecond}>на карте</a>)
						</p>
					</FlexRow>
					<FlexRow className={styles.customDesc}>
						<p className={styles.bold}>Время работы пункта выдачи:</p>
						<p>Пн-Пт: 09:00 - 16:30 (по МСК), обеденный перерыв: 15:00-15:30.</p>
						<p>Сб-Вс: выходной.</p>
					</FlexRow>
				</FlexRow>
				<FlexRow className={classNames(styles.content, styles.lessGap)}>
					<p className={styles.subtitle}>
						Официальный представитель ООО «ИМПЕРАТОР» в Москве и Московской области
					</p>
					<FlexRow className={styles.customDesc}>
						<p className={styles.bold}>Адрес:</p>
						<p>
							г. Мытищи, Осташковское шоссе, 1к13 «Мытищинская Ярмарка» Ангар 32 (посмотреть{' '}
							<a href={yandexMapsUrlThird}>на карте</a>)
						</p>
					</FlexRow>
					<FlexRow className={styles.customDesc}>
						<p className={styles.bold}>Телефон:</p>
						<p>+7 (967) 104-84-44, +7 (967) 107-84-44 (Айк Павел)</p>
					</FlexRow>
					<FlexRow className={styles.customDesc}>
						<p className={styles.bold}>Электронная почта:</p>
						<p>sweet-opt@list.ru</p>
					</FlexRow>
				</FlexRow>
			</FlexRow> */}
		</div>
	)
}
