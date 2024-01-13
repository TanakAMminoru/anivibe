import { FC } from 'react';

import { SkeletonProps } from '@interfaces/common';

import useCarouselSkeletonStyles from './Carousel.styles';
import CardItemSkeleton from '../CardItem';
import TextSkeleton from '../Text';

const emptyArray = Array(11).fill(0).map((_, index) => index + 1);

const CarouselSkeleton: FC<Omit<SkeletonProps, 'className'>> = ({ skeletonType }) => {
  const classes = useCarouselSkeletonStyles();

  return (
    <section className={classes.carouselSkeletonWrapper}>
      <header className={classes.titleWrapper}>
        <TextSkeleton className={classes.text} width={300} height={20} skeletonType={skeletonType} />

        <TextSkeleton className={classes.arrow} width={30} height={20} skeletonType={skeletonType} />
      </header>

      <ul className={classes.cardList}>
        {
          emptyArray.map(() => <li className={classes.cardListItem}>
            <CardItemSkeleton skeletonType={skeletonType} />
          </li>)
        }
      </ul>
    </section>
  );
};

export default CarouselSkeleton;
