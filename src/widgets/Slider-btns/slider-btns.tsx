import React, { type FC, type RefObject } from 'react'
import { type SwiperRef } from 'swiper/react'
import styles from './index.module.scss'

import cn from 'classnames'
import { SlidePrevSVG } from 'src/shared/ui/icons/slidePrevSVG'
import { SlideNextSVG } from 'src/shared/ui/icons/slideNextSVG'
import { SmallSlidePrevSVG } from 'src/shared/ui/icons/smallSlidePrevSVG'
import { SmallSlideNextSVG } from 'src/shared/ui/icons/smallSlideNextSVG'

type SliderProps = {
	swiperRef: RefObject<SwiperRef>
	className?: string
	prevBtnColor?: string
	nextBtnColor?: string
	color?: string
	smallControls?: boolean
}

export const SliderBtns: FC<SliderProps> = ({ swiperRef, className, smallControls }) => {
	const handlePrev = () => {
		swiperRef.current?.swiper.slidePrev()
	}

	const handleNext = () => {
		swiperRef.current?.swiper.slideNext()
	}
	return (
		<div className={cn(className, styles.sliderBtnsWrapper)}>
			<button type='button' onClick={handlePrev}>
				{smallControls ? <SmallSlidePrevSVG /> : <SlidePrevSVG />}
			</button>
			<button type='button' onClick={handleNext}>
				{smallControls ? <SmallSlideNextSVG /> : <SlideNextSVG />}
			</button>
		</div>
	)
}
