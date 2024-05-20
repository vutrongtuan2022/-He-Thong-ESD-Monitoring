import axiosClient from '.';

const areaServices = {
	listArea: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/FactoryArea/page_factory_area`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default areaServices;
