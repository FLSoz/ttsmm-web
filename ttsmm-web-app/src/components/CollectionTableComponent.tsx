/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Table, Tag, Tooltip, Typography } from 'antd';
import React, { Component } from 'react';
import { ColumnType } from 'antd/lib/table';
import { CompareFn } from 'antd/lib/table/interface';
import { HddFilled, CodeFilled } from '@ant-design/icons';

import { ModType } from '../model/Mod';
import { CorpType, getCorpType } from '../model/Corp';
import { CollectionViewProps } from '../model/ModCollection';
import { MainColumnTitles } from '../model/CollectionConfig';
import { DisplayModData, ModErrors } from '../model/CollectionValidation';
import { formatDateStr } from '../util/Date';

import steam from '../assets/steam.png';
import ttmm from '../assets/ttmm.png';
import Corp_Icon_HE from '../assets/Corp_Icon_HE.png';
import Corp_Icon_BF from '../assets/Corp_Icon_BF.png';
import Corp_Icon_GC from '../assets/Corp_Icon_GC.png';
import Corp_Icon_GSO from '../assets/Corp_Icon_GSO.png';
import Corp_Icon_VEN from '../assets/Corp_Icon_VEN.png';
import Corp_Icon_RR from '../assets/Corp_Icon_EXP.png';
import Corp_Icon_SPE from '../assets/Corp_Icon_SPE.png';
import Icon_Skins from '../assets/paintbrush.svg';
import Icon_Blocks from '../assets/StandardBlocks.svg';
import Icon_Corps from '../assets/faction-flag.svg';

interface CollectionState {
	currentRecord?: DisplayModData;
	bigDetails?: boolean;
}

function getImageSrcFromType(type: ModType, size = 15) {
	switch (type) {
		case ModType.LOCAL:
			return (
				<Tooltip title="This is a local mod">
					<HddFilled style={{ fontSize: size }} />
				</Tooltip>
			);
		case ModType.TTQMM:
			return (
				<Tooltip title="This is a TTMM mod">
					<img src={ttmm} width={size} alt="" key="type" />
				</Tooltip>
			);
		case ModType.WORKSHOP:
			return (
				<Tooltip title="This is a Steam mod">
					<img src={steam} width={size} alt="" key="type" />
				</Tooltip>
			);
		default:
			return null;
	}
}

enum TypeTag {
	CORPS = 0,
	SKINS = 1,
	BLOCKS = 2
}

function getTypeIcon(type: TypeTag, size = 15) {
	switch (type) {
		case TypeTag.SKINS:
			return (
				<Tooltip title="Skins" key={type}>
					<img src={Icon_Skins} width={size - 14} alt="" key={type} />
				</Tooltip>
			);
		case TypeTag.BLOCKS:
			return (
				<Tooltip title="Blocks" key={type}>
					<img src={Icon_Blocks} width={size} alt="" key={type} />
				</Tooltip>
			);
		case TypeTag.CORPS:
			return (
				<Tooltip title="Custom Corps" key={type}>
					<img src={Icon_Corps} width={size - 10} alt="" key={type} />
				</Tooltip>
			);
		default:
			return null;
	}
}
function getCorpIcon(type: CorpType, size = 15) {
	switch (type) {
		case CorpType.HE:
			return (
				<Tooltip title="Hawkeye (HE)" key={type}>
					<img src={Corp_Icon_HE} width={size} alt="" key={type} />
				</Tooltip>
			);
		case CorpType.GSO:
			return (
				<Tooltip title="Galactic Survey Organization (GSO)" key={type}>
					<img src={Corp_Icon_GSO} width={size} alt="" key={type} />
				</Tooltip>
			);
		case CorpType.GC:
			return (
				<Tooltip title="GeoCorp (GC)" key={type}>
					<img src={Corp_Icon_GC} width={size} alt="" key={type} />
				</Tooltip>
			);
		case CorpType.BF:
			return (
				<Tooltip title="Better Future (BF)" key={type}>
					<img src={Corp_Icon_BF} width={size} alt="" key={type} />
				</Tooltip>
			);
		case CorpType.RR:
			return (
				<Tooltip title="Reticule Research (EXP)" key={type}>
					<img src={Corp_Icon_RR} width={size} alt="" key={type} />
				</Tooltip>
			);
		case CorpType.SPE:
			return (
				<Tooltip title="Special (SPE)" key={type}>
					<img src={Corp_Icon_SPE} width={size} alt="" key={type} />
				</Tooltip>
			);
		case CorpType.VEN:
			return (
				<Tooltip title="Venture (VEN)" key={type}>
					<img src={Corp_Icon_VEN} width={size} alt="" key={type} />
				</Tooltip>
			);
		default:
			return null;
	}
}
function getTypeTag(tag: string): TypeTag | null {
	const lowercase = tag.toLowerCase().trim();
	if (lowercase === 'blocks') {
		return TypeTag.BLOCKS;
	}
	if (lowercase === 'skins') {
		return TypeTag.SKINS;
	}
	if (lowercase === 'custom corps') {
		return TypeTag.CORPS;
	}
	return null;
}

