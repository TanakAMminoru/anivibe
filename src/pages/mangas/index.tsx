import { FC } from 'react';

import { useRouter } from 'next/router';

import { Pagination } from '@mui/material';

import { MangaQuery } from '@interfaces/query';

import { ECollection } from '@enums/enums';

import { API_ITEMS_LIMIT, NOT_FOUND_TITLES } from '@constants/common';
import { FILTER_MENU_MATCH_MEDIA, PAGINATION_MATCH_MEDIA } from '@constants/matchMedia';
import { MANGA_FILTERS_PAGE_DESCRIPTION, MANGA_FILTERS_PAGE_KEYWORDS, MANGA_FILTERS_PAGE_TITLE } from '@constants/seo';

import { getFilterDataState, setFilteredData } from '@redux/slices/filteredData';
import { setFilterType, setFilterValuesFromQuery } from '@redux/slices/filters';
import { nextReduxWrapper } from '@redux/store';

import Error from '@ui/Error';

import FilterCardList from '@components/FilterCardList';
import FilterMenu from '@components/FilterMenu';
import SeoHead from '@components/SeoHead';

import MainLayout from '@layouts/MainLayout';

import { getMangas } from '@services/api/manga';

import useAppSelector from '@hooks/useAppSelector';
import useMatchMedia from '@hooks/useMatchMedia';

import entries from '@utils/entries';

import useFilterPageStyles from '@styles/FilterPage.styles';

type MangaPageProps = {
  pagesCount: number;
  page: number;
};

const Mangas: FC<MangaPageProps> = ({ pagesCount, page }) => {
  const classes = useFilterPageStyles();
  const {
    filteredData,
  } = useAppSelector(getFilterDataState);
  const route = useRouter();
  const { query } = route;

  const setPage = (currentPage: number) => {
    if (currentPage > pagesCount) {
      return;
    }
    query.page = `${currentPage}`;
    route.push({ ...route });
  };

  const [isMobileFilterMenu] = useMatchMedia(FILTER_MENU_MATCH_MEDIA);
  const [isMobilePagination] = useMatchMedia(PAGINATION_MATCH_MEDIA);

  const getPagination = (className: string) => <div className={className}>
    <Pagination
      page={page}
      size={isMobilePagination ? 'small' : 'large'}
      shape="rounded"
      count={pagesCount}
      onChange={(_, muiPage) => setPage(muiPage)}
    />
  </div>;

  return (
    <MainLayout full paddings fullHeight>
      <SeoHead
        tabTitle={MANGA_FILTERS_PAGE_TITLE}
        title={MANGA_FILTERS_PAGE_TITLE}
        description={MANGA_FILTERS_PAGE_DESCRIPTION}
        keywords={MANGA_FILTERS_PAGE_KEYWORDS}
      />

      <div className={classes.content}>
        <div className={classes.filterCardListWrapper}>
          {
            !filteredData.length
              ? <Error errorText={NOT_FOUND_TITLES} />
              : <>
                {getPagination(classes.paginationWrapperTop)}
                <FilterCardList filteredList={filteredData} />
              </>
          }

          {getPagination(classes.paginationWrapperBottom)}
        </div>

        <FilterMenu isDesktopOrBelow={isMobileFilterMenu} />
      </div>
    </MainLayout>
  );
};

export const getServerSideProps = nextReduxWrapper
  .getServerSideProps<MangaPageProps>((store) => async (
  { query },
) => {
  const { page = '1', genres } = query as unknown as MangaQuery;
  const { filters: { filterType } } = store.getState();
  const currentPage = Number(page);

  if (filterType === ECollection.anime) {
    store.dispatch(setFilterType(ECollection.manga));
  }

  const mangas = await getMangas({
    order: 'popular', limit: API_ITEMS_LIMIT, page: currentPage, genres,
  });

  const currentCount = mangas?.pageNavParams?.count || 0;
  const pagesCount = Math.ceil(currentCount / API_ITEMS_LIMIT);

  if (mangas && mangas.response?.length) {
    store.dispatch(setFilteredData({ data: mangas.response }));
  }

  entries({ genres }).forEach(([key, value]) => {
    if (value) {
      const itemsFromQuery = value.split(',');
      store.dispatch(setFilterValuesFromQuery({ key, keyItems: itemsFromQuery }));
    }
  });

  return {
    props: { pagesCount, page: currentPage },
  };
});

export default Mangas;