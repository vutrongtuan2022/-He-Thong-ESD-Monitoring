import axiosClient from '.';

const categoryServices = {
	listArea: (
		data: {
			keyword: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Category/category_area`, data, {
			cancelToken: tokenAxios,
		});
	},
	listUser: (
		data: {
			keyword: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Category/category_user`, data, {
			cancelToken: tokenAxios,
		});
	},
	listTeam: (
		data: {
			keyword: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Category/category_team`, data, {
			cancelToken: tokenAxios,
		});
	},
	listGateway: (
		data: {
			keyword: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Category/category_gateway`, data, {
			cancelToken: tokenAxios,
		});
	},
	listRole: (
		data: {
			keyword: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Category/category_role`, data, {
			cancelToken: tokenAxios,
		});
	},
	listRegency: (
		data: {
			keyword: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Category/category_regency`, data, {
			cancelToken: tokenAxios,
		});
	},
	listDevice: (
		data: {
			keyword: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Category/category_device`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default categoryServices;
