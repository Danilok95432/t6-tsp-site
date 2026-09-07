import { type FC, type ReactNode } from 'react'

import styled from 'styled-components'

type InfoRowStyleProps = {
	$margin?: string
	$alignItems?: string
	$gap?: string
	$titleWidth?: string
	$titleSize?: string
	$titleWeight?: string
	$labelMaxWidth?: string
}

type InfoRowProps = {
	wrapperClassname?: string
	titleClassname?: string
	title: string
	label: ReactNode
	icon?: ReactNode
} & InfoRowStyleProps

const StyledInfoRow = styled.div<InfoRowStyleProps>`
	margin: ${({ $margin }) => $margin ?? '0 0 18px 0'};
	display: flex;
	align-items: ${({ $alignItems }) => $alignItems ?? 'flex-start'};
	flex-wrap: wrap;
	gap: ${({ $gap }) => $gap ?? '25px'};
	@media (max-width: 768px) {
		flex-wrap: wrap;
		align-items: flex-start;
		gap: 5px;
	}

	h6 {
		font-size: ${({ $titleSize }) => $titleSize ?? '20px'};
		font-weight: ${({ $titleWeight }) => $titleWeight ?? '400'};
		width: ${({ $titleWidth }) => $titleWidth ?? '225px'};
		min-width: ${({ $titleWidth }) => $titleWidth ?? '225px'};
	}

	a {
		color: #de0008;
		font-size: 20px;
	}

	& > p {
		font-size: 20px;
		max-width: ${({ $labelMaxWidth }) => $labelMaxWidth ?? 'initial'};
	}
`
export const InfoRow: FC<InfoRowProps> = ({
	title,
	label,
	wrapperClassname,
	titleClassname,
	icon,
	...props
}) => {
	return (
		<StyledInfoRow className={wrapperClassname} {...props}>
			{icon}
			<h6 className={titleClassname}>{title}</h6>
			<p>{label}</p>
		</StyledInfoRow>
	)
}
