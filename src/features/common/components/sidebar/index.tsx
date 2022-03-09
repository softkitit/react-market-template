import * as React from 'react';
import { OcSidebar, SidebarItem } from '@openchannel/react-common-components/dist/ui/common/molecules';
import { SelectedFilter } from '../../../apps/store/apps/types';
import { Filter } from '@openchannel/react-common-components/dist/ui/common/models';

interface SidebarProps {
  items: Filter[];
  onItemClick: (item: SelectedFilter) => void;
  selectedItems?: SelectedFilter[];
}

export const Sidebar: React.FC<SidebarProps> = (props: SidebarProps) => {
  const { items, selectedItems, onItemClick } = props;

  const handleFilterClick = React.useCallback(
    (id: string, item: SidebarItem) => {
      onItemClick({ id, ...item });
    },
    [onItemClick],
  );

  return (
    <>
      {items?.map(
        (filter) =>
          filter.values &&
          filter.values.length > 0 && (
            <OcSidebar
              key={filter.id}
              title={filter.name}
              sidebarModel={filter.values}
              selectedItems={selectedItems}
              onItemClick={(i) => handleFilterClick(filter.id, i)}
            />
          ),
      )}
    </>
  );
};

export default Sidebar;
