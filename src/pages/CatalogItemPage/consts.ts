import imgMock from 'src/assets/img/itemImgMock.png'

export type ProductCharacteristic = {
	id: string
	title: string
	value: string
}

export type ProductImage = {
	id: string
	original: string
}

export type SimilarProduct = {
	id: string
	title: string
	category_id: string
	item_price: string
	individualPrice?: boolean
	img: ProductImage[]
}

export type CatalogItemMock = {
	id: string
	title: string
	article: string
	category_id: string
	category_title: string
	description: string
	item_price: string
	individualPrice?: boolean
	img: ProductImage[]
	characteristics: ProductCharacteristic[]
	similar: SimilarProduct[]
}

export const mockItem: CatalogItemMock = {
	id: '25',
	title: 'Сервер СКУД Gate / Видеоверификация-5 / Распознавание Автономеров-2 / Стойка 19“',
	article: '00-00254449',
	category_id: '5',
	category_title: 'Видеонаблюдение',

	description:
		'IP видеокамера уличная антивандальная, 2 Мп, разрешение 1920 x 1080, 30 к/с, 1/2,8" SONY STARVIS сенсор, 0,01 Люкс (день) / 0,001 Люкс (ночь) / 0 Люкс (с ИК подсветкой). Объектив f = 2,8 мм, встроенная видеоаналитика, BLC, WDR, DWDR, DNR, ROI, антитуман, H.264/H.265, e-mail, механический ИК фильтр, DC 12 В, PoE, герметичный разъем Ethernet, адаптивная ИК подсветка 30 м, -40...+50°C.',

	item_price: '9870',

	individualPrice: false,

	img: [
		{
			id: '1',
			original: imgMock,
		},
	],

	characteristics: [
		{
			id: '1',
			title: 'Сетевой интерфейс',
			value: 'Ethernet',
		},
		{
			id: '2',
			title: 'Тип камеры',
			value: 'IP',
		},
		{
			id: '3',
			title: 'Фокусное расстояние (мм)',
			value: '2.8',
		},
		{
			id: '4',
			title: 'Вариант исполнения',
			value: 'улица',
		},
		{
			id: '5',
			title: 'ИК подсветка',
			value: 'да',
		},
		{
			id: '6',
			title: 'Страна производства',
			value: 'РФ',
		},
		{
			id: '7',
			title: 'Гарантия',
			value: '1 год',
		},
	],

	similar: [
		{
			id: '101',
			title: 'TSi-E4FP',
			category_id: '5',
			item_price: '7820',
			img: [
				{
					id: '1',
					original: imgMock,
				},
			],
		},
		{
			id: '102',
			title: 'TSi-Beco25FP',
			category_id: '5',
			item_price: '6710',
			img: [
				{
					id: '1',
					original: imgMock,
				},
			],
		},
		{
			id: '103',
			title: 'TSi-Ee50FP',
			category_id: '5',
			item_price: '11669',
			img: [
				{
					id: '1',
					original: imgMock,
				},
			],
		},
		{
			id: '104',
			title: 'TSi-E4FP',
			category_id: '5',
			item_price: '7820',
			img: [
				{
					id: '1',
					original: imgMock,
				},
			],
		},
		{
			id: '105',
			title: 'TSi-E4FP',
			category_id: '5',
			item_price: '7820',
			img: [
				{
					id: '1',
					original: imgMock,
				},
			],
		},
		{
			id: '106',
			title: 'TSi-E4FP',
			category_id: '5',
			item_price: '7820',
			img: [
				{
					id: '1',
					original: imgMock,
				},
			],
		},
	],
}

export const formatProductPrice = (price: string | number) => {
	return new Intl.NumberFormat('ru-RU').format(Number(price))
}
