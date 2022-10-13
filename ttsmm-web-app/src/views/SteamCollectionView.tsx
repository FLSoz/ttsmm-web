/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from 'react';

import { ModData } from '../model/Mod';
import { DisplayModData } from '../model/CollectionValidation';
import { CollectionViewProps, ModCollection } from '../model/ModCollection';
import CollectionTable from '../components/CollectionTableComponent';
import { GetCollection, ProcessBatchModDetails } from '../Api';

interface SteamCollectionState {
	rows: DisplayModData[];
	filteredRows: DisplayModData[];
	collection?: ModCollection;
	fetchingDetails: boolean;
	error?: string;
	modErrors: Map<string, string>;
}

export interface SteamCollectionProps {
	collectionID: string;
	updateState: (update: any) => void;
}

export default class SteamCollectionView extends Component<SteamCollectionProps, SteamCollectionState> {
	constructor(props: SteamCollectionProps) {
		super(props);

		this.state = {
			rows: [],
			filteredRows: [],
			fetchingDetails: true,
			modErrors: new Map()
		};
	}

	// fetch collection/mod details on load
	componentDidMount(): void {
		const { collectionID, updateState } = this.props;
		if (collectionID) {
			try {
				updateState({ steamCollection: collectionID });
				GetCollection(BigInt(collectionID))
					.then((collection: ModCollection) => {
						this.setState({ collection });

						const modIDs = collection.mods;
						const { modErrors } = this.state;
						// eslint-disable-next-line promise/no-nesting
						ProcessBatchModDetails(modIDs, modErrors)
							.then((rows) => {
								this.setState({
									rows,
									filteredRows: rows,
									fetchingDetails: false
								});
								return true;
							})
							.catch((e: Error) => {
								console.error(e);
								this.setState({ error: e.toString(), fetchingDetails: false });
							});
						return;
					})
					.catch((e: Error) => {
						console.error(e);
						this.setState({ error: e.toString(), fetchingDetails: false });
					});
			} catch (e) {
				console.error(e);
				this.setState({ error: (e as Error).toString(), fetchingDetails: false });
			}
		} else {
			this.setState({ fetchingDetails: false });
		}
	}

	render() {
		const { rows, filteredRows } = this.state;
		const tableProps: CollectionViewProps = {
			rows,
			filteredRows,
			getModDetails: (mod: string, modData: ModData, bigDetails?: boolean) => {
				console.log(mod, modData, bigDetails);
				return;
			}
		};
		return <CollectionTable {...tableProps} />;
	}
}
