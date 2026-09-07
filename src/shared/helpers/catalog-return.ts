// src/shared/lib/catalog-return.ts

const LAST_CATALOG_URL_KEY = 'lastCatalogUrl'
const CATALOG_PAGE_KEY_PREFIX = 'catalogPage'

const getStorage = () => {
	if (typeof window === 'undefined') return null

	return window.sessionStorage
}

const normalizePage = (value: unknown): number => {
	const page = Number(value)

	return Number.isInteger(page) && page > 0 ? page : 1
}

export const buildCatalogUrl = (menuId: string, page = 1): string => {
	const normalizedPage = normalizePage(page)

	return normalizedPage > 1 ? `/catalog/${menuId}?page=${normalizedPage}` : `/catalog/${menuId}`
}

export const saveCatalogPosition = (menuId: string, pathWithSearch: string, page: number) => {
	const storage = getStorage()

	if (!storage || !menuId) return

	storage.setItem(LAST_CATALOG_URL_KEY, pathWithSearch)
	storage.setItem(`${CATALOG_PAGE_KEY_PREFIX}:${menuId}`, String(normalizePage(page)))
}

export const getCatalogUrlWithSavedPage = (menuId: string): string => {
	const storage = getStorage()

	const savedPage = storage?.getItem(`${CATALOG_PAGE_KEY_PREFIX}:${menuId}`)

	return buildCatalogUrl(menuId, normalizePage(savedPage))
}

export const getCatalogReturnUrl = (menuId: string): string => {
	const storage = getStorage()
	const fallback = getCatalogUrlWithSavedPage(menuId)

	const lastCatalogUrl = storage?.getItem(LAST_CATALOG_URL_KEY)

	if (lastCatalogUrl?.startsWith(`/catalog/${menuId}`)) {
		return lastCatalogUrl
	}

	return fallback
}

export const getLastCatalogUrl = (fallback = '/catalog'): string => {
	const storage = getStorage()

	return storage?.getItem(LAST_CATALOG_URL_KEY) ?? fallback
}
