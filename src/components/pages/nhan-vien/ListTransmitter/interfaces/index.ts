import {STATUS_USER} from '~/constants/config/enum';

export interface PropsListTransmitter {}

export interface IUser {
	uuid: string | null;
	userName: string | null;
	fullname: string | null;
	teamUuid: string | null;
	teamname: string | null;
	gender: string | null;
	email: string | null;
	phone: number;
	status: STATUS_USER | null;
	address: string | null;
	birthday: string | null;
	avatar: string | null;
	role: string | null;
	timeCreated: string | null;
	userid: string | null;
	nameleader: string | null;
}

export interface IPage {
	totalCount: number;
	totalPage: number;
}
