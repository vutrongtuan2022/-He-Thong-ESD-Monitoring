import axiosClient from '.';

import {STATUS_GENERAL, STATUS_USER} from '~/constants/config/enum';

const accountServices = {
	updateAccount: (
		data: {
			uuid: string | null;
			roleUuid: string | null;
			userName: string;
			status: STATUS_GENERAL;

			// uuid: string | null;
			// userName: string;
			// fullname: string;
			// teamUuid: string;
			// gender: GENDER;
			// email: string;
			// phone: string;
			// address: string;
			// birthday: string;
			// avatar: string;
			// role: string;
			// status: STATUS_GENERAL;
			// code: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Account/upsert_account`, data, {
			cancelToken: tokenAxios,
		});
	},
	listAccount: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			roleUuid: string;
			status: string | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Account/page_list_account`, data, {
			cancelToken: tokenAxios,
		});
	},

	accountDetail: (data: {uuid: string}, tokenAxios?: any) => {
		return axiosClient.post(`Account/account_detail`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default accountServices;
