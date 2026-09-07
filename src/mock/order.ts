import { type DeliveryOption, type PaymentOption, type CartItem } from 'src/types/order'

export const deliveryOptions: DeliveryOption[] = [
	{
		id: '1',
		title: 'СДЭК (Доставка курьером)',
		description: 'Стоимость: 900 ₽',
		price: 900,
		days: '4 дня',
		value: '1',
		label: 'СДЭК (Доставка курьером)',
	},
	{
		id: '2',
		title: 'Самовывоз в Санкт-Петербурге',
		description: 'Адрес: Сестрорецкая ул., д. 6, м. Черная речка',
		price: 0,
		days: '1 день',
		value: '2',
		label: 'Самовывоз в Санкт-Петербурге',
	},
]

export const paymentOptions: PaymentOption[] = [
	{
		id: 'cash',
		value: 'cash',
		label: 'При получении',
	},
	{
		id: 'card',
		value: 'card',
		label: 'Онлайн картой',
	},
]

export const cartItemsMock: CartItem[] = [
	{
		id: '1',
		title: 'Шоколад молочный с фундуком',
		price: 310,
		quantity: 2,
	},
	{
		id: '2',
		title: 'Шоколад темный',
		price: 270,
		quantity: 1,
	},
	{
		id: '3',
		title: 'Шоколад белый с клюквой и дробленым миндалем',
		price: 310,
		quantity: 2,
	},
]
