import React from 'react';
import { CookiesProvider } from 'react-cookie';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.global.less';
import App from './App';
import reportWebVitals from './reportWebVitals';
import TTSMMCollectionView from './views/TTSMMCollectionView';
import SteamCollectionView from './views/SteamCollectionView';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<CookiesProvider>
		<React.StrictMode>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<App />}>
						{/* ttsmm-output */}
						<Route path="ttsmm" element={<TTSMMCollectionView />} />
						{/* Steam collection view */}
						<Route path="steam/:id" element={<SteamCollectionView />} />\
					</Route>
				</Routes>
			</BrowserRouter>
		</React.StrictMode>
	</CookiesProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
