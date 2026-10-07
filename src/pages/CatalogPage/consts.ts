import type { FilterSelectOption } from 'src/shared/ui/FilterSelect/FilterSelect'
import { type CatalogListItem, type SubCatItem } from 'src/types/cardItem'

export type Category = CatalogListItem | SubCatItem

export type CatalogProduct = {
	id: number
	title: string
	image: string
	price?: number
	priceOnRequest?: boolean
	categoryId: number
	typeId: ProductType
	manufacturerId: Manufacturer
}

export type ProductType = 'camera' | 'server' | 'intercom'

export type Manufacturer = 'tantos' | 'hikvision' | 'dahua' | 'gate'

// export const catalogCategories: CatalogCategory[] = [
// 	{
// 		id: 1,
// 		title: 'Домофоны',
// 		children: [
// 			{
// 				id: 2,
// 				title: 'Видеодомофоны',
// 			},
// 			{
// 				id: 3,
// 				title: 'Аудиодомофоны',
// 			},
// 		],
// 	},
// 	{
// 		id: 5,
// 		title: 'Камеры',
// 		children: [
// 			{
// 				id: 6,
// 				title: 'Купольные',
// 			},
// 			{
// 				id: 7,
// 				title: 'Панорамные',
// 			},
// 			{
// 				id: 8,
// 				title: 'Цилиндрические',
// 			},
// 			{
// 				id: 9,
// 				title: 'Миникорпус',
// 			},
// 			{
// 				id: 10,
// 				title: 'Поворотные',
// 			},
// 			{
// 				id: 11,
// 				title: 'Стандартный корпус',
// 			},
// 		],
// 	},
// 	{
// 		id: 12,
// 		title: 'Турникеты',
// 	},
// 	{
// 		id: 13,
// 		title: 'Замки, доводчики',
// 	},
// 	{
// 		id: 14,
// 		title: 'Источники питания',
// 	},
// 	{
// 		id: 15,
// 		title: 'Кабели и монтажные материалы',
// 	},
// 	{
// 		id: 16,
// 		title: 'Расходники',
// 	},
// 	{
// 		id: 17,
// 		title: 'Серверы',
// 	},
// 	{
// 		id: 18,
// 		title: 'Дополнительное оборудование',
// 	},
// ]

export const productTypeOptions = [
	{
		value: 'all',
		title: 'Типы товаров',
	},
	{
		value: 'camera',
		title: 'Камеры',
	},
	{
		value: 'server',
		title: 'Серверы',
	},
	{
		value: 'intercom',
		title: 'Домофоны',
	},
] satisfies Array<FilterSelectOption<'all' | ProductType>>

export const manufacturerOptions = [
	{
		value: 'tantos',
		title: 'Tantos',
	},
	{
		value: 'hikvision',
		title: 'Hikvision',
	},
	{
		value: 'dahua',
		title: 'Dahua',
	},
	{
		value: 'gate',
		title: 'Gate',
	},
] satisfies Array<FilterSelectOption<string>>

