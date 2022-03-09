import * as React from 'react';
import { set, merge } from 'lodash';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ChangePasswordRequest } from '@openchannel/react-common-services';
import { notify } from '@openchannel/react-common-components/dist/ui/common/atoms';
import { OcEditUserFormComponent } from '@openchannel/react-common-components/dist/ui/auth/organisms';
import { OcNavigationBreadcrumbs } from '@openchannel/react-common-components/dist/ui/common/molecules';
import {
  OcSingleForm,
  OcFormFormikHelpers,
  OcFormValues,
} from '@openchannel/react-common-components/dist/ui/form/organisms';
import { apps, fileService } from '@openchannel/react-common-services';
import BillingHistory from './billing-history';
import { useTypedSelector } from 'features/common/hooks';
import { MainTemplate } from 'features/common/templates';
import { changePassword } from 'features/common/store/session';
import { loadUserProfileForm, saveUserData, loadTransactionsList } from 'features/common/store/user-types';
import { formConfigsWithoutTypeData, formPassword } from './constants';

import './styles.scss';

const mappedFileService = {
  fileUploadRequest: fileService.uploadToOpenChannel,
  fileDetailsRequest: fileService.downloadFileDetails,
};

const Profile = (): JSX.Element => {
  const [isSelectedPage, setSelectedPage] = React.useState<string>();
  const dispatch = useDispatch();
  const history = useHistory();
  const { configs, account, isLoading } = useTypedSelector(({ userTypes }) => userTypes);

  const onClickPass = React.useCallback((e) => {
    switch (e.target.dataset.link) {
      case 'myProfile':
        history.replace('/my-profile/profile-details');
        break;
      case 'changePassword':
        history.replace('/my-profile/password');
        break;
      case 'billingHistory':
        history.replace('/my-profile/billing-history');
        break;
      default:
        break;
    }
    setSelectedPage(e.target.dataset.link);
  }, []);

  React.useEffect(() => {
    dispatch(loadUserProfileForm(formConfigsWithoutTypeData, false, true));
    dispatch(loadTransactionsList(-1));
  }, []);

  React.useEffect(() => {
    let page = 'myProfile';

    switch (history.location.pathname) {
      case '/my-profile':
      case '/my-profile/profile-details':
        page = 'myProfile';
        break;
      case '/my-profile/password':
        page = 'changePassword';
        break;
      case '/my-profile/billing-history':
        page = 'billingHistory';
        break;
    }
    setSelectedPage(page);
  }, [history.location.pathname]);

  const handleChangePasswordSubmit = async (value: OcFormValues, { resetForm, setErrors }: OcFormFormikHelpers) => {
    try {
      await dispatch(changePassword(value as ChangePasswordRequest));
      resetForm();
      notify.success('Password has been updated');
      // eslint-disable-next-line
    } catch (e: any) {
      if (e.errors != null) {
        setErrors(e.errors);
      }
    }
  };

  const handleMyProfileSubmit = async (value: OcFormValues, { setErrors, setSubmitting }: OcFormFormikHelpers) => {
    try {
      const formData = Object.entries(value).reduce((acc, [k, v]) => {
        if (k === 'info') {
          set(acc, 'type', v.formType);
        } else {
          set(acc, k, v);
        }
        return acc;
      }, {} as OcFormValues);

      merge(account, formData);

      await dispatch(saveUserData(account));

      setSubmitting(false);
      notify.success('Your profile has been updated');
      // eslint-disable-next-line
    } catch (e: any) {
      setSubmitting(false);
      if (e.errors != null) {
        setErrors(e.errors);
      }
    }
  };

  const defaultProfileFormType = React.useMemo(() => {
    if (configs.length > 0) {
      return configs.reduce((acc, config) => {
        // eslint-disable-next-line
        // @ts-ignore
        if (config.account.type === account.type) {
          acc = config.name;
        }

        return acc;
      }, '');
    }
  }, [configs, account]);

  return (
    <MainTemplate>
      <div className="bg-container height-unset management">
        <OcNavigationBreadcrumbs pageTitle="My profile" navigateText="Back" navigateClick={history.goBack} />
      </div>

      <div className="container mb-8">
        <div className="page-navigation row">
          <div className="col-lg-3 col-xxl-2">
            <ul className="list-unstyled">
              <li>
                <span
                  className={`font-m ${isSelectedPage === 'myProfile' ? 'active-link' : ''}`}
                  role="button"
                  tabIndex={0}
                  data-link="myProfile"
                  onClick={onClickPass}
                  onKeyDown={onClickPass}
                >
                  Profile Details
                </span>
              </li>
              <li>
                <span
                  className={`font-m ${isSelectedPage === 'changePassword' ? 'active-link' : ''}`}
                  role="button"
                  tabIndex={0}
                  data-link="changePassword"
                  onClick={onClickPass}
                  onKeyDown={onClickPass}
                >
                  Password
                </span>
              </li>
              <li>
                <span
                  className={`font-m ${isSelectedPage === 'billingHistory' ? 'active-link' : ''}`}
                  role="button"
                  tabIndex={0}
                  data-link="billingHistory"
                  onClick={onClickPass}
                  onKeyDown={onClickPass}
                >
                  Billing History
                </span>
              </li>
            </ul>
          </div>
          {isSelectedPage === 'changePassword' && (
            <div className="col-lg-4 mt-3 mt-lg-1 col-xxl-6">
              <OcSingleForm
                formJsonData={formPassword}
                onSubmit={handleChangePasswordSubmit}
                submitButtonText="Save"
                fileService={mappedFileService}
                service={apps}
                customSubmitClass="full-width"
              />
            </div>
          )}
          {isSelectedPage === 'myProfile' && !isLoading && (
            <div className="col-lg-4 mt-3 mt-lg-1 col-xxl-6">
              <OcEditUserFormComponent
                formConfigs={configs}
                defaultFormType={defaultProfileFormType}
                onSubmit={handleMyProfileSubmit}
                submitButtonText="Save"
                customSubmitClass="full-width"
              />
            </div>
          )}
          {isSelectedPage === 'billingHistory' && !isLoading && (
            <div className="col-md-12 col-lg-5 col-xxl-6 mt-3 mt-lg-1 col-lg-9 col-xxl-10 billing-history">
              <BillingHistory />
            </div>
          )}
        </div>
      </div>
    </MainTemplate>
  );
};

export default Profile;
