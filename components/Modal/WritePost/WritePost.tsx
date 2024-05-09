import React from 'react'; // 안하면 오류가 나더라구용..

import classNames from 'classnames/bind';
import Image from 'next/image';

import AutoCompleteCity from '@/app/maptest/_deprecated/AutoCompleteCity';
import CloseButton from '@/public/icons/x-close.svg';
import useModalStore from '@stores/useModalStore';

import CategoryFiltering, { Category } from '@components/Category/CategoryFiltering';
import SubCategoryFiltering from '@components/Category/SubCategoryFiltering';
import ImageUploader from '@components/ImageUploader';
import Input from '@components/Input/Input';

import PositionDetail from './PositionDetail';
import styles from './WritePost.module.scss';
import useCreateForm from '../../../app/map/_hooks/useCreateForm';
import BlobButton from '../../Button/BlobButton';

const cx = classNames.bind(styles);

const categories: Category[] = ['추천', '비추천', '질문', '주의', '도움요청'];

const subCategories = ['날씨', '음식점', '숙소', '병원', '화장실', '약국', '교통', '박물관', '관광지', 'ATM'];

export default function WritePost() {
  const { toggleModal } = useModalStore();
  const { register, handleSubmit, onSubmit, cancelForm, setValue } = useCreateForm(toggleModal);

  // 선택된 도시의 정보를 담을 상태 변수
  const [selectedCity, setSelectedCity] = React.useState<{ cityName: string; lat: number; lng: number } | null>(null);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cx('form')}>
      <header className={cx('close-header')}>
        <span>글쓰기</span>
        <span className={cx('close-button')}>
          <Image src={CloseButton} fill alt='닫기' onClick={toggleModal} />
        </span>
      </header>
      <div className={cx('post-body')}>
        <p className={cx('category-title')}>
          카테고리<span className={cx('force')}> * </span>
        </p>
        <div className={cx('category-list')}>
          {categories.map((category) => (
            <CategoryFiltering key={category} category={category} filteringType='feed' />
          ))}
        </div>

        {/* TODO 수정 필요 category별로 나눠야함  */}
        <div className={cx('sub-category-list')}>
          {subCategories.map((subcategory) => (
            <SubCategoryFiltering key={subcategory} category='추천' filteringType='feed' title={subcategory} />
          ))}
        </div>
        <Input labelName='제목' id='title' name='title' placeholder='제목은 필수입니다' maxLength={20} />
        <Input labelName='내용' id='content' name='content' placeholder='내용을 입력하세요' maxLength={20} />
        <p className={cx('city-title')}> 어디에 관한 글인가요? (도시까지)</p>
        <AutoCompleteCity
          onSelectCity={(cityName: string, lat: number, lng: number) => {
            // 선택된 도시 정보를 상태 변수에 저장
            setSelectedCity({ cityName, lat, lng });
          }}
        />
        <PositionDetail />
        <ImageUploader setValue={setValue} />
      </div>
      <div className={cx('post-footer')}>
        <BlobButton text='취소' type='button' color='button-gray-outlined' onClick={cancelForm} />
        <BlobButton text='BLOB' type='submit' color='button-colord-contain' />
      </div>
      {/* 선택된 도시의 정보를 hidden input으로 추가하여 폼 데이터에 포함 */}
      {selectedCity && (
        <>
          {/* <input type='hidden' {...register('cityName')} value={selectedCity.cityName} /> */}
          <input type='hidden' {...register('lat')} value={selectedCity.lat} />
          <input type='hidden' {...register('lng')} value={selectedCity.lng} />
        </>
      )}
    </form>
  );
}
