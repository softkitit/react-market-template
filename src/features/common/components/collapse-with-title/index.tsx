import * as React from 'react';

import { ReactComponent as ArrowIcon } from '../../../../../public/assets/img/select-up.svg';

import './style.scss';

export const CollapseWithTitle = (props: {
  collapsed: boolean;
  changeCollapseStatus: React.Dispatch<React.SetStateAction<boolean>>;
  titleForOpen: string;
  titleForClose: string;
}) => {
  const { collapsed, changeCollapseStatus, titleForOpen, titleForClose } = props;
  return (
    <div
      role="button"
      tabIndex={0}
      aria-hidden="true"
      className="filters-collapse d-flex d-md-none justify-content-between mb-3"
      onClick={() => changeCollapseStatus(!collapsed)}
    >
      {/*eslint-disable-next-line*/}
      <a className="font-m font-med link">{collapsed ? titleForOpen : titleForClose}</a>
      <ArrowIcon className={`${collapsed ? 'rotate' : ''}`} />
    </div>
  );
};
export default CollapseWithTitle;
