export interface PropsTreeArea {
	area: ITeamArea;
	level: number;
}

export interface ITeamArea {
	uuid: string;
	code: string;
	name: string;
	totalTeams: number;
	totalUsers: number;
	totalChildArea: number;
	totalDevices: number;
}
