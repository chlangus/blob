'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import BlobLogo from '@/public/icons/logo-BLOB.svg';
import GoogleLogo from '@/public/icons/logo-google.svg';
import KakaoLogo from '@/public/icons/logo-kakao.svg';
import NaverLogo from '@/public/icons/logo-naver.svg';
import { getAccessToken, getUserIdFromCookie } from '@apis/axios';
import getRedirectUrl from '@apis/oauth/getRedirectUrl';
import { useDetailQueries } from '@queries/useUserQueries';
import useModalStore, { ModalName } from '@stores/useModalStore';
import { useOAuthStore } from '@stores/useOAuthStore';
import { UserDetail } from 'types/User';

import CreateUser from '@components/Modal/CreateUser/CreateUser';

import SigninButton from './_components/SigninButton';
import styles from './Signin.module.scss';

export default function Signin() {
  const { state } = useOAuthStore();
  const accessToken = getAccessToken();

  const userId = Number(getUserIdFromCookie());
  const { data } = useDetailQueries(userId);
  const [userData, setUserData] = useState<UserDetail | null>(null);

  const { toggleModal, name, setCurrentName } = useModalStore();

  const router = useRouter();

  function handleOpenModal(name: ModalName) {
    setCurrentName(name);
    toggleModal();
  }

  // 소셜 로그인
  async function handleClickSignin(type: string) {
    const { data } = await getRedirectUrl(type);
    const { redirectUrl } = data;

    // 소셜 로그인 페이지로 이동
    router.push(redirectUrl);
  }

  // 회원가입 안 된 유저에게 회원가입 모달을 띄워줌
  useEffect(() => {
    function handleOpenModal(name: ModalName) {
      setCurrentName(name);
      toggleModal();
    }

    if (accessToken && state === 'INCOMPLETE') {
      handleOpenModal('createUser');
    }
  }, [accessToken, state, setCurrentName, toggleModal]);

  useEffect(() => {
    // 회원가입 된 유저는 map으로 리다이렉트

    if (data) {
      setUserData(data?.data);
    }

    // 만약 유저 상태가 state === 'COMPLETE'면 map으로 리다이렉트
    if (accessToken && userData?.state === 'COMPLETE') {
      router.push('/map');
    }
  }, [accessToken, router, data, userData?.state]);

  return (
    <main className={styles.signin}>
      <Image className={styles.logo} src={BlobLogo} alt='Blob 로고' />
      <h1 className={styles.title}>SNS로 간편하게 로그인하기</h1>
      <section className={styles.buttons}>
        <SigninButton providerName='google' iconSource={GoogleLogo} onClick={() => handleClickSignin('google')}>
          구글 로그인
        </SigninButton>
        <SigninButton providerName='kakao' iconSource={KakaoLogo} onClick={() => handleClickSignin('kakao')}>
          카카오 로그인
        </SigninButton>
        <SigninButton providerName='naver' iconSource={NaverLogo} onClick={() => handleClickSignin('naver')}>
          네이버 로그인
        </SigninButton>
      </section>

      <p className={`${styles['title-gray']} ${styles.content}`}>
        <span>아직 BLOB 회원이 아니세요?</span>
        <Link href='/signin'>
          <span className={styles.underline}>회원가입 하기</span>
        </Link>
      </p>

      <button type='button' onClick={() => handleOpenModal('createUser')}>
        회원가입 모달 테스트용
      </button>
      {name === 'createUser' && <CreateUser />}
    </main>
  );
}
