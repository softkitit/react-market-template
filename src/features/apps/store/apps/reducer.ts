import { ActionTypes } from './action-types';
import { Action, Apps } from './types';

const initialState = {
  isLoading: false,
  isLoaded: false,
  galleries: [],
  featured: [],
  myApps: {
    data: [],
    pageNumber: 1,
    limit: 5,
    pages: 0,
  },
  filters: [],
  selectedFilters: {
    filters: [],
    searchStr: '',
  },
  categoryLinks: {},
  filteredApps: [],
  selectedApp: null,
  appByVersion: null,
  recommendedApps: null,
  currentForm: {
    formId: '',
    name: '',
    createdDate: 0,
    fields: [],
  },
};

export const appsReducer = (state: Apps = initialState, action: Action): Apps => {
  switch (action.type) {
    case ActionTypes.START_LOADING: {
      return {
        ...state,
        isLoaded: false,
        isLoading: true,
      };
    }

    case ActionTypes.FINISH_LOADING: {
      return {
        ...state,
        isLoaded: true,
        isLoading: false,
      };
    }

    case ActionTypes.SET_GALLERIES: {
      return {
        ...state,
        galleries: action.payload,
      };
    }

    case ActionTypes.SET_CURRENT_FORM: {
      return {
        ...state,
        currentForm: action.payload,
      };
    }

    case ActionTypes.UPDATE_MY_APPS: {
      const newState = { ...state, myApps: { ...state.myApps, ...action.payload } };

      if (action.payload.pageNumber > state.myApps.pageNumber) {
        newState.myApps.data = [...state.myApps.data, ...action.payload.data];
      } else if (action.payload.data != null) {
        newState.myApps.data = [...action.payload.data];
      }

      return newState;
    }

    case ActionTypes.RESET_MY_APPS: {
      return { ...state, myApps: initialState.myApps };
    }

    case ActionTypes.SET_FILTERS: {
      return {
        ...state,
        filters: action.payload,
      };
    }

    case ActionTypes.SET_CATEGORY_LINK: {
      const listCategories = action.payload.find((filterValue) => filterValue.id === 'categories');
      const categoryLinks: { [key: string]: string } = {};

      listCategories?.values.forEach((category) => {
        categoryLinks[category.label] = `/browse/categories/${category.id}`;
      });

      return {
        ...state,
        categoryLinks,
      };
    }

    case ActionTypes.SET_SELECTED_FILTERS: {
      return {
        ...state,
        selectedFilters: action.payload,
      };
    }

    case ActionTypes.RESET_SELECTED_FILTERS: {
      return {
        ...state,
        selectedFilters: initialState.selectedFilters,
      };
    }

    case ActionTypes.SET_FILTERED_APPS: {
      return {
        ...state,
        filteredApps: action.payload,
      };
    }

    case ActionTypes.SET_SELECTED_APP: {
      return {
        ...state,
        selectedApp: action.payload,
      };
    }

    case ActionTypes.SET_APP_BY_VERSION: {
      return {
        ...state,
        appByVersion: action.payload,
      };
    }

    case ActionTypes.SET_RECOMMENDED_APPS: {
      return {
        ...state,
        recommendedApps: action.payload,
      };
    }

    case ActionTypes.SET_FEATURED: {
      return {
        ...state,
        featured: action.payload,
      };
    }

    default:
      return state;
  }
};
