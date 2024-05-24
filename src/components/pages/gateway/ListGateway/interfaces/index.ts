export interface PropsListGateway {
	onOpenCreate: () => void;
}

export interface IGateway {
	uuid: string;
	code: string;
	name: string;
	factoryAreaUuid: string;
	connection: number;
	state: number;
	ipConnect: string;
	notes: string;
	timeCreated: string;
	timeLastOnline: string;
	status: number;
	factoryName: string;
	totalDevice: number;
}
