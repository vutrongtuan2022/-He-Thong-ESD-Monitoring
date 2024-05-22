import {STATE_GATEWAY} from '~/constants/config/enum';
import axiosClient from '.';

const gatewayServices = {
	listGateway: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			state: STATE_GATEWAY | null;
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
};

export default gatewayServices;
