import { Component } from 'react';
import { Layout } from 'antd';
import { useCookies } from 'react-cookie';

import { COOKIE_NAME } from './Constants';
import { TTSMMCollection } from './model/ModCollection';
import { Page } from './model/Menu';
import TTSMMCollectionView, { TTSMMCollectionProps } from './views/TTSMMCollectionView';
import SteamCollectionView, { SteamCollectionProps } from './views/SteamCollectionView';
import SteamCollectionValidationView from './views/SteamCollectionValidationView';
import MenuBar from './components/MenuBar';

const { Content, Sider } = Layout;

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
	ttsmmCollection?: TTSMMCollection;
	steamCollectionID?: string;
	page: Page;
	sidebarCollapsed?: boolean;
}

interface AppProps {
	disableNavigation?: boolean;
	appState: AppState;
	cookiesWrapper: [
		{
			[COOKIE_NAME]?: AppState;
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(name: 'ttsmm-web-state', value: any, options?: CookieSetOptions | undefined) => void,
		(name: 'ttsmm-web-state', options?: CookieSetOptions | undefined) => void
	];
}

class App extends Component<AppProps, AppState> {
	CONFIG_PATH: string | undefined = undefined;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
		} else {
			this.state = {
				page: Page.MAIN
			};
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

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	updateState(update: any) {
		this.setState(update, this.updateCookie);
	}

	renderContents() {
		const { page, ttsmmCollection, steamCollectionID } = this.state;
		const adjustedCollection = ttsmmCollection || { name: 'empty', mods: [] };
		switch (page) {
			case Page.MAIN:
				return <></>;
			case Page.TTSMM:
				const ttsmmProps: TTSMMCollectionProps = {
					ttsmmCollection: adjustedCollection,
					updateState: this.updateState
				};
				return <TTSMMCollectionView {...ttsmmProps} />;
			case Page.STEAM:
				if (steamCollectionID) {
					const steamProps: SteamCollectionProps = {
						collectionID: steamCollectionID,
						updateState: this.updateState
					};
					return <SteamCollectionView {...steamProps} />;
				} else {
					return <SteamCollectionValidationView updateState={this.updateState} />;
				}
		}
		return <></>;
	}

	render() {
		const { page, sidebarCollapsed } = this.state;
		return (
			<Layout style={{ minHeight: '100vh', minWidth: '100vw' }}>
				<Sider
					className="MenuBar"
					collapsible
					collapsed={sidebarCollapsed}
					onCollapse={(collapsed) => {
						this.setState({ sidebarCollapsed: collapsed });
					}}
				>
					<MenuBar disableNavigation={false} currentPath={page} updateState={this.updateState} />
				</Sider>
				<Content style={{ backgroundColor: '#222' }}>{this.renderContents()}</Content>
			</Layout>
		);
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (props: any) => {
	return <App {...props} cookiesWrapper={useCookies([])} />;
};
