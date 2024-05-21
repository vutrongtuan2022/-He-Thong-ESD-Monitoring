import axiosClient from '.';

const ngHistoryServices = {
	listNGhistory: (
		data: {
			pageSize: number;
			page: number;
			keyword: string;
			teamUuid: string;
			deviceUuid: string;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/NGHistory/page_list_nghistory`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default ngHistoryServices;
