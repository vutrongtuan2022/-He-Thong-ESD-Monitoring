import {GENDER} from '~/constants/config/enum';

export interface PropsMainCreateUser {}

export interface IForm {
	code: string;
	fullname: string;
	email: string;
	phone: string;
	roleId: string;
	birthday: string;
	gender: GENDER;
	teamUuid: string;
	address: string;
}
