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
}
