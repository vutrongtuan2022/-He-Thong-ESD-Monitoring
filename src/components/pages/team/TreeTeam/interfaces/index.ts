export interface PropsTreeTeam {
	team: ITeamTree;
	level: number;
}

export interface ITeamTree {
	uuid: string;
	code: string;
	name: string;
	leaderName: string;
	totalSubTeams: number;
	totalUsers: number;
	totalDevices: number;
}
