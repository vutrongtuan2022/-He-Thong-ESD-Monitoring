import axiosClient from '.';

const deviceServices = {
	upsertDevice: (
		data: {
			keyCert: string;
			time: string;
			uuid: string;
			macNumber: string;
			name: string;
			gatewayUuid: string;
			teamUuid: string;
			status: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Device/page_list_device`, data, {
			cancelToken: tokenAxios,
		});
	},
	listDevice: (
		data: {
			pageSize: number;
			page: number;
			keyword: '';
			status: number;
			onlineState: number;
			ngState: number;
			battery: {
				fromDouble: number;
				toDouble: number;
			};
			edS_Static: {
				fromDouble: number;
				toDouble: number;
			};
			timeLastOnline: {
				fromDate: string;
				toDate: string;
			};
			gatewayUuid: string;
			teamUuid: string;
			factoryAreaUuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Device/page_list_device`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default deviceServices;
