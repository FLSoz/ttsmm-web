import { Component } from 'react';
import { Menu } from 'antd';
import { CloudFilled, HddFilled, HomeFilled, QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Page } from '../model/Menu';

interface MenuProps {
	disableNavigation?: boolean;
	currentPath: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	updateState: (update: any) => void;
}

export default class MenuBar extends Component<MenuProps, never> {
	CONFIG_PATH: string | undefined = undefined;

	render() {
		const { disableNavigation, updateState, currentPath } = this.props;
		const MenuIconStyle = { fontSize: 28, lineHeight: 0, marginLeft: -4 };
		const MenuItemStyle = { display: 'flex', alignItems: 'center' };

		return (
			<Menu
				id="MenuBar"
				theme="dark"
				className="MenuBar"
				selectedKeys={[currentPath]}
				mode="inline"
				disabled={disableNavigation}
				onClick={(e) => {
					if (e.key !== currentPath) {
						updateState({ page: e.key });
					}
				}}
			>
				<Menu.Item key={Page.MAIN} style={MenuItemStyle} icon={<HomeFilled style={MenuIconStyle} />}>
					Home
				</Menu.Item>
				<Menu.Item key={Page.TTSMM} style={MenuItemStyle} icon={<HddFilled style={MenuIconStyle} />}>
					TTSMM Collection
				</Menu.Item>
				<Menu.Item key={Page.STEAM} style={MenuItemStyle} icon={<CloudFilled style={MenuIconStyle} />}>
					Steam Collection
				</Menu.Item>
				<Menu.Item key={Page.FAQ} style={MenuItemStyle} icon={<QuestionCircleOutlined style={MenuIconStyle} />}>
					FAQ
				</Menu.Item>
				<Menu.Item key={Page.SETTINGS} style={MenuItemStyle} icon={<SettingOutlined style={MenuIconStyle} />}>
					Settings
				</Menu.Item>
			</Menu>
		);
	}
}
