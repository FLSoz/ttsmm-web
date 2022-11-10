/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from 'react';
import { Button, Input, Layout } from 'antd';

import { ModData } from '../model/Mod';
import { DisplayModData } from '../model/CollectionValidation';
import { CollectionViewProps, ModCollection } from '../model/ModCollection';
import CollectionTable from '../components/CollectionTableComponent';
import { GetCollection, ProcessBatchModDetails, LaunchWithMods } from '../Api';

const { Footer, Content } = Layout;

interface SteamCollectionState {
	rows: DisplayModData[];
	filteredRows: DisplayModData[];
	collection?: ModCollection;
	fetchingDetails: boolean;
	error?: string;
	modErrors: Map<string, string>;
}

export interface SteamCollectionProps {
	collectionID?: string;
	updateState: (update: any) => void;
	reportException: (e: Error) => void;
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

	fetchCollectionDetails(collectionID: string) {
		const { updateState, reportException } = this.props;
		try {
			updateState({ steamCollection: collectionID });
			GetCollection(BigInt(collectionID))
				.then((collection: ModCollection) => {
					this.setState({ collection });

					const modIDs = collection.mods;
					const { modErrors } = this.state;
					// eslint-disable-next-line promise/no-nesting
					ProcessBatchModDetails(modIDs, modErrors)
						// eslint-disable-next-line promise/no-nesting
						.then((rows) => {
							this.setState({
								rows,
								filteredRows: rows,
								fetchingDetails: false
							});
							return true;
						})
						// eslint-disable-next-line promise/no-nesting
						.catch((e: Error) => {
							console.error(e);
							this.setState({ fetchingDetails: false });
							reportException(e as Error);
						});
					return;
				})
				.catch((e: Error) => {
					console.error(e);
					this.setState({ fetchingDetails: false });
					reportException(e as Error);
				});
		} catch (e) {
			console.error(e);
			this.setState({ fetchingDetails: false });
			reportException(e as Error);
		}
	}

	// fetch collection/mod details on load
	componentDidMount(): void {
		const { collectionID } = this.props;
		if (collectionID) {
			this.fetchCollectionDetails(collectionID);
		} else {
			this.setState({ fetchingDetails: false });
		}
	}

	render() {
		const { rows, filteredRows, fetchingDetails, modErrors, collection } = this.state;
		const { reportException, collectionID, updateState } = this.props;
		const tableProps: CollectionViewProps = {
			rows,
			filteredRows,
			getModDetails: (mod: string, modData: ModData, bigDetails?: boolean) => {
				console.log(mod, modData, bigDetails);
				return;
			}
		};
		return (
			<Layout style={{ height: '100vh', padding: 20 }}>
				<Content style={{ height: '90%' }}>
					<div
						style={{
							height: '100%',
							padding: '0px',
							overflowY: 'scroll'
						}}
					>
						<Input
							allowClear
							value={collectionID}
							onChange={(event) => {
								const newStr = event.target.value;
								try {
									const fileRegex = new RegExp('/\\?id=([0-9]+)');
									const matches = newStr.match(fileRegex);
									if (matches) {
										// eslint-disable-next-line prefer-destructuring
										const newCollectionID = matches[1];
										this.fetchCollectionDetails(newCollectionID);
										updateState({ steamCollectionID: newCollectionID });
									}
								} catch (e) {
									console.error(e);
									reportException(e as Error);
								}
							}}
						/>
						<div style={{ padding: 10 }} />
						<CollectionTable {...tableProps} loading={fetchingDetails} modErrors={modErrors} />
					</div>
				</Content>
				<Footer>
					<Button
						type="primary"
						disabled={!collection}
						onClick={() => {
							LaunchWithMods(collection!.mods);
						}}
					>
						Launch Game
					</Button>
				</Footer>
			</Layout>
		);
	}
}
