export interface PropsTableInfor {}

export interface IDetailGateway {
	uuid: string;
	code: string;
	name: string;
	factoryAreaUuid: string | null;
	connection: number;
	state: number;
	ipConnect: string;
	notes: string;
	timeCreated: string;
	timeLastOnline: string | null;
	status: number;
	factoryName: string | null;
}
