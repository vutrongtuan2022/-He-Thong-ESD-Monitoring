export interface PropsMainDetailTeam {}

export interface IDataDetailTeam {
	uuid: string;
	parentUuid: string | null;
	code: string;
	parentName: string | null;
	totalUnderTeam: number;
	name: string;
	leaderUuid: string;
	leadCode: string;
	leaderName: string;
	totalDevices: number;
	totalUser: number;
	notes: string;
	timeCreated: string;
	status: number;
	areaName: string;
}
