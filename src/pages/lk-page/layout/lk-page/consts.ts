import { type NavigationItem } from 'src/types/navigation'

export const lkTabNavigation: NavigationItem[] = [
	{
		title: 'Мои заказы',
		link: `/lk/orders`,
	},
	{
		title: 'Личные данные',
		link: `/lk/info`,
	},
	{
		title: 'Избранные товары',
		link: `/lk/favorite`,
	},
	{
		title: 'Корзина',
		link: `/lk/cart`,
	},
]
