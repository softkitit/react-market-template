import * as React from 'react';
import { get } from 'lodash';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Modal } from '@openchannel/react-common-components/dist/ui/common/organisms';
import { notify, OcButtonComponent } from '@openchannel/react-common-components/dist/ui/common/atoms';
import { apps, fileService, statisticService } from '@openchannel/react-common-services';
import { OcSingleForm } from '@openchannel/react-common-components/dist/ui/form/organisms';
import { ButtonAction, DownloadButtonAction, FormButtonAction, OwnershipButtonAction, ViewData } from './types';

import { getForm, installApplication, submitForm, uninstallApplication } from '../../../apps/store/apps/actions';
import { useTypedSelector } from 'features/common/hooks';
import { isUserLoggedIn } from '../header/utils';
import { ReactComponent as CloseIcon } from '../../../../../public/assets/img/close-icon.svg';
import { AppFormModel } from '@openchannel/react-common-components';

import './style.scss';

export interface ActionButtonProps {
  buttonAction: ButtonAction;
}

interface IViewDataSelected {
  actionType: null | string;
  viewData: null | ViewData;
}

const mappedFileService = {
  fileUploadRequest: fileService.uploadToOpenChannel,
  fileDetailsRequest: fileService.downloadFileDetails,
};

export const ActionButton: React.FC<ActionButtonProps> = (props) => {
  const { buttonAction } = props;

  const dispatch = useDispatch();
  const history = useHistory();
  const { selectedApp, currentForm } = useTypedSelector(({ apps }) => apps);
  const [viewData, setViewData] = React.useState<IViewDataSelected>({
    actionType: null,
    viewData: null,
  });
  const [isModalOpened, setIsModalOpened] = React.useState(false);
  const [inProcess, setInProcess] = React.useState(false);

  const onModalClose = React.useCallback(() => {
    setIsModalOpened(false);
  }, []);

  React.useEffect(() => {
    switch (buttonAction.type) {
      case 'form':
        setViewData({ actionType: null, viewData: buttonAction as FormButtonAction });
        break;
      case 'install':
        if (selectedApp?.ownership?.ownershipStatus === 'active') {
          setViewData({ actionType: 'OWNED', viewData: (buttonAction as OwnershipButtonAction)?.owned });
        } else {
          setViewData({ actionType: 'UNOWNED', viewData: (buttonAction as OwnershipButtonAction)?.unowned });
        }
        break;
      case 'download':
        setViewData({
          actionType: null,
          viewData: {
            button: (buttonAction as DownloadButtonAction).button,
            message: null,
          },
        });
        break;
      default:
        notify.error(`Error: invalid button type: ${buttonAction.type}`);
    }
  }, [selectedApp]);

  const handleButtonClick = async () => {
    switch (buttonAction.type) {
      case 'form':
        await processForm(buttonAction as FormButtonAction);
        break;
      case 'install':
        await processOwnership();
        break;
      case 'download':
        downloadFile(buttonAction as DownloadButtonAction);
        break;
      default:
        notify.error(`Error: invalid button type: ${buttonAction.type}`);
    }
  };

  const processForm = async (formAction: FormButtonAction) => {
    setInProcess(true);
    await dispatch(getForm(formAction));
    setInProcess(false);
    setIsModalOpened(true);
  };
  //eslint-disable-next-line
  const onFormSubmit = async (values: any) => {
    if (currentForm !== null) {
      await dispatch(submitForm(selectedApp!.appId, { ...values, formId: currentForm.formId }));
      setIsModalOpened(false);
    }
  };
  const processOwnership = (): void => {
    if (isUserLoggedIn()) {
      switch (viewData.actionType) {
        case 'OWNED':
          uninstallOwnership();
          break;
        case 'UNOWNED':
          installOwnership();
          break;
        default:
          notify.error(`Error: invalid owned button type: ${buttonAction.type}`);
      }
    } else {
      history.replace(`/login?return=${window.location.pathname}`);
    }
  };

  const downloadFile = async (actionConfig: DownloadButtonAction) => {
    const file = get(selectedApp, actionConfig.fileField);
    const regex = new RegExp(/^(http(s)?:)?\/\//gm);
    if (regex.test(file)) {
      window.open(file);
    } else {
      const fileDetails = await fileService.downloadFileDetails(file, {});
      fileService.getFileUrl(fileDetails.data.fileId).then((res) => window.open(res.data.url));

      if (buttonAction.statistic && selectedApp) {
        statisticService.record(buttonAction.statistic, selectedApp.appId, 1);
      }
    }
  };

  const installOwnership = async () => {
    if (selectedApp && selectedApp?.model?.length > 0) {
      try {
        setInProcess(true);
        await dispatch(
          installApplication(
            {
              appId: selectedApp.appId,
              modelId: selectedApp?.model[0].modelId,
            },
            selectedApp.safeName[0],
          ),
        );
        setInProcess(false);
      } catch (error) {
        notify.error(viewData.viewData!.message!.fail);
      }
      notify.success(viewData.viewData!.message!.success);
    } else {
      notify.error('Missed any models for creating ownership.');
    }
  };

  const uninstallOwnership = async () => {
    if (selectedApp && selectedApp.ownership) {
      try {
        setInProcess(true);
        await dispatch(
          uninstallApplication(
            { ownershipId: selectedApp.ownership.ownershipId, appId: selectedApp.appId },
            selectedApp.safeName[0],
          ),
        );
        setInProcess(false);
      } catch (error) {
        notify.error(viewData.viewData!.message!.fail);
      }
      notify.success(viewData.viewData!.message!.success);
    }
  };

  return (
    <div className="action-button">
      <OcButtonComponent
        type="primary"
        customClass={viewData?.viewData?.button.class}
        text={viewData?.viewData?.button.text}
        process={inProcess}
        disabled={inProcess}
        onClick={handleButtonClick}
      />
      <Modal isOpened={isModalOpened} onClose={onModalClose} className="modal-content" size="sm">
        <div className="action-button_modal">
          <div className="action-button_modal__header header">
            <h2 className="action-button_modal__header-heading">{currentForm!.name || ''}</h2>
            <CloseIcon
              aria-label="close button"
              className="action-button_modal__header-close-icon"
              onClick={onModalClose}
            />
          </div>
          <div className="action-button_modal__modal-body">
            <OcSingleForm
              formJsonData={currentForm as AppFormModel}
              onSubmit={onFormSubmit}
              fileService={mappedFileService}
              submitButtonText={viewData?.viewData?.button.text}
              buttonPosition="between"
              service={apps}
              onCancel={onModalClose}
              cancelButtonText="Close"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ActionButton;
