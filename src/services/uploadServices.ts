import axiosClient from '.';

const uploadServices = {
	upload: (data: any, tokenAxios?: any) => {
		return axiosClient.put('/Upload/upload-image', data, {
			cancelToken: tokenAxios,
			headers: {'Content-Type': 'multipart/form-data'},
		});
	},
};

export default uploadServices;
