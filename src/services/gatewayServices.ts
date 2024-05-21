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
};

export default gatewayServices;
