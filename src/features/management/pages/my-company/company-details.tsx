import * as React from 'react';
import { useDispatch } from 'react-redux';
import { apps, fileService } from '@openchannel/react-common-services';
import { notify } from '@openchannel/react-common-components/dist/ui/common/atoms';
import { AppFormModel } from '@openchannel/react-common-components/dist/ui/form/models';
import {
  OcSingleForm,
  OcFormFormikHelpers,
  OcFormValues,
} from '@openchannel/react-common-components/dist/ui/form/organisms';

import { useTypedSelector } from 'features/common/hooks';
import { clearUserCompanyForm, getUserCompanyForm, saveUserCompany } from 'features/common/store/user-types/actions';

const mappedFileService = {
  fileUploadRequest: fileService.uploadToOpenChannel,
  fileDetailsRequest: fileService.downloadFileDetails,
};

const CompanyDetails: React.FC = () => {
  const dispatch = useDispatch();
  const { companyForm } = useTypedSelector(({ userTypes }) => userTypes);

  React.useEffect(() => {
    dispatch(getUserCompanyForm());

    return () => {
      dispatch(clearUserCompanyForm());
    };
  }, []);

  const handleSubmit = async (value: OcFormValues, { setErrors, setSubmitting }: OcFormFormikHelpers) => {
    try {
      await dispatch(saveUserCompany(value));
      notify.success('Your company details has been updated');
      // eslint-disable-next-line
    } catch (e: any) {
      if (e.errors != null) {
        setErrors(e.errors);
      }
    }

    setSubmitting(false);
  };

  if (companyForm == null) {
    return null;
  }

  return (
    <OcSingleForm
      fileService={mappedFileService}
      formJsonData={companyForm as AppFormModel}
      onSubmit={handleSubmit}
      service={apps}
      submitButtonText="Save"
      customSubmitClass="custom-width"
    />
  );
};

export default CompanyDetails;
