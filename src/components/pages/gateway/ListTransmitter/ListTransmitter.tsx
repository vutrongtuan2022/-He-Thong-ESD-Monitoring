import React, {useEffect, useState} from 'react';
import Status from '~/components/common/Status';
import {PropsListTransmitter} from './interfaces';
import styles from './ListTransmitter.module.scss';
import Search from '~/components/common/Search';
import FilterCustom from '~/components/common/FilterCustom';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import Pagination from '~/components/common/Pagination';
import {useRouter} from 'next/router';
import {LuCheck} from 'react-icons/lu';
import Button from '~/components/common/Button';
import Image from 'next/image';
import icons from '~/constants/images/icons';

function ListTransmitter({}: PropsListTransmitter) {
	const router = useRouter();

	const {_page, _pageSize, _keyword} = router.query;
	const [data, setData] = useState<any[]>([]);

	useEffect(() => {
		setData([
			{
				id: 1,
				name: 'name 1',
				index: 0,
				isChecked: false,
			},
			{
				id: 2,
				name: 'name 2',
				index: 1,
				isChecked: false,
			},
			{
				id: 3,
				name: 'name 3',
				index: 2,
				isChecked: false,
			},
		]);
	}, []);

	return (
		<div className={styles.container}>
			<h4>Danh sách bộ phát NG (05)</h4>
			<div className={styles.control}>
				<div className={styles.left}>
					{data?.some((x) => x.isChecked !== false) && (
						<div>
							<Button className={styles.btn} rounded_8 w_fit icon={<LuCheck size={20} />}>
								Xác nhận xử lý
							</Button>
						</div>
					)}
					<div style={{minWidth: 360}}>
						<Search placeholder='Tìm kiếm theo tên gateway, ID' />
					</div>
					<div style={{minWidth: 240}}>
						<FilterCustom
							listFilter={[
								{
									id: 1,
									name: ' Bộ phát1',
								},
								{
									id: 2,
									name: ' Bộ phát2',
								},
							]}
							name='Bộ phát'
							query='_electric'
						/>
					</div>
				</div>
				<div>
					<Button
						className={styles.btn}
						rounded_8
						w_fit
						p_4_12
						green
						bold
						icon={<Image alt='icon export' src={icons.export_excel} width={20} height={20} />}
					>
						Export excel
					</Button>
				</div>
			</div>
			<div className={styles.table}>
				<DataWrapper data={[1, 2, 3]} loading={false} noti={<Noti des='Hiện tại chưa có bộ phát nào ?' />}>
					<Table
						data={data}
						onSetData={setData}
						column={[
							{
								checkBox: true,
								title: 'STT',
								render: (data: any, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Mã bộ phát',
								render: (data: any) => <p style={{fontWeight: 600, color: '#4484FF'}}>6478384343</p>,
							},
							{
								title: 'Tên bộ phát',
								render: (data: any) => <p>1234</p>,
							},
							{
								title: 'Team sử dụng',
								render: (data: any) => <p>Team của Dương Minh Nghĩa</p>,
							},
							{
								title: 'Mã team',
								render: (data: any) => <p style={{fontWeight: 600, color: '#4484FF'}}>244123312</p>,
							},
							{
								title: 'Leader team',
								render: (data: any) => <>Dương Minh Nghĩa</>,
							},
							{
								title: 'Tình trạng',
								render: (data: any) => <Status status='Online' />,
							},
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					total={400}
					pageSize={Number(_pageSize) || 20}
					dependencies={[_pageSize, _keyword]}
				/>
			</div>
		</div>
	);
}

export default ListTransmitter;
