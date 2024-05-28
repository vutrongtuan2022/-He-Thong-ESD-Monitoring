import {TYPE_UPLOAD} from '~/constants/config/enum';
import axiosClient from '.';

const uploadServices = {
	upload: (data: {FileData: any; Type: TYPE_UPLOAD}, tokenAxios?: any) => {
		return axiosClient.put(`/Gateway/import_excel`, data, {
			cancelToken: tokenAxios,
			headers: {
				'Content-Type': 'multipart/form-data',
				Accept: 'text/plain',
			},
		});
	},
};

export default uploadServices;