interface ColumnSchema<T> {
	title: string;
	dataIndex: string;
	className?: string;
	width?: number;
	align?: 'center';
	defaultSortOrder?: 'ascend';
	sorter?:
		| boolean
		| CompareFn<DisplayModData>
		| {
				compare?: CompareFn<DisplayModData> | undefined;
				multiple?: number | undefined;
		  }
		| undefined;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	renderSetup?: (props: CollectionViewProps) => (value: any, record: T, index: number) => React.ReactNode;
}

const { Text } = Typography;

const MAIN_COLUMN_SCHEMA: ColumnSchema<DisplayModData>[] = [
	{
		title: MainColumnTitles.TYPE,
		dataIndex: 'type',
		className: 'CollectionRowModType',
		renderSetup: (props: CollectionViewProps) => {
			const { config } = props;
			const small = config?.smallRows;
			return (type: ModType) => (
				<Button
					type="text"
					onClick={() => {
						// eslint-disable-next-line react/prop-types
					}}
				>
					{getImageSrcFromType(type, small ? 20 : 30)}
				</Button>
			);
		},
		width: 65,
		align: 'center'
	},
	{
		title: MainColumnTitles.NAME,
		dataIndex: 'title',
		className: 'CollectionRowModName',
		defaultSortOrder: 'ascend',
		sorter: (a: DisplayModData, b: DisplayModData) => {
			if (a.title) {
				if (b.title) {
					return a.title > b.title ? 1 : -1;
				}
				return 1;
			}
			if (b.title) {
				return -1;
			}
			return 0;
		},
		renderSetup: (props: CollectionViewProps) => {
			return (title: string, record: DisplayModData) => {
				let updateType: 'danger' | 'warning' | undefined;
				const { uid } = record;
				let correctedName = title;
				// eslint-disable-next-line react/destructuring-assignment
				const matches = title.match(/(.*)\s*\(([^()]*[Tt][Tt][Ss][Mm][Mm][^()]*)\)$/);
				if (matches && matches[1]) {
					correctedName = matches[1].trim();
				}
				const hasCode = false;
				return (
					<button
						type="submit"
						style={{
							fontSize: 14,
							backgroundColor: 'transparent',
							borderRadius: 0,
							width: '100%',
							padding: 2,
							paddingLeft: 6,
							paddingRight: 4,
							margin: 0,
							verticalAlign: 'middle',
							textAlign: 'left',
							wordWrap: 'break-word',
							display: 'block'
						}}
						onClick={() => {
							// eslint-disable-next-line react/prop-types
							const { getModDetails } = props;
							getModDetails(uid, record);
						}}
					>
						<Text type={updateType} style={{ whiteSpace: 'normal', width: '100%', verticalAlign: 'middle' }}>{` ${correctedName} `}</Text>
						{hasCode && <CodeFilled style={{ color: '#6abe39', fontSize: 16, verticalAlign: 'middle' }} />}
					</button>
				);
			};
		}
	},
	{
		title: MainColumnTitles.AUTHORS,
		dataIndex: 'authors',
		width: 150,
		defaultSortOrder: 'ascend',
		sorter: (a, b) => {
			const v1 = a;
			const v2 = b;
			if (v1.authors) {
				if (v2.authors) {
					const l1 = v1.authors.length;
					const l2 = v2.authors.length;
					let ind = 0;
					while (ind < l1 && ind < l2) {
						if (v1.authors[ind] > v2.authors[ind]) {
							return 1;
						}
						if (v1.authors[ind] < v2.authors[ind]) {
							return -1;
						}
						ind += 1;
					}
					if (l1 > l2) {
						return 1;
					}
					if (l1 < l2) {
						return -1;
					}
					return 0;
				}
				return 1;
			}
			return -1;
		},
		// eslint-disable-next-line @typescript-eslint/ban-types
		renderSetup: () => {
			return (authors: string[] | undefined) => {
				return (authors || []).map((author) => {
					return <Tag key={author}>{author}</Tag>;
				});
			};
		}
	},
	{
		title: MainColumnTitles.STATE,
		dataIndex: 'errors',
		width: 250,
		renderSetup: (props: CollectionViewProps) => {
			const { lastValidationStatus } = props;
			return (errors: ModErrors | undefined) => {
				const errorTags: { text: string; color: string }[] = [];
				if (errors) {
					const { incompatibleMods, invalidId, missingDependencies } = errors;
					if (incompatibleMods && incompatibleMods.length > 0) {
						errorTags.push({
							text: 'Conflicts',
							color: 'red'
						});
					}
					if (invalidId) {
						errorTags.push({
							text: 'Invalid ID',
							color: 'volcano'
						});
					}
					if (missingDependencies && missingDependencies.length > 0) {
						errorTags.push({
							text: 'Missing dependencies',
							color: 'orange'
						});
					}
				}
				if (errorTags.length > 0) {
					return errorTags.map((tagConfig) => {
						return (
							<Tag key={tagConfig.text} color={tagConfig.color}>
								{tagConfig.text}
							</Tag>
						);
					});
				}

				// If everything is fine, only return OK if we have actually validated it
				if (lastValidationStatus !== undefined) {
					return (
						<Tag key="OK" color="green">
							OK
						</Tag>
					);
				}
				return null;
			};
		}
	},
	{
		title: MainColumnTitles.SIZE,
		dataIndex: 'size',
		width: 80,
		renderSetup: () => {
			return (size?: number) => {
				if (size && size > 0) {
					// return 3 points of precision
					const strNum = `${size}`;
					const power = strNum.length;
					// eslint-disable-next-line prefer-const
					let [digit1, digit2, digit3, digit4] = strNum;
					let sizeStr = '';
					if (!digit4) {
						sizeStr = `${strNum} B`;
					} else {
						digit3 = parseInt(digit4, 10) >= 5 ? `${parseInt(digit3, 10) + 1}` : digit3;

						let descriptor = ' B';
						if (power > 3) {
							if (power > 6) {
								if (power > 9) {
									descriptor = ' GB';
								} else {
									descriptor = ' MB';
								}
							} else {
								descriptor = ' KB';
							}
						}

						let value = `${digit1}${digit2}${digit3}`;
						const decimal = power % 3;
						if (decimal === 1) {
							value = `${digit1}.${digit2}${digit3}`;
						} else if (decimal === 2) {
							value = `${digit1}${digit2}.${digit3}`;
						}
						sizeStr = value + descriptor;
					}
					let color = 'green'; // under 1 MB is green
					if (size > 1000000) {
						if (size < 5000000) {
							// under 5 MB is cyan
							color = 'cyan';
						} else if (size < 50000000) {
							// under 50 MB is blue
							color = 'blue';
						} else if (size < 1000000000) {
							// under 1 GB is geekblue
							color = 'geekblue';
						} else if (size < 5000000000) {
							// under 5 GB is purple
							color = 'purple';
						} else {
							color = 'magenta';
						}
					}
					return (
						<Tag color={color} key="size">
							{sizeStr}
						</Tag>
					);
				}
				return null;
			};
		}
	},
	{
		title: MainColumnTitles.LAST_UPDATE,
		dataIndex: 'lastUpdate',
		width: 130,
		renderSetup: () => {
			return (date: Date) => {
				return formatDateStr(date);
			};
		}
	},
	{
		title: MainColumnTitles.LAST_WORKSHOP_UPDATE,
		dataIndex: 'lastWorkshopUpdate',
		width: 130,
		renderSetup: () => {
			return (date: Date) => {
				return formatDateStr(date);
			};
		}
	},
	{
		title: MainColumnTitles.DATE_ADDED,
		dataIndex: 'dateAdded',
		width: 130,
		renderSetup: () => {
			return (date: Date) => {
				return formatDateStr(date);
			};
		}
	},
	{
		title: MainColumnTitles.TAGS,
		dataIndex: 'tags',
		className: 'CollectionRowTags',
		// eslint-disable-next-line @typescript-eslint/ban-types
		renderSetup: (props: CollectionViewProps) => {
			const { config } = props;
			const small = config?.smallRows;
			return (tags: string[] | undefined) => {
				const iconTags: CorpType[] = [];
				const actualTags: string[] = [];
				const typeTags: TypeTag[] = [];
				new Set([...(tags || [])]).forEach((tag: string) => {
					const corp = getCorpType(tag);
					const type = getTypeTag(tag);
					if (tag.toLowerCase() !== 'mods') {
						if (corp != null) {
							iconTags.push(corp);
						} else if (type != null) {
							typeTags.push(type);
						} else {
							actualTags.push(tag);
						}
					}
				});
				return [
					...typeTags.map((type) => getTypeIcon(type, small ? 35 : 40)),
					...actualTags.map((tag) => (
						<Tag color="blue" key={tag}>
							{tag}
						</Tag>
					)),
					...iconTags.map((corp) => getCorpIcon(corp, small ? 35 : 40))
				];
			};
		}
	}
];

