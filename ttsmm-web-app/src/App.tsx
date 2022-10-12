import _React, { Component } from 'react';
import { Layout } from 'antd';
import { useCookies } from 'react-cookie';
import { Outlet } from 'react-router-dom';

import { COOKIE_NAME } from './Constants';
import { TTSMMCollection } from './model/ModCollection';
import { TTSMMCollectionProps } from './views/TTSMMCollectionView';

const { Content } = Layout;

interface CookieSetOptions {
	path?: string; // cookie path, use / as the path if you want your cookie to be accessible on all pages
	expires?: Date; // absolute expiration date for the cookie
	maxAge?: number; // relative max age of the cookie from when the client receives it in seconds
	domain?: string; // domain for the cookie (sub.domain.com or .allsubdomains.com)
	secure?: boolean; // Is only accessible through HTTPS?
	httpOnly?: boolean; // Can only the server access the cookie? Note: You cannot get or set httpOnly cookies from the browser, only the server.
	sameSite?: boolean | 'lax' | 'strict'; // Strict or Lax enforcement
}

interface AppState {
	collection?: TTSMMCollection;
	steamCollection?: string;
}

interface AppProps {
	disableNavigation?: boolean;
	appState: AppState;
	cookiesWrapper: [
		{
			[COOKIE_NAME]?: AppState;
		},
		(name: 'ttsmm-web-state', value: any, options?: CookieSetOptions | undefined) => void,
		(name: 'ttsmm-web-state', options?: CookieSetOptions | undefined) => void
	];
}

class App extends Component<AppProps, AppState> {
	CONFIG_PATH: string | undefined = undefined;

	setCookie: (name: 'ttsmm-web-state', value: any, options?: CookieSetOptions | undefined) => void;
	removeCookie: (name: 'ttsmm-web-state', options?: CookieSetOptions | undefined) => void;

	constructor(props: AppProps) {
		super(props);
		const [cookies, setCookie, removeCookie] = props.cookiesWrapper;
		this.setCookie = setCookie;
		this.removeCookie = removeCookie;

		const savedState = cookies[COOKIE_NAME];
		if (savedState) {
			this.state = savedState;
		}

		this.updateCookie = this.updateCookie.bind(this);
		this.updateState = this.updateState.bind(this);
	}

	// refresh cookie expiration on loading page
	componentDidMount() {
		this.updateCookie();
	}

	updateCookie() {
		const today = new Date();
		const currYear = today.getUTCFullYear();
		const currMonth = today.getUTCMonth();
		const currDay = today.getUTCDate();

		// cookie will never expire on its own
		const expiration = new Date(currYear + 1000, currMonth, currDay);
		this.setCookie(COOKIE_NAME, this.state, {
			domain: 'flsoz.github.io',
			path: 'ttsmm-web',
			secure: false,
			httpOnly: false,
			expires: expiration
		});
	}

	updateState(update: any) {
		this.setState(update, this.updateCookie);
	}

	render() {
		const { collection } = this.state;
		const adjustedCollection = collection || { name: 'empty', mods: [] };
		const ttsmmProps: TTSMMCollectionProps = {
			collection: adjustedCollection,
			updateState: this.updateState
		};
		return (
			<Layout style={{ minHeight: '100vh', minWidth: '100vw' }}>
				<Content style={{ backgroundColor: '#222' }}>
					<div className="App">{JSON.stringify(this.state, null, 2)}</div>
					<Outlet context={{ ...ttsmmProps }} />
				</Content>
			</Layout>
		);
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (props: any) => {
	return <App {...props} cookiesWrapper={useCookies([])} />;
};
