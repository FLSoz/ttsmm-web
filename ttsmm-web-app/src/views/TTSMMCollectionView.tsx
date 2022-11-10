/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from 'react';
import { Button, Input, Layout, Space } from 'antd';

import { DisplayModData } from '../model/CollectionValidation';
import { ModData } from '../model/Mod';
import { CollectionViewProps, TTSMMCollection } from '../model/ModCollection';
import CollectionTable from '../components/CollectionTableComponent';
import { ProcessBatchModDetails, LaunchWithMods } from '../Api';

const { TextArea } = Input;
const { Footer, Content } = Layout;

interface TTSMMCollectionState {
	rows: DisplayModData[];
	filteredRows: DisplayModData[];
	collectionStr?: string;
	fetchingDetails: boolean;
	error?: string;
	modErrors: Map<string, string>;
}

export interface TTSMMCollectionProps {
	ttsmmCollection: TTSMMCollection;
	updateState: (update: any) => void;
	reportException: (e: Error) => void;
}

export default class TTSMMCollectionView extends Component<TTSMMCollectionProps, TTSMMCollectionState> {
	constructor(props: TTSMMCollectionProps) {
		super(props);

		this.state = {
			rows: [],
			filteredRows: [],
			fetchingDetails: true,
			modErrors: new Map()
		};
	}

	// fetch collection/mod details on load if we have them
	componentDidMount(): void {
		const { ttsmmCollection } = this.props;
		if (ttsmmCollection) {
			this.fetchCollectionDetails(ttsmmCollection);
		}
		return;
	}

	fetchCollectionDetails(ttsmmCollection: TTSMMCollection) {
		this.setState({ fetchingDetails: true });
		const { reportException } = this.props;
		try {
			const modIDs = ttsmmCollection.mods;
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
					this.setState({ fetchingDetails: false });
					reportException(e as Error);
				});
			return;
		} catch (e) {
			console.error(e);
			this.setState({ fetchingDetails: false });
			reportException(e as Error);
		}
	}

	updateCollection(ttsmmCollection: TTSMMCollection) {
		const { updateState } = this.props;
		updateState({ ttsmmCollection });
		this.fetchCollectionDetails(ttsmmCollection);
	}

	render() {
		const { rows, filteredRows, fetchingDetails, collectionStr, modErrors } = this.state;
		const { reportException, ttsmmCollection } = this.props;
		const tableProps: CollectionViewProps = {
			rows,
			filteredRows,
			getModDetails: (mod: string, modData: ModData, bigDetails?: boolean) => {
				console.log(mod, modData, bigDetails);
				return;
			}
		};
		return (
			<Layout>
				<Content>
					<Space direction="vertical" size="middle" style={{ display: 'flex' }}>
						<TextArea
							allowClear
							value={collectionStr}
							autoSize
							onChange={(event) => {
								const newStr = event.target.value;
								this.setState({ collectionStr: newStr });

								try {
									const collectionObj = JSON.parse(newStr);
									if (collectionObj.name && collectionObj.mods) {
										const newCollection: TTSMMCollection = {
											name: collectionObj.name,
											mods: collectionObj.mods
										};
										this.updateCollection(newCollection);
									}
								} catch (e) {
									console.error(e);
									reportException(e as Error);
								}
							}}
						/>
						<CollectionTable {...tableProps} loading={fetchingDetails} modErrors={modErrors} />
					</Space>
				</Content>
				<Footer>
					<Button
						type="primary"
						disabled={!ttsmmCollection}
						onClick={() => {
							LaunchWithMods(ttsmmCollection!.mods);
						}}
					>
						Launch Game
					</Button>
				</Footer>
			</Layout>
		);
	}
}
