import { Container } from 'src/shared/ui/Container/Container'
import { FlexRow } from 'src/shared/ui/FlexRow/FlexRow'
import { Section } from 'src/shared/ui/Section/section'

import { Swiper, type SwiperRef, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination } from 'swiper/modules'

import styles from './index.module.scss'
import { useGetAwardsListQuery } from 'src/features/home/api/home.api'

import silver from 'src/assets/img/silver.png'
import gold from 'src/assets/img/gold.png'
import { SliderBtns } from 'src/widgets/Slider-btns/slider-btns'
import { type RefObject, useRef } from 'react'
import { sliderOptions } from './consts'

export const AwardsSection = () => {
	const { data } = useGetAwardsListQuery(null)
	const swiperRef: RefObject<SwiperRef> = useRef<SwiperRef>(null)
	return (
		<Section className={styles.awards}>
			<Container>
				<Swiper
					className={styles.awardsRow}
					modules={[Pagination]}
					pagination={{ clickable: true }}
					{...sliderOptions}
					speed={600}
					ref={swiperRef}
				>
					{data?.awards.map((s) => (
						<SwiperSlide key={s.id} className={styles.awardsSlide}>
							<FlexRow className={styles.awardsEl}>
								<img src={s.color === 'Серебро' ? silver : gold} alt={''} />
								<FlexRow
									className={s.title.includes('Серебряная') ? styles.infoRowSilver : styles.infoRow}
								>
									<p className={styles.title}>{s.title}</p>
									{s.itemname && (
										<p className={styles.desc} dangerouslySetInnerHTML={{ __html: s.itemname }} />
									)}

									<p className={styles.location}>{s.itemdesc}</p>
								</FlexRow>
							</FlexRow>
						</SwiperSlide>
					))}
				</Swiper>
				{data?.awards && data?.awards.length > 3 && (
					<SliderBtns className={styles.sliderBtns} swiperRef={swiperRef} smallControls />
				)}
			</Container>
		</Section>
	)
}
