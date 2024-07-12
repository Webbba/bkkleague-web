import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Layout } from 'base-components';

export default function Root() {
  const router = useRouter();

  useEffect(() => {
    router.prefetch('/home');
    router.push('/upcoming');
  }, [router]);

  return (
    <>
      <Head>
        <title>Bangkok pool league</title>
      </Head>
      <Layout />
    </>
  );
}
