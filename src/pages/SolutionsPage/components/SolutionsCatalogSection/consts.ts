import { type FilterSelectOption } from 'src/shared/ui/FilterSelect/FilterSelect'

export type SolutionCategory = 'business' | 'smallBusiness' | 'private'

export type SolutionLevel = 'start' | 'medium' | 'high'

export type SolutionPriceRange = 'low' | 'middle' | 'high'

export type SolutionTag = {
	id: string
	title: string
	type: 'category' | 'level' | 'direction'
}

export type SolutionItem = {
	id: string
	title: string
	description: string
	price: number
	link: string
	category: SolutionCategory
	level: SolutionLevel
	priceRange: SolutionPriceRange
	tags: SolutionTag[]
}

export const solutionsMock: SolutionItem[] = [
	{
		id: '1',
		title: 'Контроль строительной площадки',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non scelerisque justo. Aliquam rutrum, urna sed lacinia convallis, est ante volutpat dui, vitae congue lacus dui sit amet erat. Maecenas augue justo, interdum non nisl eu, viverra eleifend est.',
		price: 4_209_869,
		link: '/solutions/1',
		category: 'business',
		level: 'medium',
		priceRange: 'high',
		tags: [
			{
				id: '1',
				title: 'Для крупного бизнеса',
				type: 'category',
			},
			{
				id: '2',
				title: 'Средний уровень стоимости',
				type: 'level',
			},
			{
				id: '3',
				title: 'Контроль производства',
				type: 'direction',
			},
		],
	},
	{
		id: '2',
		title: 'Установка пожарной сигнализации',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non scelerisque justo. Aliquam rutrum, urna sed lacinia convallis, est ante volutpat dui, vitae congue lacus dui sit amet erat. Maecenas augue justo, interdum non nisl eu, viverra eleifend est.',
		price: 1_209_869,
		link: '/solutions/2',
		category: 'business',
		level: 'start',
		priceRange: 'middle',
		tags: [
			{
				id: '1',
				title: 'Для крупного бизнеса',
				type: 'category',
			},
			{
				id: '2',
				title: 'Начальный уровень стоимости',
				type: 'level',
			},
			{
				id: '3',
				title: 'Безопасность',
				type: 'direction',
			},
		],
	},
	{
		id: '3',
		title: 'Установка систем видеонаблюдения',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non scelerisque justo. Aliquam rutrum, urna sed lacinia convallis, est ante volutpat dui, vitae congue lacus dui sit amet erat. Maecenas augue justo, interdum non nisl eu, viverra eleifend est.',
		price: 20_209_869,
		link: '/solutions/3',
		category: 'business',
		level: 'medium',
		priceRange: 'high',
		tags: [
			{
				id: '1',
				title: 'Для крупного бизнеса',
				type: 'category',
			},
			{
				id: '2',
				title: 'Средний уровень стоимости',
				type: 'level',
			},
			{
				id: '3',
				title: 'Контроль производства',
				type: 'direction',
			},
		],
	},
	{
		id: '4',
		title: 'Система контроля доступа',
		description: 'Комплексное решение для контроля доступа сотрудников и посетителей объекта.',
		price: 2_450_000,
		link: '/solutions/4',
		category: 'smallBusiness',
		level: 'medium',
		priceRange: 'middle',
		tags: [
			{
				id: '1',
				title: 'Для малого бизнеса',
				type: 'category',
			},
			{
				id: '2',
				title: 'Средний уровень стоимости',
				type: 'level',
			},
			{
				id: '3',
				title: 'Безопасность',
				type: 'direction',
			},
		],
	},
	{
		id: '5',
		title: 'Домашнее видеонаблюдение',
		description: 'Система видеонаблюдения для частного дома или квартиры с удаленным доступом.',
		price: 420_000,
		link: '/solutions/5',
		category: 'private',
		level: 'start',
		priceRange: 'low',
		tags: [
			{
				id: '1',
				title: 'Для частных клиентов',
				type: 'category',
			},
			{
				id: '2',
				title: 'Начальный уровень стоимости',
				type: 'level',
			},
			{
				id: '3',
				title: 'Видеонаблюдение',
				type: 'direction',
			},
		],
	},
	{
		id: '6',
		title: 'Комплексная безопасность предприятия',
		description: 'Проектирование и внедрение комплексной системы безопасности объекта.',
		price: 12_800_000,
		link: '/solutions/6',
		category: 'business',
		level: 'high',
		priceRange: 'high',
		tags: [
			{
				id: '1',
				title: 'Для крупного бизнеса',
				type: 'category',
			},
			{
				id: '2',
				title: 'Высокий уровень стоимости',
				type: 'level',
			},
			{
				id: '3',
				title: 'Комплексная безопасность',
				type: 'direction',
			},
		],
	},
]

export const categoryOptions = [
	{ value: 'all', title: 'Все категории' },
	{ value: 'business', title: 'Для крупного бизнеса' },
	{ value: 'smallBusiness', title: 'Для малого бизнеса' },
	{ value: 'private', title: 'Для частных клиентов' },
] satisfies Array<FilterSelectOption<'all' | SolutionCategory>>

export const levelOptions = [
	{ value: 'all', title: 'Все уровни' },
	{ value: 'start', title: 'Начальный' },
	{ value: 'medium', title: 'Средний' },
	{ value: 'high', title: 'Высокий' },
] satisfies Array<FilterSelectOption<'all' | SolutionLevel>>

export const priceOptions = [
	{ value: 'all', title: 'Цена, ₽' },
	{ value: 'low', title: 'До 1 млн ₽' },
	{ value: 'middle', title: '1–5 млн ₽' },
	{ value: 'high', title: 'От 5 млн ₽' },
]
