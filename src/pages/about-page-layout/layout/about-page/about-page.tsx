import { FlexRow } from 'src/shared/ui/FlexRow/FlexRow'
import styles from './index.module.scss'
import { useGetFooterPageInfoQuery } from 'src/features/home/api/home.api'

export const AboutPage = () => {
	const { data } = useGetFooterPageInfoQuery('about')
	return (
		<div className={styles.elementPage}>
			<h2 className={styles.title}>{data?.page_name}</h2>
			<FlexRow className={styles.content}>
				<p className={styles.desc}>
					{data?.page_text && (
						<div className={styles.desc} dangerouslySetInnerHTML={{ __html: data.page_text }} />
					)}
				</p>
				{/* <p className={styles.desc}>
					Фабрика шоколада «ИМПЕРАТОР» придает особое значение качеству своей продукции. Мы
					сознательно отказываемся от консервантов, красителей и ненатуральных добавок,
					экспериментируем с составом и ингредиентами, создавая новую палитру вкусовых ощущений.
					Свои коллекции конфет мы создаем из шоколада старейшей бельгийской компании. Более ста
					семидесяти лет её продукция является образцом вкуса, аромата и качества.
				</p>
				<p className={styles.desc}>
					Фабрика шоколада «ИМПЕРАТОР» создает элитный шоколад, ручной работы без консервантов и
					пальмовых масел. В настоящее время на рынке шоколадной продукции сложилась непростая
					ситуация. Магазины переполнены яркими обертками шоколадных плиток, батончиков и конфет, но
					под красивой упаковкой совсем не осталось шоколада, промышленное производство и погоня за
					дешевизной привело к тому, что мы забыли вкус настоящего шоколада.
				</p> */}
			</FlexRow>
		</div>
	)
}
