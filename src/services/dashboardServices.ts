import axiosClient from '.';

const dashboardServices = {
	dashboardOverview: (data: {}, tokenAxios?: any) => {
		return axiosClient.post(`/Dashboard/dashboard_overview`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default dashboardServices;
