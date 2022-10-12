import { CSSProperties, ReactNode } from 'react';
import { ModData } from './Mod';
import { PublishedFileDetails } from './Api';
import { CollectionConfig } from './CollectionConfig';

export interface ModCollection extends PublishedFileDetails {
	mods: string[];
}

export interface TTSMMCollection {
	name: string;
	mods: string[];
}

export function ConvertToCollection(data: PublishedFileDetails): ModCollection {
	const collection: ModCollection = { ...data, mods: [] };
	return collection;
}

export interface CollectionViewProps {
	config?: CollectionConfig;
	rows: ModData[];
	filteredRows: ModData[];
	madeEdits?: boolean;
	lastValidationStatus?: boolean;
	getModDetails: (mod: string, modData: ModData, bigData?: boolean) => void;
}

export enum CollectionManagerModalType {
	NONE = 0,
	DESELECTING_MOD_MANAGER = 1,
	VIEW_SETTINGS = 2,
	ERRORS_FOUND = 'errors_found',
	WARNINGS_FOUND = 'warnings_found',
	IMPORT_COLLECTION = 5,
	EXPORT_COLLECTION = 6,
	WARN_OVERWRITE_COLLECTION = 7,
	EDIT_OVERRIDES = 8,
	WARN_DELETE = 9
}

export interface NotificationProps {
	placement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
	message: ReactNode;
	description?: ReactNode;
	btn?: ReactNode;
	className?: string;
	closeIcon?: ReactNode;
	duration: number | null;
	key?: string;
	style?: CSSProperties;
	onClick?: () => void;
	onClose?: () => void;
	top?: number;
	bottom?: number;
}