export default class CollectionTable extends Component<CollectionViewProps, CollectionState> {
	constructor(props: CollectionViewProps) {
		super(props);
		this.state = {};
	}

	getColumnSchema(): ColumnType<DisplayModData>[] {
		const { config } = this.props;
		let activeColumns: ColumnSchema<DisplayModData>[] = MAIN_COLUMN_SCHEMA;
		const columnActiveConfig = config?.columnActiveConfig;
		if (columnActiveConfig) {
			activeColumns = activeColumns.filter(
				(colSchema) => columnActiveConfig[colSchema.title] || columnActiveConfig[colSchema.title] === undefined
			);
		}
		return activeColumns.map((colSchema: ColumnSchema<DisplayModData>) => {
			const { title, dataIndex, className, width, defaultSortOrder, sorter, align, renderSetup } = colSchema;
			return {
				title,
				dataIndex,
				className,
				width,
				defaultSortOrder,
				sorter,
				align,
				render: renderSetup ? renderSetup(this.props) : undefined
			};
		});
	}

	render() {
		const { config, filteredRows, loading } = this.props;
		const small = config?.smallRows;
		return (
			// eslint-disable-next-line react/destructuring-assignment
			<Table
				loading={loading}
				dataSource={filteredRows}
				pagination={false}
				size="small"
				rowKey="uid"
				columns={this.getColumnSchema()}
				sticky
				onRow={(record) => {
					return {
						onDoubleClick: (event) => {
							console.debug(`Double clicking ${record.uid}, ${event}`);
							// this.props.getModDetails(record.uid, record, true);
						},
						onContextMenu: (event) => {
							console.debug(`Showing context menu for ${record.uid}, ${event}`);
							// const { screenX, screenY } = event;
							// api.send(ValidChannel.OPEN_MOD_CONTEXT_MENU, record, screenX, screenY);
						}
					};
				}}
				rowClassName={() => (small ? 'CompactModRow' : 'LargeModRow')}
			/>
		);
	}
}
