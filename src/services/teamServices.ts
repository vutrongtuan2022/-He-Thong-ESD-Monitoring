import axiosClient from '.';

const teamServices = {
	upsertTeam: (
		data: {
			uuid: string | null;
			rootUuid: string | null;
			parentUuid: string;
			code: string;
			name: string;
			leaderUuid: string;
			areaUuid: string;
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
	getSumTeam: (data: {}, tokenAxios?: any) => {
		return axiosClient.post(`Team/get_sum_team`, data, {
			cancelToken: tokenAxios,
		});
	},
	pageListTeam: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number | null;
			leaderUuid: string | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`Team/page_list_team`, data, {
			cancelToken: tokenAxios,
		});
	},
	changeStatusTeam: (
		data: {
			uuid: string;
			status: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`Team/update_team_status`, data, {
			cancelToken: tokenAxios,
		});
	},
	listTeamTree: (
		data: {
			uuid: string | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`Team/list_team_tree`, data, {
			cancelToken: tokenAxios,
		});
	},
	listTeamChild: (data: {pageSize: number; page: number; uuid: string}, tokenAxios?: any) => {
		return axiosClient.post(`Team/page_list_child_team`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default teamServices;
