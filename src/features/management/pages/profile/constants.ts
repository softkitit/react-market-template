import { OcEditUserFormConfig } from '@openchannel/react-common-components/dist/ui/auth/organisms';

export const formPassword = {
  formId: 'password-form',
  fields: [
    {
      id: 'password',
      label: 'Current Password',
      type: 'password',
      attributes: [],
      defaultValue: '',
    },
    {
      id: 'newPassword',
      label: 'New Password',
      type: 'password',
      attributes: [],
      defaultValue: '',
    },
  ],
};

export const formConfigsWithoutTypeData: OcEditUserFormConfig[] = [
  {
    name: 'Custom',
    account: {
      type: 'custom-account-type',
      typeData: {
        fields: [],
      },
      includeFields: ['name', 'username', 'email', 'customData.about-me'],
    },
    organization: {
      type: '',
      typeData: {
        fields: [],
      },
      includeFields: [],
    },
  },
  {
    name: 'Default',
    account: {
      type: 'default',
      typeData: {
        fields: [],
      },
      includeFields: ['name', 'email'],
    },
    organization: {
      type: '',
      typeData: {
        fields: [],
      },
      includeFields: [],
    },
  },
];

export const AppListing = {
  layout: 'table',
  data: {
    pages: 1,
    pageNumber: 1,
    list: [],
    count: 1,
  },
  options: ['View receipt', 'Download invoice'],
};

export const activeColumns = ['app-name', 'date', 'amount', 'app-status', 'app-options'];
