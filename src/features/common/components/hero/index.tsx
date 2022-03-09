import * as React from 'react';
import { useDispatch } from 'react-redux';
import { OcFeaturedAppsComponent } from '@openchannel/react-common-components/dist/ui/common/organisms';

import { useCmsData, useTypedSelector } from '../../hooks';
import { getFeaturedApps } from 'features/apps/store/apps';

import './style.scss';

const Hero: React.FC = () => {
  const { home } = useCmsData();
  const dispatch = useDispatch();
  const data = useTypedSelector(({ apps }) => apps.featured);

  React.useEffect(() => {
    dispatch(getFeaturedApps());
  }, []);

  return (
    <div className="bg-container height-unset d-flex flex-column align-items-center">
      <div className="container">
        <div className="row">
          <div className="page-info col-md-9 col-lg-7 text-center mx-auto">
            <h1 className="page-title">{home?.pageInfoTitle}</h1>
            <p className="page-description mb-4 text-secondary">{home?.pageInfoSubtext}</p>
          </div>
        </div>
      </div>
      <div className="container featured-apps-container">
        {data.length > 0 && (
          <OcFeaturedAppsComponent
            data={data}
            mainRouterLink="/details/"
            navigationParam="safeName[0]"
            label="Featured"
            customClass=""
          />
        )}
      </div>
    </div>
  );
};

export default Hero;
