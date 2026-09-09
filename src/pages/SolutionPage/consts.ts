export type SolutionTag = {
	id: string
	title: string
}

export type SolutionGalleryItem = {
	id: string
	image: string
	alt: string
}

export type SolutionKitItem = {
	id: string
	title: string
	count: number
	price: number
	total: number
}

export type SolutionMaterial = {
	id: string
	title: string
	type: string
	size: string
	file: string
}

export const solutionMock = {
	title: 'Контроль строительной площадки',
	type: 'Решение',

	image: '/images/solutions/construction-camera.png',

	price: 4_209_869,

	categoryTitle: 'Все решения для крупного бизнеса',
	categoryLink: '/solutions',

	tags: [
		{
			id: '1',
			title: 'Решение для крупного бизнеса',
		},
		{
			id: '2',
			title: 'Средний уровень стоимости',
		},
		{
			id: '3',
			title: 'Контроль производства',
		},
	] satisfies SolutionTag[],

	description:
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non scelerisque justo. Aliquam rutrum, urna sed lacinia convallis, est ante volutpat dui, vitae congue lacus dui sit amet erat.',

	fullDescription:
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non scelerisque justo. Aliquam rutrum, urna sed lacinia convallis, est ante volutpat dui, vitae congue lacus dui sit amet erat. Maecenas augue justo, interdum non nisl eu, viverra eleifend est. Nunc et vehicula odio. Mauris tempor odio mauris. Phasellus finibus dui in auctor pretium.',

	gallery: [
		{
			id: '1',
			image: '/images/solutions/gallery-1.jpg',
			alt: 'Проектирование системы',
		},
		{
			id: '2',
			image: '/images/solutions/gallery-2.jpg',
			alt: 'Монтаж оборудования',
		},
		{
			id: '3',
			image: '/images/solutions/gallery-3.jpg',
			alt: 'Настройка системы',
		},
		{
			id: '4',
			image: '/images/solutions/gallery-4.jpg',
			alt: 'Работа оборудования',
		},
	] satisfies SolutionGalleryItem[],

	kit: [
		{
			id: '1',
			title:
				'Контроллер GATE-8000-Ethernet. Подключение — Ethernet; поддержка 2 считывателей Wiegand',
			count: 1,
			price: 14_151,
			total: 14_151,
		},
		{
			id: '2',
			title: 'Комплект Gate Server-Terminal с ключом',
			count: 1,
			price: 14_047,
			total: 14_047,
		},
		{
			id: '3',
			title: 'DHI-ITC413-PW4D-IZ1-Gate Интеллектуальная ANPR камера',
			count: 2,
			price: 58_200,
			total: 116_400,
		},
		{
			id: '4',
			title: 'TSr-NV16254 Сетевой 16 канальный регистратор',
			count: 1,
			price: 17_951,
			total: 17_951,
		},
		{
			id: '5',
			title: 'TSI-Po50FP 5 мегапиксельная уличная камера',
			count: 4,
			price: 10_169,
			total: 40_676,
		},
		{
			id: '6',
			title: 'TSn-8FP10G2 коммутатор, 8/100Мбит/с PoE портов',
			count: 1,
			price: 6_642,
			total: 6_642,
		},
	] satisfies SolutionKitItem[],

	materials: [
		{
			id: '1',
			title: 'Название документа для скачивания',
			type: 'PDF',
			size: '00 КБ',
			file: '/documents/material-1.pdf',
		},
		{
			id: '2',
			title: 'Название документа для скачивания на одну-две строки',
			type: 'PDF',
			size: '00 КБ',
			file: '/documents/material-2.pdf',
		},
		{
			id: '3',
			title: 'Название документа для скачивания',
			type: 'PDF',
			size: '00 КБ',
			file: '/documents/material-3.pdf',
		},
	] satisfies SolutionMaterial[],
}
