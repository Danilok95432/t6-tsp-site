import { type RefObject, useEffect, useRef, useState } from 'react'
import { Swiper, type SwiperRef, SwiperSlide } from 'swiper/react'
import cn from 'classnames'

import { FlexRow } from 'src/shared/ui/FlexRow/FlexRow'
import { SliderBtns } from 'src/widgets/Slider-btns/slider-btns'

import styles from './index.module.scss'

import 'swiper/css'
import { DeleteItemFromCartSVG } from 'src/shared/ui/icons/deleteItemFromCartSVG'

type GalleryImage = {
	original?: string
}

type FullscreenGalleryProps = {
	images: GalleryImage[]
	initialSlide?: number
	title?: string
	onClose: () => void
}

export const FullscreenGallery = ({
	images,
	initialSlide = 0,
	title = 'Изображение товара',
	onClose,
}: FullscreenGalleryProps) => {
	const swiperRef: RefObject<SwiperRef> = useRef<SwiperRef>(null)
	const [activeIndex, setActiveIndex] = useState(initialSlide)

	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose()
			}
		}

		document.addEventListener('keydown', handleEsc)
		document.body.style.overflow = 'hidden'

		return () => {
			document.removeEventListener('keydown', handleEsc)
			document.body.style.overflow = ''
		}
	}, [onClose])

	const handleThumbClick = (index: number) => {
		setActiveIndex(index)
		swiperRef.current?.swiper.slideTo(index)
	}

	if (images.length === 0) return null

	return (
		<div className={styles.overlay} role='dialog' aria-modal='true'>
			<button type='button' className={styles.closeBtn} onClick={onClose} aria-label='Закрыть'>
				<DeleteItemFromCartSVG isMobile />
			</button>

			<div className={styles.content}>
				<div className={styles.sliderWrapper}>
					<Swiper
						ref={swiperRef}
						className={styles.swiper}
						initialSlide={initialSlide}
						onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
					>
						{images.map((image, index) => (
							<SwiperSlide key={`${image.original}-${index}`} className={styles.slide}>
								<div className={styles.imageWrapper}>
									<img
										className={styles.image}
										src={image.original}
										alt={`${title} ${index + 1}`}
									/>
								</div>
							</SwiperSlide>
						))}
					</Swiper>

					{images.length > 1 && <SliderBtns className={styles.sliderBtns} swiperRef={swiperRef} />}
				</div>

				{images.length > 1 && (
					<FlexRow className={styles.thumbs}>
						{images.map((image, index) => (
							<button
								key={`${image.original}-thumb-${index}`}
								type='button'
								className={cn(styles.thumb, {
									[styles.activeThumb]: activeIndex === index,
								})}
								onClick={() => handleThumbClick(index)}
								aria-label={`Открыть изображение ${index + 1}`}
							>
								<img src={image.original} alt={`${title} миниатюра ${index + 1}`} />
							</button>
						))}
					</FlexRow>
				)}
			</div>
		</div>
	)
}
