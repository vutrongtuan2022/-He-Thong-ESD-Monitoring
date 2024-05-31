import axiosClient from '.';

const accountServices = {
	listAccount: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			roleUuid: string | null;
			status: number | null;
			// roleName:string|null
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
		return axiosClient.post(`/Account/update_account_status`, data, {
			cancelToken: tokenAxios,
		});
	},
	registerAccount: (data: {userUuid: string; roleUuid: string; status: number; imagesUuid: string}, tokenAxios?: any) => {
		return axiosClient.post(`/Account/register`, data, {
			cancelToken: tokenAxios,
		});
	},
	updateAccount: (
		data: {
			uuid: string;
			roleUuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Account/update_account`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default accountServices;
