import axios from 'axios';
import {delay} from '~/common/funcs/delay';
import {getKeyCert} from '~/common/funcs/optionConvert';
import {toastError, toastInfo, toastSuccess, toastWarn} from '~/common/funcs/toast';
import {logout} from '~/redux/reducer/auth';
import {store} from '~/redux/store';

const axiosClient = axios.create({
	headers: {
		'content-type': 'application/json',
	},
	baseURL: process.env.NODE_ENV == 'development' ? process.env.NEXT_PUBLIC_API_URL_DEV : process.env.NEXT_PUBLIC_API_URL_PRODUCTION,
	timeout: 15000,
	timeoutErrorMessage: 'Timeout error request',
});

axiosClient.interceptors.request.use(async (config) => {
	const token = store.getState().auth.token;

	config.headers.Authorization = token ? 'Bearer ' + token : null;

	config.data = {
		...getKeyCert(),
		...config.data,
	};

	return config;
});

axiosClient.interceptors.response.use(
	(response: any) => {
		if (response && response.data) {
			return response.data;
		}

		return response;
	},
	(error: any) => {
		if (error.response && error.response.data) {
			throw error.response.data;
		}

		if (!axios.isCancel(error)) throw error;
	}
);
export default axiosClient;

export const httpRequest = async ({
	isList = false,
	http,
	setLoading,
	msgSuccess = 'Thành công',
	showMessageSuccess = false,
	showMessageFailed = false,
	onError,
}: {
	isList?: boolean;
	http: any;
	setLoading?: (any: any) => void;
	onError?: () => void;
	showMessageSuccess?: boolean;
	showMessageFailed?: boolean;
	msgSuccess?: string;
}) => {
	setLoading && setLoading(() => true);
	try {
		await delay(500);
		const res: any = await http;

		if (res.error.code === 0) {
			showMessageSuccess && msgSuccess && toastSuccess({msg: msgSuccess || res?.error?.message});
			setLoading && setLoading(() => false);
			return isList ? res : res.data || true;
		} else {
			setLoading && setLoading(() => false);
			onError && onError();
			throw res?.error?.message;
		}
	} catch (err: any) {
		if (err?.status === 401) {
			store.dispatch(logout());
		} else if (typeof err == 'string') {
			showMessageFailed && toastWarn({msg: err || 'Có lỗi đã xảy ra!'});
			setLoading && setLoading(() => false);
		} else if (err.code == 'ERR_NETWORK' || err.code == 'ECONNABORTED') {
			showMessageFailed && toastInfo({msg: 'Kiểm tra kết nối internet'});
			setLoading && setLoading(() => false);
		} else {
			showMessageFailed && toastWarn({msg: 'Có lỗi đã xảy ra!'});
			setLoading && setLoading(() => false);
		}
	} finally {
		setLoading && setLoading(() => false);
	}
};
