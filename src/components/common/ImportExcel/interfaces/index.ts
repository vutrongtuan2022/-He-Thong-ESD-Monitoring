export interface PropsImportExcel {
	name: string;
	file: any;
	pathTemplate: string;
	setFile: (any: any) => void;
	onClose: () => void;
	onSubmit: () => void;
}
