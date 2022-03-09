import { Action, UserTypes } from './types';
import { ActionTypes } from './action-types';
import { Transaction } from '@openchannel/react-common-services';
import { AppVersion } from '@openchannel/react-common-components';

const initialState = {
  configs: [],
  account: {},
  companyForm: null,
  isLoading: false,
  transactionList: [],
};

export const userTypesReducer = (state: UserTypes = initialState, action: Action): UserTypes => {
  switch (action.type) {
    case ActionTypes.GET_USER_CONFIG: {
      return {
        ...state,
        configs: action.payload.configs,
      };
    }

    case ActionTypes.GET_USER_ACCOUNT: {
      return {
        ...state,
        account: action.payload.account,
      };
    }

    case ActionTypes.GET_USER_COMPANY_FORM: {
      return {
        ...state,
        companyForm: action.payload.companyForm,
      };
    }

    case ActionTypes.RESET_USER_COMPANY_FORM: {
      return {
        ...state,
        companyForm: null,
      };
    }

    case ActionTypes.GET_TRANSACTIONS_LIST: {
      const appsList = action.payload?.transactionList?.map((item: Transaction) => {
        const date = new Date(item.date);
        const featuredApp = action.payload.appData.list.filter((app: AppVersion) => app.appId === item.appId);

        return {
          amount: `$${item.amount / 100}`,
          date: date.toLocaleDateString(),
          status: item.type === 'refund' ? 'Refunded' : 'Successful',
          name: featuredApp[0].name,
          viewUrl: item.recieptUrl,
          downloadUrl: item.invoiceUrl,
          appId: item.appId,
          customData: featuredApp[0].customData,
        };
      });

      return {
        ...state,
        transactionList: appsList,
      };
    }

    case ActionTypes.START_LOADING: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case ActionTypes.FINISH_LOADING: {
      return {
        ...state,
        isLoading: false,
      };
    }

    default:
      return state;
  }
};
