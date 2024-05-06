import classNames from 'classnames/bind';
import Image from 'next/image';

import HeartIcon from '@/public/icons/heart.svg';
import CommentIcon from '@/public/icons/message-circle-02.svg';
import { Post } from '@/types/Post';

import CategoryBox from '@components/CategoryBox';

import styles from './PostItem.module.scss';

const cx = classNames.bind(styles);

export default function PostItem({ post }: { post: Post }) {
  return (
    <div className={cx('post-container')}>
      <header className={cx('header')}>
        <CategoryBox contentData={post} />
        <span>beloved 태그 보류</span>
      </header>
      <main className={cx('main')}>
        <p className={cx('main-text')}>
          <span className={cx('text', 'black', 'large')}>{post?.title}</span>
          <span className={cx('text', 'black', 'middle')}>{post?.content}</span>
        </p>
        <span className={cx('photo')}>
          <Image fill src={post?.imageUrl[0]} alt='메인 이미지' />
        </span>
      </main>
      <footer className={cx('footer')}>
        <p className={cx('footer-content-gap', 'text', 'gray')}>
          <span>{post?.author?.nickname}</span>
          <span>3시간 전</span>
        </p>
        <p className={cx('footer-content-gap')}>
          <span className={cx('icon-box')}>
            <Image className={cx('icon')} src={HeartIcon} alt='좋아요 아이콘' />
            <span className={cx('text', 'black', 'small')}>{post.likeCount}개</span>
          </span>
          <span className={cx('icon-box')}>
            <Image className={cx('icon')} src={CommentIcon} alt='댓글 아이콘' />
            <span className={cx('text', 'black', 'small')}>{post.commentCount}개</span>
          </span>
        </p>
      </footer>
    </div>
  );
}