export interface PropsMainDetailArea {}

export interface IDataDetailArea {
	uuid: string;
	rootUuid: string | null;
	parentUuid: string | null;
	parentName: string | null;
	code: string;
	name: string;
	address: string;
	notes: string;
	timeCreated: string;
	status: number;
	totalChild: number;
	totalTeam: number;
	totalDevice: number;
	totalUser: number;
}
