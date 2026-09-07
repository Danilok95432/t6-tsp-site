import { Route, Routes } from 'react-router-dom'
import { AppLayout } from 'src/pages/app-layout/app-layout'
import { HomePage } from 'src/pages/home-page/HomePage'
import { NotFoundPage } from 'src/pages/not-found-page/not-found-page'

export const MainRoutes = () => {
	return (
		<Routes>
			{/*
				<Route path={'terminal'} element={<TerminalPage />} />
			<Route path={'terminal/print'} element={<PrintPage />} />
				*/}
			<Route path='/' element={<AppLayout />}>
				<Route path='*' element={<NotFoundPage />} />
				<Route index element={<HomePage />} />
				{/* <Route path={AppRoute.Catalog} element={<ChocolatePage />}>
					<Route path={`${AppRoute.Catalog}/:menuId`} element={<ChocolateList />} />
					<Route path={`${AppRoute.Catalog}/:menuId/item/:itemId`} element={<ChocolateItem />} />
				</Route> */}
			</Route>
		</Routes>
	)
}
