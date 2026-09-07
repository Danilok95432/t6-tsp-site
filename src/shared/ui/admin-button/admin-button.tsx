import React, { type FC, type ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

import styled, { css } from 'styled-components'
import { CancelVariantBtnSvg } from '../icons/cancelVariantBtnSVG'
import { DelayVariantBtnSVG } from '../icons/delayVariantBtnSVG'
import { ListRequestStatusPendingSVG } from '../icons/listRequestStatusBtnSVG'
import { SentVariantBtnSvg } from '../icons/sentVariantBtnSVG'

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

type ButtonComponentProps = {
	as?: 'button' | 'link' | 'route'
	children?: ReactNode
	$margin?: string
	$padding?: string
	$fontSize?: string
	$height?: string
	$radius?: string
	$variant?: 'primary' | 'light' | 'cancel' | 'sent' | 'delay' | 'disabled' | 'pending'
}

type SharedStylesTypes = Omit<ButtonComponentProps, 'as' | 'children'>

const sharedStyles = css<SharedStylesTypes>`
	padding: ${({ $padding }) => $padding ?? '0 24px'};
	margin: ${({ $margin }) => $margin ?? '0'};
	height: ${({ $height }) => $height ?? '45px'};
	font-size: ${({ $fontSize }) => $fontSize ?? '14px'};
	border-radius: ${({ $radius }) => $radius ?? '3px'};
	pointer-events: ${({ $variant }) =>
		$variant === 'sent' || $variant === 'disabled' ? 'none' : 'initial'};

	background: ${({ $variant }) => {
		if ($variant === 'primary') return '#184F71'
		if ($variant === 'sent' || $variant === 'disabled') return '#018EA3'
		return '#ffffff'
	}};
	color: ${({ $variant }) => {
		if ($variant === 'cancel') return '#D9001B'
		if ($variant === 'pending') return '#E67B00'
		if ($variant === 'light' || $variant === 'delay') return '#002C47'
		return '#ffffff'
	}};
	box-shadow: ${({ $variant }) => {
		if ($variant === 'primary') return 'none'
		return '0 0 5px 0 rgba(1, 61, 86, 0.2)'
	}};
	border: none;
	text-decoration: none;
	font-weight: 600;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	gap: 5px;
	justify-content: center;

	transition: all 0.3s;

	&:hover {
		background-color: ${({ $variant }) => {
			if ($variant === 'cancel') return '#ffffff'
			if ($variant === 'light') return '#ffffff'
			if ($variant === 'pending') return '#ffffff'
			if ($variant === 'delay') return '#ffffff'
			return '#018EA3'
		}};
		color: ${({ $variant }) => {
			if ($variant === 'cancel') return '#D9001B'
			if ($variant === 'light') return '#018EA3'
			if ($variant === 'pending') return '#E67B00'
			if ($variant === 'delay') return '#002C47'
			return '#ffffff'
		}};
	}
`

const StyledButton = styled.button<SharedStylesTypes>`
	${sharedStyles}
`
const StyledLink = styled.a<SharedStylesTypes>`
	${sharedStyles}
`
const StyledRouteLink = styled(Link)<SharedStylesTypes>`
	${sharedStyles}
`

export const AdminButton: FC<ButtonComponentProps & (ButtonProps | AnchorProps | LinkProps)> = ({
	children,
	as = 'button',
	$variant = 'primary',
	...props
}) => {
	if (as === 'button') {
		return (
			<StyledButton $variant={$variant} {...(props as ButtonProps)}>
				{$variant === 'cancel' && <CancelVariantBtnSvg />}
				{$variant === 'sent' && <SentVariantBtnSvg />}
				{$variant === 'delay' && <DelayVariantBtnSVG />}
				{$variant === 'pending' && <ListRequestStatusPendingSVG />}
				{children}
			</StyledButton>
		)
	}
	if (as === 'link') {
		return (
			<StyledLink $variant={$variant} {...(props as AnchorProps)}>
				{$variant === 'cancel' && <CancelVariantBtnSvg />}
				{$variant === 'sent' && <SentVariantBtnSvg />}
				{$variant === 'delay' && <DelayVariantBtnSVG />}
				{$variant === 'pending' && <ListRequestStatusPendingSVG />}
				{children}
			</StyledLink>
		)
	}
	if (as === 'route') {
		return (
			<StyledRouteLink $variant={$variant} {...(props as LinkProps)}>
				{$variant === 'cancel' && <CancelVariantBtnSvg />}
				{$variant === 'sent' && <SentVariantBtnSvg />}
				{$variant === 'delay' && <DelayVariantBtnSVG />}
				{$variant === 'pending' && <ListRequestStatusPendingSVG />}
				{children}
			</StyledRouteLink>
		)
	}
	return null
}
