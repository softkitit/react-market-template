import * as React from 'react';
import { get } from 'lodash';
import { OcAppTable } from '@openchannel/react-common-components/dist/ui/portal/organisms';
import { AppListing, activeColumns } from './constants';
import './styles.scss';
import { useTypedSelector } from 'features/common/hooks';
import { loadTransactionsList } from 'features/common/store/user-types';
import { useDispatch } from 'react-redux';
import { AppListMenuAction } from '@openchannel/react-common-components/dist/ui/portal/models';
import { appsTransaction } from './types';

const nameHeaderCell = () => <span className="app-name ml-2">App name</span>;
const nameRowCell = (app: appsTransaction) => {
  return (
    <div className="app-grid-table__row__cell-name-content ml-2">
      <img
        className="app-grid-table__row__cell-name-content-icon"
        src={get(app, 'customData.icon', '/assets/img/app-icon.svg')}
        alt={app.name}
      />
      <div className="app-grid-table__row__cell-name-content-text">
        <span className="app-grid-table__row__cell-name-content-text-title">{app.name}</span>
      </div>
    </div>
  );
};

const dateHeaderCell = (accessing: boolean, handleSortDate: () => void) => {
  return (
    <div onMouseDown={handleSortDate} role="button" tabIndex={0}>
      <span className="app-date pr-1">Date</span>
      <img
        src={'/assets/img/dropdown-down.svg'}
        className={accessing ? 'oc-table__icon-up' : 'oc-table__icon-down'}
        alt="Sort by"
      />
    </div>
  );
};
const dateRowCell = (app: appsTransaction) => <span className="date-row">{app.date}</span>;

const amountHeaderCell = () => <span className="app-amount">Amount</span>;
const amountnRowCell = (app: appsTransaction) => <span className="amount-row">{app.amount}</span>;

const statusHeaderCell = () => <span className="app-amount">Status</span>;
const statusRowCell = (app: appsTransaction) => <span className="status-row">{app.status}</span>;

const BillingHistory = (): JSX.Element => {
  const { transactionList } = useTypedSelector(({ userTypes }) => userTypes);
  const [appListData, setAppListData] = React.useState(AppListing);
  const [accessing, setAccessing] = React.useState(true);
  const dispatch = useDispatch();

  const handleSortDate = () => {
    setAccessing(!accessing);
    dispatch(loadTransactionsList(accessing ? 1 : -1));
  };

  const modifyColumns = {
    'app-name': { headerCell: nameHeaderCell, rowCell: nameRowCell },
    date: { headerCell: () => dateHeaderCell(accessing, handleSortDate), rowCell: dateRowCell },
    amount: { headerCell: amountHeaderCell, rowCell: amountnRowCell },
    'app-status': { headerCell: statusHeaderCell, rowCell: statusRowCell },
  };

  React.useEffect(() => {
    setAppListData({ ...AppListing, data: { ...AppListing.data, list: transactionList } });
  }, [transactionList]);

  const handleManageApps = (appsData: AppListMenuAction) => {
    const filteredApp: appsTransaction[] = appListData?.data?.list.filter(
      (app: appsTransaction) => app.appId === appsData.appId,
    );

    if (filteredApp && filteredApp.length > 0) {
      switch (appsData.action) {
        case 'View receipt': {
          window.open(filteredApp[0].viewUrl, '_blank');
          break;
        }
        case 'Download invoice': {
          window.open(filteredApp[0].downloadUrl, '_blank');
          break;
        }
      }
    }
  };

  return (
    appListData && (
      <OcAppTable
        properties={appListData}
        noAppMessage={'No apps in your list'}
        activeColumns={activeColumns}
        // eslint-disable-next-line
        modifyColumns={modifyColumns as any}
        onMenuClick={handleManageApps}
      />
    )
  );
};

export default BillingHistory;
