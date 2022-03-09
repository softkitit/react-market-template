import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  OcDropdown,
  OcDropdownButton,
  OcNavigationBreadcrumbs,
} from '@openchannel/react-common-components/dist/ui/common/molecules';
import { FullAppData } from '@openchannel/react-common-components';
import { OcAppShortInfo } from '@openchannel/react-common-components/dist/ui/market/molecules';

import dots from '../../../../../public/assets/img/dots-hr-icon.svg';

import { useTypedSelector } from 'features/common/hooks';
import { MainTemplate } from 'features/common/templates';
import { clearMyApps, fetchMyApps } from 'features/apps/store/apps';

import './styles.scss';

declare type Option = {
  label: string;
  [key: string]: string;
};

export const MyAppsPage: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    myApps: { data: apps, pageNumber, limit, pages, sort },
  } = useTypedSelector(({ apps }) => apps);

  React.useEffect(() => {
    loadApps();

    return () => {
      dispatch(clearMyApps());
    };
  }, []);

  const showOptions = React.useMemo<Option[]>(
    () => [
      {
        label: 'Newest',
        value: 'created',
      },
      {
        label: 'Featured',
        value: 'featured',
      },
      {
        label: 'Publish Date (most recent)',
        value: 'publishDate',
      },
    ],
    [],
  );

  const appOptions = React.useMemo<Option[]>(
    () => [
      {
        label: 'To Do...',
        value: 'todo',
      },
    ],
    [],
  );

  const showOption = React.useMemo(
    () => showOptions.find((o) => o.value === sort) || showOptions[0],
    [showOptions, sort],
  );

  const historyBack = React.useCallback(() => {
    history.goBack();
  }, [history.goBack]);

  const loadApps = (page: number = pageNumber, sortValue?: string) =>
    dispatch(fetchMyApps(page, limit, sortValue || sort || showOptions[0].value));

  const handleShowOptionSelect = (v?: Option) => loadApps(1, v?.value);

  const handleClickByApp = (e: FullAppData) => {
    history.push(`/details/${e.safeName[0]}`);
  };

  const handleAppAction = () => {};

  return (
    <MainTemplate>
      <div className="my-apps">
        <div className="bg-container min-height-auto management">
          <OcNavigationBreadcrumbs pageTitle="My apps" navigateText="Back" navigateClick={historyBack} />
        </div>
        <div className="container">
          <div className="d-flex justify-content-end pt-4 pb-3">
            <OcDropdown title="Show" options={showOptions} selected={showOption} onSelect={handleShowOptionSelect} />
          </div>
          <InfiniteScroll
            dataLength={apps.length}
            next={() => loadApps(pageNumber + 1)}
            hasMore={pageNumber < pages}
            loader={null}
          >
            {apps.map((app) => (
              <div key={app.appId} className="mb-2">
                <OcAppShortInfo
                  app={app}
                  clickByApp={handleClickByApp}
                  customDropdown={
                    <OcDropdownButton options={appOptions} onSelect={handleAppAction}>
                      <button className="btn btn-outline-info menu-button">
                        <img alt="Three dots" src={dots} />
                      </button>
                    </OcDropdownButton>
                  }
                />
              </div>
            ))}
          </InfiniteScroll>
          <div className="mt-8" />
        </div>
      </div>
    </MainTemplate>
  );
};

export default MyAppsPage;
