export interface PropsTableTeam {}

export interface ITableTeam {
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
