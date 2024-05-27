import {GENDER} from '~/constants/config/enum';

export interface PropsMainCreateUser {}

export interface IForm {
	code: string;
	fullname: string;
	email: string;
	phone: string;
	regencyUuid: string;
	birthday: string;
	gender: GENDER;
	teamUuid: string;
	address: string;
}
