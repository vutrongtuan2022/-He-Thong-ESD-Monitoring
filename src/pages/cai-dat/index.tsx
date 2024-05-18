import Head from 'next/head'
import React, { Fragment,ReactElement } from 'react'
import MainPageSetting from '~/components/pages/cai-dat/MainPageSetting'
import BaseLayout from '~/components/layouts/BaseLayout'
const Page = () => {
  return (
    <Fragment>
      <Head>
        <title>Cài đặt</title>
        <meta name='description' content='Cài đặt'/>
        <meta name='viewport' content='width=device-width, initial-scale=1'/>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <MainPageSetting/>
    </Fragment>
    
  )
}

export default Page;
Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Quản lý gateway'>{Page}</BaseLayout>;
};
