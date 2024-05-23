import {STATUS_GENERAL} from '~/constants/config/enum';

export interface PropsMainCreateUser {}

export interface IForm {
	userName: string;
	fullname: string;
	teamUuid: string;
	code: string;
	gender: number;
	email: string;
	phone: string;
	address: string;
	birthday: string;
	avatar: string | null;
	role: string;
	status: STATUS_GENERAL | null;
}
