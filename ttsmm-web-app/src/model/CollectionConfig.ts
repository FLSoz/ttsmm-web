export enum MainColumnTitles {
	TYPE = 'Type',
	NAME = 'Name',
	AUTHORS = 'Authors',
	STATE = 'State',
	SIZE = 'Size',
	LAST_UPDATE = 'Last Update',
	LAST_WORKSHOP_UPDATE = 'Workshop Update',
	DATE_ADDED = 'Date Added',
	TAGS = 'Tags'
}

export interface CollectionConfig {
	ignoreBadValidation?: boolean;
	smallRows?: boolean;
	columnActiveConfig?: { [colID: string]: boolean };
}
