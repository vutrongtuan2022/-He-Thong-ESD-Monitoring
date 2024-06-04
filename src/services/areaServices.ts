import axiosClient from '.';

const areaServices = {
	listArea: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			parentUuid: string | null;
			status: number | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/FactoryArea/page_factory_area`, data, {
			cancelToken: tokenAxios,
		});
	},
	upsertArea: (
		data: {
			uuid: string;
			rootUuid: string | null;
			parentUuid: string | null;
			code: string;
			name: string;
			address: string | null;
			notes: string;
			status: number | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/FactoryArea/upsert_factory_area`, data, {
			cancelToken: tokenAxios,
		});
	},
	changeStatusArea: (
		data: {
			uuid: string;
			status: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/FactoryArea/update_area_status`, data, {
			cancelToken: tokenAxios,
		});
	},
	getSumArea: (data: {}, tokenAxios?: any) => {
		return axiosClient.post(`/FactoryArea/get_sum_factory`, data, {
			cancelToken: tokenAxios,
		});
	},
	getDetail: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/FactoryArea/factory_area_detail`, data, {
			cancelToken: tokenAxios,
		});
	},
	getTreeArea: (
		data: {
			uuid: string | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/FactoryArea/list_factory_tree`, data, {
			cancelToken: tokenAxios,
		});
	},
	getChildArea: (
		data: {
			pageSize: number;
			page: number;
			uuid: string;
			keyword: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/FactoryArea/page_list_child_area`, data, {
			cancelToken: tokenAxios,
		});
	},
	exportExcel: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			parentUuid: string | null;
			status: number | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/FactoryArea/export_excel`, data, {
			cancelToken: tokenAxios,
		});
	},
	importExcel: (data: {FileData: any; Type: any}, tokenAxios?: any) => {
		return axiosClient.put(`/FactoryArea/import_excel`, data, {
			cancelToken: tokenAxios,
			headers: {
				'Content-Type': 'multipart/form-data',
				Accept: 'text/plain',
			},
		});
	},
};

export default areaServices;
