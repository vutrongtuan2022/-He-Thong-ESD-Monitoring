import axiosClient from '.';

const dashboardServices = {
	dashboardOverview: (data: {}, tokenAxios?: any) => {
		return axiosClient.post(`/Dashboard/dashboard_overview`, data, {
			cancelToken: tokenAxios,
		});
	},
	listDeviceNG: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			teamNames: string[] | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Dashboard/page_device_ng`, data, {
			cancelToken: tokenAxios,
		});
	},
	checkDeviceNG: (
		data: {
			uuid: string;
			deviceUuid: string[];
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Dashboard/check_device_ng`, data, {
			cancelToken: tokenAxios,
		});
	},
	dashboardChart: (data: {date: string}, tokenAxios?: any) => {
		return axiosClient.post(`/Dashboard/dashboard_chart`, data, {
			cancelToken: tokenAxios,
		});
	},
	exportExcel: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			teamNames: string[] | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Dashboard/export_excel`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default dashboardServices;
