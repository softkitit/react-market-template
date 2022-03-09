import { combineReducers } from 'redux';

import {
  cmsContentReducer as cmsContent,
  sessionReducer as session,
  oidcReducer as oidc,
  userTypesReducer as userTypes,
  userInvitesReducer as userInvites,
} from './features/common/store';
import { appsReducer as apps } from './features/apps/store';
import { joinReducer as join } from './features/join/store';
import { reviewsReducer as reviews } from './features/reviews/store';

export const rootReducer = combineReducers({
  apps,
  reviews,
  cmsContent,
  oidc,
  session,
  userTypes,
  userInvites,
  join,
});
