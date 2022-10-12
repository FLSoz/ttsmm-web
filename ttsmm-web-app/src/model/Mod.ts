import { PublishedFileDetails } from './Api';

/* eslint-disable no-bitwise */
export interface ModDescriptor {
	UIDs: Set<string>;
	modID?: string;
	name?: string;
}

export const WORKSHOP_MOD_TYPE = 'workshop';

export interface ModData extends PublishedFileDetails {
	uid: string;
	id?: string;
	authors?: string;
}

export function ConvertToModData(data: PublishedFileDetails): ModData {
	const mod: ModData = { ...data, uid: `workshop:${data.publishedfileid}` };
	return mod;
}

export enum ModType {
	LOCAL = 'local',
	WORKSHOP = 'workshop',
	TTQMM = 'ttqmm'
}
