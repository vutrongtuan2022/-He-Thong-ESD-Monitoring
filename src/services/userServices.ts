import axiosClient from '.';

import {GENDER, STATUS_GENERAL, STATUS_USER} from '~/constants/config/enum';

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
			role: string;
			status: STATUS_GENERAL;
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
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/User/page_list_user`, data, {
			cancelToken: tokenAxios,
		});
	},
	upsertUserUser: (
		data: {
			uuid: string | null;
			macNumber: string | null;
			name: string | null;
			gatewayUuid: string | null;
			teamUuid: string | null;
			status: number | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/User/upsert_user_device`, data, {
			cancelToken: tokenAxios,
		});
	},

	userDetail: (data: {uuid: string}, tokenAxios?: any) => {
		return axiosClient.post(`/User/user_detail`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default userServices;
