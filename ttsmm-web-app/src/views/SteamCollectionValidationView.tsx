/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from 'react';

interface SteamCollectionState {
	collectionID: string;
	fetchingDetails: boolean;
}

export interface SteamCollectionValidationProps {
	updateState: (update: any) => void;
}

export default class SteamCollectionValidationView extends Component<SteamCollectionValidationProps, SteamCollectionState> {
	constructor(props: SteamCollectionValidationProps) {
		super(props);

		this.state = {
			collectionID: '',
			fetchingDetails: true
		};
	}

	render() {
		return <div>{JSON.stringify(this.state, null, 2)}</div>;
	}
}
