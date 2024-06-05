import React, {useState} from 'react';

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
import useDebounce from '~/common/hooks/useDebounce';
import SearchInput from '~/components/common/SearchInput';
import i18n from '~/locale/i18n';

function TableChildArea({}: PropsTableChildArea) {
	const router = useRouter();

	const {_id, _page, _pageSize, _table} = router.query;

	const [keyword, setKeyword] = useState<string>('');

	const keywordDebounce = useDebounce(keyword, 500);

	const listAreaChild = useQuery([QUERY_KEY.danh_sach_khu_vuc_con, _page, keywordDebounce, _id, _pageSize], {
		queryFn: () =>
			httpRequest({
				http: areaServices.getChildArea({
					keyword: keywordDebounce,
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
			<div className={'mb'} style={{maxWidth: '320px'}}>
				<SearchInput placeholder={i18n.t('Common.SearchNameAndID')} keyword={keyword} setKeyword={setKeyword} />
			</div>
			<DataWrapper
				data={listAreaChild?.data?.items}
				loading={listAreaChild.isLoading}
				noti={<Noti title={i18n.t('Area.EmptyAreas')} des={i18n.t('Area.AreaListIsEmpty')} disableButton />}
			>
				<Table
					data={listAreaChild?.data?.items}
					column={[
						{
							title: i18n.t('Common.No'),
							render: (data: IArea, index: number) => <>{index + 1}</>,
						},
						{
							title: i18n.t('Area.AreaCode'),
							render: (data: IArea) => <>{data.code}</>,
						},
						{
							title: i18n.t('Area.AreaName'),
							render: (data: IArea) => (
								<Link href={`/factory-area/${data.uuid}`} className={styles.link}>
									{data.name || '---'}
								</Link>
							),
						},
						{
							title: i18n.t('Common.Address'),
							render: (data: IArea) => <>{data.address || '---'}</>,
						},
						{
							title: i18n.t('Area.NumberOfTeams'),
							render: (data: IArea) => <>{data.totalTeam}</>,
						},
						{
							title: i18n.t('Team.NumberofDevices'),
							render: (data: IArea) => <>{data.totalDevice}</>,
						},
						{
							title: i18n.t('Common.Datecreated'),
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
