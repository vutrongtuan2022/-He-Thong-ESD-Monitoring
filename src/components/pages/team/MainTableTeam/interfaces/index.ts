export interface PropsMainTableTeam {}

export interface ITeam {
	uuid: string;
	code: string;
	name: string;
	leaderUuid: string;
	leaderName: string;
	totalDevices: number;
	totalUser: number;
	notes: string;
	timeCreated: string;
	status: number;
	parentUuid: string;
	areaUuid: string;
	parentName: string;
	totalUnderTeam: number;
	leadCode: string | null;
	areaName: string;
}
