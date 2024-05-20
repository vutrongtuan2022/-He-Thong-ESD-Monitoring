import axiosClient from '.';

import {GENDER, STATUS_GENERAL} from '~/constants/config/enum';

const userServices = {
	upsertUser: (
		data: {
			uuid: string | null;
			userName: string;
			fullname: string;
			teamUuid: string;
			gender: GENDER;
			email: string;
			phone: string;
			address: string;
			birthday: string;
			avatar: string;
			role: string;
			status: STATUS_GENERAL;
		},
		tokenAxios?: any
	) => {
		return axiosClient.post(`/User/upsert_user`, data, {
			cancelToken: tokenAxios,
		});
	},
};

export default userServices;
