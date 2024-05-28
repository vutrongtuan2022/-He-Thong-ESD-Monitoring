import axiosClient from '.';

import {GENDER, STATUS_GENERAL} from '~/constants/config/enum';

const userServices = {
	upsertUser: (
		data: {
			uuid: string | null;
			userName: string;
			fullname: string;
			teamUuid: string;
			gender: GENDER;
			email: string;
			phone: string;
			address: string;
			birthday: string;
			avatar: string;
			regencyUuid: string;
			status: STATUS_GENERAL;
			code: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/User/upsert_user`, data, {
			cancelToken: tokenAxios,
		});
	},
	listUser: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			teamUuid: string;
			username: string | null;

			timeCreated: {
				fromDate: string | null;
				toDate: string | null;
			} | null;
			status: string | null;
			isHaveAcc: string | null;
			regencyUuid: string | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/User/page_list_user`, data, {
			cancelToken: tokenAxios,
		});
	},

	userDetail: (data: {uuid: string}, tokenAxios?: any) => {
		return axiosClient.post(`/User/user_detail`, data, {
			cancelToken: tokenAxios,
		});
	},
	updateUserStatus: (data: {uuid: string; status: number}, tokenAxios?: any) => {
		return axiosClient.post(`/User/update_user_status`, data, {
			cancelToken: tokenAxios,
		});
	},
	exportExcel: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			teamUuid: string | null;
			timeCreated: {
				fromDate: string;
				toDate: string;
			} | null;
			status: string | null;
			isHaveAcc: string | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/User/export_excel`, data, {
			cancelToken: tokenAxios,
		});
	},
	importExcel: (data: {FileData: any; Type: any}, tokenAxios?: any) => {
		return axiosClient.put(`/User/import_excel`, data, {
			cancelToken: tokenAxios,
			headers: {
				'Content-Type': 'multipart/form-data',
				Accept: 'text/plain',
			},
		});
	},
};

export default userServices;
