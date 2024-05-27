import axiosClient from '.';

<<<<<<< HEAD
import {STATUS_GENERAL, } from '~/constants/config/enum';
=======
import {STATUS_GENERAL} from '~/constants/config/enum';
>>>>>>> 5591e4e10f381f2331e786efa7d22afbf98e4ee3

const accountServices = {
	updateAccount: (
		data: {
			uuid: string | null;
			roleUuid: string | null;
			userName: string;
			status: STATUS_GENERAL;
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
		return axiosClient.post(`/Account/account_detail`, data, {
			cancelToken: tokenAxios,
		});
	},
	updateAccountStatus: (data: {uuid: string; status: number}, tokenAxios?: any) => {
		return axiosClient.post(`/Account/account_user_status`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default accountServices;
