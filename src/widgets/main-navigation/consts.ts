export type NavigationItem = {
	id: string
	title: string
	link?: string
	sectionId?: string
	children?: NavigationItem[]
}

export const navigationItems: NavigationItem[] = [
	{
		id: '1',
		title: 'Решения',
		sectionId: 'solutions',
		children: [
			{
				id: '1-1',
				title: 'Пункт меню 1',
				sectionId: '/solutions/1',
			},
			{
				id: '1-2',
				title: 'Пункт меню 2',
				sectionId: '/solutions/2',
			},
			{
				id: '1-3',
				title: 'Пункт меню 3',
				link: '/solutions/3',
			},
		],
	},
	{
		id: '2',
		title: 'Каталог',
		sectionId: 'catalog',
		children: [
			{
				id: '2-1',
				title: 'Пункт меню 1',
				link: '/catalog/37',
			},
			{
				id: '2-2',
				title: 'Пункт меню 2',
				link: '/catalog/38',
			},
			{
				id: '2-3',
				title: 'Пункт меню 3',
				link: '/catalog/39',
			},
		],
	},
	{
		id: '3',
		title: 'Проекты',
		sectionId: 'projects',
	},
	{
		id: '4',
		title: 'Команда',
		sectionId: 'team',
	},
	{
		id: '5',
		title: 'Контакты',
		sectionId: 'contacts',
	},
]
