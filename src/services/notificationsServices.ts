import axiosClient from '.';

const notificationsServices = {
	getList: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Notify/page_list_notify`, data, {
			cancelToken: tokenAxios,
		});
	},
	readAllNoti: (data: {uuid: string}, tokenAxios?: any) => {
		return axiosClient.post(`/Notify/Update_notify_status_all`, data, {
			cancelToken: tokenAxios,
		});
	},
	readOneNoti: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Notify/update_notify_status`, data, {
			cancelToken: tokenAxios,
		});
	},
	numberNoti: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Notify/get_sum_unseen_notify`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default notificationsServices;
