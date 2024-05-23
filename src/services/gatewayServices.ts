import {STATE_GATEWAY, STATUS_GENERAL} from '~/constants/config/enum';
import axiosClient from '.';

const gatewayServices = {
	listGateway: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			state: STATE_GATEWAY | null;
			status: STATUS_GENERAL | null;
			factoryAreaUuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Gateway/page_list_gateway`, data, {
			cancelToken: tokenAxios,
		});
	},
	upsertGateway: (
		data: {
			uuid: string;
			code: string;
			name: string;
			notes: string;
			status: number;
			factoryAreaUuid?: string | null;
			connection?: number | null;
			state?: number | null;
			ipConnect?: string | null;
			timeLastOnline?: string | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Gateway/upsert_gateway`, data, {
			cancelToken: tokenAxios,
		});
	},
	updateStatusGateway: (
		data: {
			uuid: string;
			status: number;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Gateway/update_gateway_status`, data, {
			cancelToken: tokenAxios,
		});
	},
	exportExcel: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			state: STATE_GATEWAY | null;
			status: STATUS_GENERAL | null;
			factoryAreaUuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Gateway/export_excel`, data, {
			cancelToken: tokenAxios,
		});
	},
	importExcel: (data: {FileData: any; Type: any}, tokenAxios?: any) => {
		return axiosClient.put(`/Gateway/import_excel`, data, {
			cancelToken: tokenAxios,
			headers: {
				'Content-Type': 'multipart/form-data',
				Accept: 'text/plain',
			},
		});
	},
	detailGateway: (
		data: {
			uuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Gateway/gateway_detail`, data, {
			cancelToken: tokenAxios,
		});
	},
	exportGatewayDevicecExcel: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			uuid: string | null;
			status: number | null;
			gatewayUuid: string;
			teamUuid: string | null;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/Gateway/export_gateway_device_excel`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default gatewayServices;
