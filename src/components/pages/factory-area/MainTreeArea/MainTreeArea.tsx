import React from 'react';

import {PropsMainTreeArea} from './interfaces';
import styles from './MainTreeArea.module.scss';
import {useQuery} from '@tanstack/react-query';
import {QUERY_KEY} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import areaServices from '~/services/areaServices';
import DataWrapper from '~/components/common/DataWrapper';
import TreeArea from '../TreeArea';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Popup from '~/components/common/Popup';
import MainUpdateArea from '../MainUpdateArea';
import {useRouter} from 'next/router';
import {PATH} from '~/constants/config';
import i18n from '~/locale/i18n';

function MainTreeArea({}: PropsMainTreeArea) {
	const router = useRouter();

	const {_open} = router.query;

	const listTreeAreas = useQuery([QUERY_KEY.danh_sach_tree_khu_vuc], {
		queryFn: () =>
			httpRequest({
				http: areaServices.getTreeArea({
					uuid: null,
				}),
			}),
		select(data) {
			return data;
		},
	});

	return (
		<div className={styles.container}>
			<DataWrapper
				data={listTreeAreas?.data}
				loading={listTreeAreas.isLoading}
				noti={<Noti disableButton title={i18n.t('Area.EmptyAreas')} des={i18n.t('Area.AreaListIsEmpty')} />}
			>
				{listTreeAreas?.data?.map((v: any) => (
					<TreeArea key={v?.uuid} area={v} level={0} />
				))}
			</DataWrapper>

			{/* POPUP */}
			<Popup
				open={_open == 'update'}
				onClose={() => {
					const {_open, _uuid, ...rest} = router.query;

					router.replace(
						{
							pathname: router.pathname,
							query: {
								...rest,
							},
						},
						undefined,
						{
							scroll: false,
							shallow: false,
						}
					);
				}}
			>
				<MainUpdateArea
					onClose={() => {
						const {_open, _uuid, ...rest} = router.query;

						router.replace(
							{
								pathname: router.pathname,
								query: {
									...rest,
								},
							},
							undefined,
							{
								scroll: false,
								shallow: false,
							}
						);
					}}
				/>
			</Popup>
		</div>
	);
}

export default MainTreeArea;
