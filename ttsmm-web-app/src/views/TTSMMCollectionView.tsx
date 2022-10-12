/* eslint-disable @typescript-eslint/no-explicit-any */
import { useOutletContext } from 'react-router-dom';
import { Component } from 'react';

import { DisplayModData } from '../model/CollectionValidation';
import { ModData } from '../model/Mod';
import { CollectionViewProps, ModCollection, TTSMMCollection } from '../model/ModCollection';
import CollectionTable from '../components/CollectionTableComponent';
import { ProcessBatchModDetails } from '../Api';

interface TTSMMCollectionState {
	rows: DisplayModData[];
	filteredRows: DisplayModData[];
	collection?: ModCollection;
	fetchingDetails: boolean;
	error?: string;
	modErrors: Map<string, string>;
}

export interface TTSMMCollectionProps {
	collection: TTSMMCollection;
	updateState: (update: any) => void;
}

class TTSMMCollectionComponent extends Component<TTSMMCollectionProps, TTSMMCollectionState> {
	constructor(props: TTSMMCollectionProps) {
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
		const { updateState, collection } = this.props;
		updateState({ collection });
		try {
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
		} catch (e) {
			console.error(e);
			this.setState({ error: (e as Error).toString(), fetchingDetails: false });
		}
		return;
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

export default () => {
	return <TTSMMCollectionComponent {...useOutletContext()} />;
};
