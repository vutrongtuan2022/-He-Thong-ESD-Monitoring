import axiosClient from '.';

const accountServices = {
	listAccount: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			roleUuid: string | null;
			status: number | null;
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
			imagesUuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Account/update_account`, data, {
			cancelToken: tokenAxios,
		});
	},
	exportExcel: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			roleUuid: string | null;
			status: number | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Account/export_excel`, data, {
			cancelToken: tokenAxios,
		});
	},
	changePassword: (
		data: {
			uuid: string;
			oldPassword: string;
			newPassword: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Account/change_pass_account`, data, {
			cancelToken: tokenAxios,
		});
	},
	updateAccoutLogin: (
		data: {
			uuid: string;
			roleUuid: string;
			imagesUuid: string;
			fullName: string;
			gender: number;
			phone: string;
			birthday: string;
			address: string;
			regencyUuid: string;
			email: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Account/Update_account_login`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default accountServices;