export const catalogProducts: CatalogProduct[] = [
	{
		id: 1,
		title: 'TSi-Ve50VPA',
		image: 'src/assets/img/cameraMockImg.png',
		price: 16995,
		categoryId: 8,
		typeId: 'camera',
		manufacturerId: 'tantos',
	},
	{
		id: 2,
		title: 'TSi-Ee50FP',
		image: 'src/assets/img/cameraMockImg.png',
		price: 11669,
		categoryId: 6,
		typeId: 'camera',
		manufacturerId: 'tantos',
	},
	{
		id: 3,
		title: 'TSi-Veco45FP',
		image: 'src/assets/img/cameraMockImg.png',
		price: 10060,
		categoryId: 8,
		typeId: 'camera',
		manufacturerId: 'hikvision',
	},
	{
		id: 4,
		title: 'TSi-E4FP',
		image: 'src/assets/img/cameraMockImg.png',
		price: 7820,
		categoryId: 6,
		typeId: 'camera',
		manufacturerId: 'dahua',
	},
	{
		id: 5,
		title: 'TSi-Eco25F',
		image: 'src/assets/img/cameraMockImg.png',
		price: 5110,
		categoryId: 9,
		typeId: 'camera',
		manufacturerId: 'tantos',
	},
	{
		id: 6,
		title: 'TSi-Ee25FP',
		image: 'src/assets/img/cameraMockImg.png',
		price: 9870,
		categoryId: 10,
		typeId: 'camera',
		manufacturerId: 'gate',
	},
	{
		id: 7,
		title: 'TSi-Panoramic-4K',
		image: 'src/assets/img/cameraMockImg.png',
		price: 24800,
		categoryId: 7,
		typeId: 'camera',
		manufacturerId: 'hikvision',
	},
	{
		id: 8,
		title: 'TSi-Standard-5MP',
		image: 'src/assets/img/cameraMockImg.png',
		price: 13500,
		categoryId: 11,
		typeId: 'camera',
		manufacturerId: 'dahua',
	},

	{
		id: 9,
		title: 'Сервер СКУД Gate / Видеоверификация-5 / Стойка 19"',
		image: 'src/assets/img/serverMockImg.png',
		price: 306912,
		categoryId: 17,
		typeId: 'server',
		manufacturerId: 'gate',
	},
	{
		id: 10,
		title: 'Сервер СКУД Gate / Видеоверификация-5 / Распознавание',
		image: 'src/assets/img/serverMockImg.png',
		price: 448369,
		categoryId: 17,
		typeId: 'server',
		manufacturerId: 'gate',
	},
	{
		id: 11,
		title: 'Сервер СКУД Gate / Видеоверификация-X',
		image: 'src/assets/img/serverMockImg.png',
		priceOnRequest: true,
		categoryId: 17,
		typeId: 'server',
		manufacturerId: 'gate',
	},
	{
		id: 12,
		title: 'Сервер СКУД Gate / Видеоверификация-5 / Desktop',
		image: 'src/assets/img/serverMockImg.png',
		price: 270277,
		categoryId: 17,
		typeId: 'server',
		manufacturerId: 'gate',
	},
	{
		id: 13,
		title: 'РМ оператора СКУД Gate / Desktop',
		image: 'src/assets/img/serverMockImg.png',
		priceOnRequest: true,
		categoryId: 17,
		typeId: 'server',
		manufacturerId: 'gate',
	},

	{
		id: 14,
		title: 'Видеодомофон Tantos Mia',
		image: 'src/assets/img/serverMockImg.png',
		price: 17900,
		categoryId: 2,
		typeId: 'intercom',
		manufacturerId: 'tantos',
	},
	{
		id: 15,
		title: 'Аудиодомофон Tantos TS-AD',
		image: 'src/assets/img/serverMockImg.png',
		price: 5600,
		categoryId: 3,
		typeId: 'intercom',
		manufacturerId: 'tantos',
	},
]

export const hasSubcats = (
	category: Category,
): category is CatalogListItem & { subcats: SubCatItem[] } => {
	return 'subcats' in category && Array.isArray(category.subcats)
}

export const INITIAL_COUNT = 6

export const getCategoryIds = (category: CatalogListItem | SubCatItem): number[] => {
	return [
		Number(category.id),
		...(hasSubcats(category) ? category.subcats?.flatMap(getCategoryIds) : []),
	]
}

export const findCategoryById = (
	categories: CatalogListItem[] | SubCatItem[],
	id: number,
): CatalogListItem | SubCatItem | undefined => {
	for (const category of categories) {
		if (Number(category.id) === id) {
			return category
		}

		if (hasSubcats(category) && category.subcats?.length) {
			const found = findCategoryById(category.subcats, id)

			if (found) {
				return found
			}
		}
	}

	return undefined
}

export const categoryContainsId = (
	category: CatalogListItem | SubCatItem,
	activeId: number,
): boolean => {
	if (Number(category.id) === activeId) {
		return true
	}
	if (!hasSubcats(category)) return false
	return category.subcats?.some((child) => categoryContainsId(child, activeId)) ?? false
}

export const formatPrice = (price: number) => {
	return new Intl.NumberFormat('ru-RU').format(price)
}

export const getProductsWord = (count: number) => {
	const lastTwo = count % 100
	const last = count % 10

	if (lastTwo >= 11 && lastTwo <= 14) {
		return 'товаров'
	}

	if (last === 1) {
		return 'товар'
	}

	if (last >= 2 && last <= 4) {
		return 'товара'
	}

	return 'товаров'
}
