import { FullAppData } from '@openchannel/react-common-components/dist/ui/common/models';
import { Filter } from '@openchannel/react-common-components';
import { AppResponse } from '@openchannel/react-common-services';

import { pageConfig } from '../../../assets/config';
import { isNonEmpty } from '../../common/libs/helpers';
import type { MappedFilter } from '../types';

export const mapFilters = (source: Filter[]): MappedFilter[] => {
  return source
    .filter((f) => isNonEmpty(f.values))
    .flatMap((f) => f.values.map((v) => ({ ...v, valueId: v.id, filterId: f.id })));
};

export const mapAppData = (app: AppResponse) => new FullAppData(app, pageConfig.fieldMappings);
