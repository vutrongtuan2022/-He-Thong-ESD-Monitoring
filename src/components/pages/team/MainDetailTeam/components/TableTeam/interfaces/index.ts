export interface PropsTableTeam {}

export interface ITeamChild {
	uuid: string;
	parentUuid: string;
	code: string;
	parentName: string | null;
	totalUnderTeam: number;
	name: string;
	leaderUuid: string;
	leadCode: string | null;
	leaderName: string;
	totalDevices: number;
	areaName: string | null;
	areaUuid: string | null;
	totalUser: number;
	notes: string;
	timeCreated: string;
	status: number;
}
