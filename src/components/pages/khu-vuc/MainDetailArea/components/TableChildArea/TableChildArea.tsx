import React from 'react';

import {PropsTableChildArea} from './interfaces';
import DataWrapper from '~/components/common/DataWrapper';
import {useRouter} from 'next/router';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';

import styles from './TableChildArea.module.scss';
import {httpRequest} from '~/services';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Pagination from '~/components/common/Pagination';
import Table from '~/components/common/Table';
import Link from 'next/link';
import areaServices from '~/services/areaServices';
import {IArea} from '../../../TableArea/interfaces';
import Moment from 'react-moment';

function TableChildArea({}: PropsTableChildArea) {
	const router = useRouter();

	const {_id, _page, _pageSize, _table} = router.query;

	const listAreaChild = useQuery([QUERY_KEY.danh_sach_khu_vuc_con, _page, _id, _pageSize], {
		queryFn: () =>
			httpRequest({
				http: areaServices.getChildArea({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					uuid: _id as string,
				}),
			}),
		select(data) {
			return data;
		},
		enabled: !!_id,
	});

	return (
		<div>
			<DataWrapper
				data={listAreaChild?.data?.items}
				loading={listAreaChild.isLoading}
				noti={<Noti title='Khu vực trống' des='Danh sách khu vực trống!' disableButton />}
			>
				<Table
					data={listAreaChild?.data?.items}
					column={[
						{
							title: 'STT',
							render: (data: IArea, index: number) => <>{index + 1}</>,
						},
						{
							title: 'Mã khu vực',
							render: (data: IArea) => <>{data.code}</>,
						},
						{
							title: 'Tên khu vực',
							render: (data: IArea) => (
								<Link href={`/khu-vuc/${data.uuid}`} className={styles.link}>
									{data.name || '---'}
								</Link>
							),
						},
						{
							title: 'Địa chỉ',
							render: (data: IArea) => <>{data.address || '---'}</>,
						},
						{
							title: 'Số team',
							render: (data: IArea) => <>{data.totalTeam}</>,
						},
						{
							title: 'Số thiết bị',
							render: (data: IArea) => <>{data.totalDevice}</>,
						},
						{
							title: 'Ngày tạo',
							render: (data: IArea) => <Moment date={data?.timeCreated} format='HH:mm, DD/MM/YYYY' />,
						},
					]}
				/>
				<Pagination
					currentPage={Number(_page) || 1}
					pageSize={Number(_pageSize) || 20}
					total={listAreaChild?.data?.pagination?.totalCount}
					dependencies={[_id, _pageSize, _table]}
				/>
			</DataWrapper>
		</div>
	);
}

export default TableChildArea;
