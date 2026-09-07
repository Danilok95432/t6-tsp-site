import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { App } from './app/root/App'

import { HelmetProvider } from 'react-helmet-async'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.min.css'
import 'swiper/swiper-bundle.css'
import 'react-datepicker/dist/react-datepicker.css'

import './index.scss'
import { store } from './app/store'
import { Modal } from './features/modal/modal'
// import { AuthInitializer } from './widgets/Auth-Initializer/auth-Initializer'
import { ScrollToTop } from './widgets/scroll-to-top/scroll-to-top'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<Provider store={store}>
		<HelmetProvider>
			<BrowserRouter>
				<ScrollToTop />
				{/* <AuthInitializer /> */}
				<ToastContainer />
				<App />
				<Modal />
			</BrowserRouter>
		</HelmetProvider>
	</Provider>,
)
