import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { debounce } from 'lodash';

import { MainTemplate } from 'features/common/templates';
import { Sidebar } from 'features/common/components/index';
import { useMedia, useTypedSelector } from 'features/common/hooks';
import CollapseWithTitle from '../../components/collapse-with-title';
import {
  fetchFilters,
  clearSelectedFilters,
  setSearchPayload,
  fetchFilteredApps,
  clearFilteredApps,
} from '../../../apps/store/apps/actions';

import { OcAppListGrid } from '@openchannel/react-common-components/dist/ui/market/organisms';
import { OcNavigationBreadcrumbs } from '@openchannel/react-common-components/dist/ui/common/molecules';
import { OcTextSearchComponent } from '@openchannel/react-common-components/dist/ui/common/atoms';
import { QueryUtil } from '@openchannel/react-common-services';
import { SelectedFilter, SelectedFilters } from 'features/apps/store/apps/types';
import defaultAppIcon from '../../../../../public/assets/img/default-app-icon.svg';
import { getSearchParams } from '../../libs/helpers';

import './style.scss';

const BROWSE = 'browse';
const COLLECTIONS = 'collections';

export const SearchPage: React.FC = () => {
  const { searchStr } = useTypedSelector(({ apps }) => apps.selectedFilters);
  const history = useHistory();
  const isMobile = useMedia();
  const dispatch = useDispatch();
  const [collapsed, changeCollapseStatus] = React.useState(false);
  const [searchText, setSearchText] = React.useState(searchStr);
  const { filters, selectedFilters, filteredApps } = useTypedSelector(({ apps }) => apps);

  // read values from URL
  React.useEffect(() => {
    if (!filters || !filters.length) {
      dispatch(fetchFilters());
      return;
    }

    const { pathname: path, search } = history.location;
    const parsedSearch = getSearchParams(search);
    const [id, parentId] = path.split('/').filter((p) => p !== BROWSE && !!p);
    const searchPayload: Partial<SelectedFilters> = { filters: [], searchStr: '' };

    if (id) {
      const selectedFilter = filters
        .filter((f) => f.id === id)
        .flatMap((f) => f.values)
        .filter((v) => v.id === parentId);

      if (selectedFilter && selectedFilter[0]) {
        searchPayload.filters = [{ id, parent: selectedFilter[0] }];
      }
    } else if (search.length > 0) {
      const query = Object.entries(parsedSearch).reduce((obj: { [key: string]: string[] }, [key, value]) => {
        obj[key] = !value ? [] : Array.isArray(value) ? value : value.split(',');

        return obj;
      }, {} as { [key: string]: string[] });

      searchPayload.filters = Object.entries(query).flatMap(([key, value]) =>
        filters
          .filter((f) => f.id === key)
          .flatMap((f) => f.values)
          .filter((v) => value.includes(v.id!))
          .map((v) => ({ id: key, parent: v })),
      );
    }

    searchPayload.searchStr = parsedSearch.search as string;
    dispatch(setSearchPayload(searchPayload));
  }, [history, filters, dispatch]);

  const buildQuery = ({ filters, searchStr }: SelectedFilters) => {
    if (!filters.length) {
      if (searchStr.length) {
        history.replace(`/${BROWSE}?search=${searchStr}`);
      } else {
        history.replace(`/${BROWSE}`);
      }
    } else if (filters.length === 1) {
      if (searchStr.length) {
        history.replace(`/${BROWSE}/${filters[0].id}/${filters[0].parent.id}?search=${searchStr}`);
      } else {
        history.replace(`/${BROWSE}/${filters[0].id}/${filters[0].parent.id}`);
      }
    } else {
      const query = filters.reduce((acc: { [key: string]: string }, val: SelectedFilter) => {
        if (val.parent.id) {
          if (val.id === COLLECTIONS) {
            acc[val.id] = val.parent.id;
          } else {
            acc[val.id] = !acc[val.id] ? val.parent.id : `${acc[val.id]},${val.parent.id}`;
          }
        }
        return acc;
      }, {} as { [key: string]: string });

      if (searchStr.length > 0) {
        query.search = searchStr;
      }

      const finalQuery = Object.entries(query)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

      history.replace(`/${BROWSE}/${finalQuery}`);
    }
  };

  const historyBack = React.useCallback(() => {
    history.goBack();
  }, [history]);

  const handleTagClick = (title: string, id?: string) => {
    const newClearedFilters = id
      ? selectedFilters.filters.filter((filter) => filter.parent.id !== id)
      : selectedFilters.filters.filter((filter) => filter.parent.label !== title);
    dispatch(setSearchPayload({ filters: newClearedFilters }));
    buildQuery({ filters: newClearedFilters, searchStr: searchText });
  };

  const handleDeleteAll = () => {
    setSearchText('');
    dispatch(setSearchPayload({ filters: [], searchStr: '' }));
    buildQuery({ filters: [], searchStr: '' });
  };

  React.useEffect(() => {
    const queryFromSelectedFilters = QueryUtil.getAndQuery(
      selectedFilters.filters.map((filter) => filter.parent.query || '').filter(Boolean),
    );
    dispatch(fetchFilteredApps(selectedFilters.searchStr, ['name'], queryFromSelectedFilters));
    window.scrollTo(0, 0);
  }, [selectedFilters]);

  const handleTagDelete = () => {
    setSearchText('');
    dispatch(setSearchPayload({ searchStr: '' }));
    buildQuery({ filters: selectedFilters.filters, searchStr: '' });
  };

  const search = debounce((searchStr: string) => {
    dispatch(setSearchPayload({ searchStr }));
  }, 300);

  const handleSearchTextEnter = React.useCallback(() => {
    search(searchText);
    buildQuery({ filters: selectedFilters.filters, searchStr: searchText });
  }, [searchText, selectedFilters.filters]);

  const handleFilterClick = React.useCallback(
    (selectedFilter: SelectedFilter) => {
      const newFilters = selectedFilters.filters.filter(
        (i) => i.parent.id !== selectedFilter.parent.id || i.child?.id !== selectedFilter.child?.id,
      );
      const isCollections = selectedFilter.id === COLLECTIONS;

      const searchPayload =
        newFilters.length !== selectedFilters.filters.length
          ? { filters: isCollections ? [] : newFilters }
          : { filters: isCollections ? [selectedFilter] : [...selectedFilters.filters, selectedFilter] };

      dispatch(setSearchPayload(searchPayload));
      buildQuery({ ...searchPayload, searchStr: selectedFilters.searchStr });
    },

    [selectedFilters, dispatch, setSearchPayload, buildQuery],
  );

  React.useEffect(() => {
    return () => {
      dispatch(clearSelectedFilters());
      dispatch(clearFilteredApps());
    };
  }, []);

  return (
    <MainTemplate>
      <div className="container">
        <div className="navigation-container d-flex flex-row">
          <OcNavigationBreadcrumbs pageTitle="" navigateText="Back" navigateClick={historyBack} />
        </div>
        <div className="filter-open-close">
          {isMobile && (
            <CollapseWithTitle
              titleForClose="Close filter options"
              titleForOpen="Open filter options"
              collapsed={collapsed}
              changeCollapseStatus={changeCollapseStatus}
            />
          )}
        </div>
        <div className="filter-container row">
          {!collapsed && (
            <div className="col-md-3">
              <Sidebar items={filters} selectedItems={selectedFilters.filters} onItemClick={handleFilterClick} />
            </div>
          )}
          <div className="col-md-9">
            <OcTextSearchComponent
              hasMagnifier={true}
              placeholder="Search"
              value={searchText}
              onChange={setSearchText}
              enterAction={handleSearchTextEnter}
              searchButtonText=""
              clearButtonText=""
              selectedFilters={selectedFilters}
              handleDeleteAll={handleDeleteAll}
              handleTagDelete={handleTagDelete}
              handleTagClick={handleTagClick}
              clearAllText="Clear All"
            />
            <OcAppListGrid
              appList={filteredApps}
              defaultAppIcon={defaultAppIcon}
              baseLinkForOneApp="/details"
              appNavigationParam="safeName[0]"
            />
            {filteredApps.length === 0 && (
              <div className="search__no-results">
                {searchStr.length > 0 ? `There are no apps found for: ${searchStr}` : 'No results found'}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainTemplate>
  );
};

export default SearchPage;
