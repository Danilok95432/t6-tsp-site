import { Route, Routes } from 'react-router-dom'
import { AppLayout } from 'src/pages/app-layout/app-layout'
import { HomePage } from 'src/pages/home-page/HomePage'
import { NotFoundPage } from 'src/pages/not-found-page/not-found-page'
import { SolutionPage } from 'src/pages/SolutionPage/SolutionPage'
import { AppRoute } from './consts'
import { AllSolutionsPage } from 'src/pages/SolutionsPage/AllSolutionsPage'

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
				<Route path={AppRoute.Solutions} element={<AllSolutionsPage />} />
				<Route path={`${AppRoute.Solutions}/:solutionId`} element={<SolutionPage />} />
				{/* <Route path={AppRoute.Catalog} element={<ChocolatePage />}>
					<Route path={`${AppRoute.Catalog}/:menuId`} element={<ChocolateList />} />
					<Route path={`${AppRoute.Catalog}/:menuId/item/:itemId`} element={<ChocolateItem />} />
				</Route> */}
			</Route>
		</Routes>
	)
}
