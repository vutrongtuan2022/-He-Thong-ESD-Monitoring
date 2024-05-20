import axiosClient from '.';

const teamServices = {
	upsertTeam: (
		data: {
			uuid: string | null;
			rootUuid: string;
			parentUuid: string;
			code: string;
			name: string;
			leaderUuid: string;
			areaUuid: string;
			devices: string;
			notes: string;
			status: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`Team/upsert_team`, data, {
			cancelToken: tokenAxios,
		});
	},
	detailTeam: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`Team/team_detail`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default teamServices;
