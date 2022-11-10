export enum MainColumnTitles {
	TYPE = 'Type',
	NAME = 'Name',
	AUTHORS = 'Authors',
	STATE = 'State',
	SIZE = 'Size',
	LAST_UPDATE = 'Last Update',
	DATE_CREATED = 'Date Created',
	TAGS = 'Tags'
}

export interface CollectionConfig {
	ignoreBadValidation?: boolean;
	smallRows?: boolean;
	columnActiveConfig?: { [colID: string]: boolean };
}
