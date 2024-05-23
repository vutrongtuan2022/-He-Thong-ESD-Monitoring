import {STATUS_GENERAL} from '~/constants/config/enum';
import {IUser} from '../../ListTransmitter/interfaces';

export interface PropsMainPageUpdateStaff {
	dataUpdate?: IUser;
}

export interface IFormUpdate {
	uuid: string;
	userName: string;
	fullname: string;
	teamUuid: string;
	code: string;
	gender: number;
	email: string;
	phone: string;
	address: string;
	birthday: string;
	avatar: string;
	role: string;
	status: STATUS_GENERAL;
}
