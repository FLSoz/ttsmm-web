import axios, { AxiosResponse } from 'axios';
import { HARMONY_ID, MODMANAGER_ID, TT_ID } from './Constants';
import { EResult, PublishedFileDetails } from './model/Api';
import { DisplayModData } from './model/CollectionValidation';
import { ConvertToModData, ModData } from './model/Mod';
import { ConvertToCollection, ModCollection } from './model/ModCollection';

class SteamAPIWrapper {
	pendingRequests: Set<bigint> = new Set();
	cache: Map<bigint, PublishedFileDetails> = new Map();
	promiseMap: Map<bigint, Promise<PublishedFileDetails>> = new Map();
	callbacks: Map<bigint, (data: PublishedFileDetails) => void> = new Map();

	constructor() {
		this.PerformRequest = this.PerformRequest.bind(this);
	}

	GetFileDetails(id: bigint): Promise<PublishedFileDetails> {
		const details = this.cache.get(id);
		if (details) {
			return Promise.resolve(details);
		} else {
			if (this.pendingRequests.size === 0) {
				setTimeout(this.PerformRequest, 500);
			}
			this.pendingRequests.add(id);
			let promise = this.promiseMap.get(id);
			if (!promise) {
				promise = new Promise((resolve) => {
					const callback = (data: PublishedFileDetails) => {
						resolve(data);
					};
					this.callbacks.set(id, callback);
				});
				this.promiseMap.set(id, promise);
			}
			return promise;
		}
	}

	PerformRequest() {
		if (this.pendingRequests.size > 0) {
			const processedRequests = [...this.pendingRequests];
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const params: any = {
				itemcount: processedRequests.length
			};
			[...Array(processedRequests.length).keys()].forEach((index: number) => {
				params[`publishedfileids[${index}]`] = processedRequests[index].toString();
			});

			axios
				.post(`https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/`, params)
				.then((response: AxiosResponse) => {
					response.data.response.publishedfiledetails.forEach((data: PublishedFileDetails) => {
						const workshopID = BigInt(data.publishedfileid);
						this.cache.set(workshopID, data);
						const callback = this.callbacks.get(workshopID);
						if (callback) {
							// eslint-disable-next-line promise/no-callback-in-promise
							callback(data);
							this.callbacks.delete(workshopID);
							this.promiseMap.delete(workshopID);
						}
					});
					return;
				})
				.catch(() => {
					[...Array(processedRequests.length).keys()].forEach((index: number) => {
						const workshopStr = params[`publishedfileids[${index}]`];
						const workshopID = BigInt(workshopStr);
						const callback = this.callbacks.get(workshopID);
						if (callback) {
							// eslint-disable-next-line promise/no-callback-in-promise
							callback({
								publishedfileid: workshopStr,
								result: EResult.RemoteCallFailed
							});
							this.callbacks.delete(workshopID);
							this.promiseMap.delete(workshopID);
						}
					});
				})
				.finally(() => {
					this.pendingRequests.clear();
				});
		}
	}
}

const API_WRAPPER = new SteamAPIWrapper();

function GetFileDetails(fileId: bigint): Promise<PublishedFileDetails> {
	return API_WRAPPER.GetFileDetails(fileId);
}

function GetResultName(result: EResult): string {
	const entries = Object.entries(EResult);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const pair = entries.filter(([_key, value]) => {
		return value === result;
	});
	if (pair.length === 1) {
		return pair[0][0];
	}
	return 'UNKNOWN';
}

export async function GetModData(modId: bigint): Promise<ModData> {
	const data = await GetFileDetails(modId);
	if (data.result === EResult.OK) {
		return ConvertToModData(data);
	} else {
		throw new Error(GetResultName(data.result));
	}
}

export async function GetCollection(collectionFileId: bigint): Promise<ModCollection> {
	return Promise.allSettled([
		axios
			.post(`https://api.steampowered.com/ISteamRemoteStorage/GetCollectionDetails/v1/`, {
				collectioncount: 1,
				'publishedfileids[0]': collectionFileId
			})
			.then((response: AxiosResponse) => {
				return response.data.response.collectiondetails[0].children as { publishedfileid: string; filetype: number; sortorder: number }[];
			}),
		GetFileDetails(collectionFileId)
	]).then((results) => {
		if (results[1].status === 'fulfilled') {
			if (results[1].value.result === EResult.OK) {
				const collection: ModCollection = ConvertToCollection(results[1].value);
				if (results[0].status === 'fulfilled') {
					collection.mods = results[0].value.sort((a, b) => a.sortorder - b.sortorder).map((fileDetails) => fileDetails.publishedfileid);
				} else {
					throw new Error(results[0].reason);
				}
				return collection;
			} else {
				throw new Error(GetResultName(results[1].value.result));
			}
		} else {
			throw new Error(results[1].reason);
		}
	});
}

async function GetBatchModDetails(modIds: string[]): Promise<(ModData | string)[]> {
	return Promise.allSettled(
		modIds.map((modId: string) => {
			try {
				const workshopID = BigInt(modId);
				return GetModData(workshopID);
			} catch (e) {
				console.error(e);
				return Promise.reject(e);
			}
		})
	).then((results: PromiseSettledResult<ModData>[]) => {
		return results.map((result) => {
			if (result.status === 'fulfilled') {
				return result.value;
			} else {
				return result.reason;
			}
		});
	});
}

export async function ProcessBatchModDetails(modIDs: string[], modErrors: Map<string, string>): Promise<DisplayModData[]> {
	modErrors.clear();
	return GetBatchModDetails(modIDs)
		.then((results: (ModData | string)[]) => {
			const rows: DisplayModData[] = results.map((result, index) => {
				if (result instanceof String) {
					const originalID = modIDs[index];
					modErrors.set(originalID, result as string);
					const modData: DisplayModData = {
						errors: {
							invalidId: true
						},
						uid: `workshop:${originalID}`,
						result: EResult.Fail,
						publishedfileid: originalID
					};
					return modData;
				} else {
					return result as DisplayModData;
				}
			});
			return rows;
		})
		.catch((e: Error) => {
			console.error(e);
			return [...Array(modIDs.length)].map((index: number) => {
				const originalID = modIDs[index];
				modErrors.set(originalID, e.toString());
				const modData: DisplayModData = {
					errors: {
						invalidId: true
					},
					uid: `workshop:${originalID}`,
					result: EResult.Fail,
					publishedfileid: originalID
				};
				return modData;
			});
		});
}

export function LaunchWithMods(mods: string[], additionalArgs: string[] = [], pureVanilla = false) {
	if (!additionalArgs) {
		additionalArgs = [];
	}

	if (pureVanilla && mods.filter((mod) => ![HARMONY_ID, MODMANAGER_ID].includes(mod)).length === 0) {
		window.open(`steam://rungameid/${TT_ID}//+custom_mod_list []`);
	} else {
		window.open(
			`steam://rungameid/${TT_ID}//+custom_mod_list [workshop:${MODMANAGER_ID}] +ttsmm_mod_list [${mods
				.map((mod) => `workshop:${mod}`)
				.join(',')}] ${additionalArgs.join(' ')}`
		);
	}
}
