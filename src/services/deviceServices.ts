import axiosClient from '.';

const deviceServices = {
	upsertDevice: (
		data: {
			uuid: string;
			macNumber: string;
			name: string;
			gatewayUuid: string;
			teamUuid: string;
			status: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Device/upsert_device`, data, {
			cancelToken: tokenAxios,
		});
	},
	updateDeviceStatus: (
		data: {
			uuid: string;
			status: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Device/update_device_status`, data, {
			cancelToken: tokenAxios,
		});
	},
	listDevice: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status?: number | null;
			onlineState: number | null;
			ngState: number | null;
			battery: {
				fromDouble: number;
				toDouble: number;
			};
			edS_Static?: {
				fromDouble: number;
				toDouble: number;
			};
			timeLastOnline?: {
				fromDate: string;
				toDate: string;
			};
			gatewayUuid?: string;
			teamUuid?: string;
			factoryAreaUuid?: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Device/page_list_device`, data, {
			cancelToken: tokenAxios,
		});
	},
	detailDevice: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Device/device_detail`, data, {
			cancelToken: tokenAxios,
		});
	},
	exportExcel: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			status?: number | null;
			onlineState: number | null;
			ngState: number | null;
			battery: {
				fromDouble: number;
				toDouble: number;
			};
			edS_Static?: {
				fromDouble: number;
				toDouble: number;
			};
			timeLastOnline?: {
				fromDate: string;
				toDate: string;
			};
			gatewayUuid?: string;
			teamUuid?: string;
			factoryAreaUuid?: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Device/export_excel`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default deviceServices;
