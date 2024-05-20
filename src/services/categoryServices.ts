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
};

export default categoryServices;
