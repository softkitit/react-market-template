import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { find } from 'lodash';

import {
  OcAppDescription,
  OcNavigationBreadcrumbs,
  OcDropdown,
  OcReviewListComponent,
  OcReviewComponent,
} from '@openchannel/react-common-components/dist/ui/common/molecules';
import { OcImageGalleryComponent, OcVideoComponent } from '@openchannel/react-common-components/dist/ui/common/atoms';
import { OcRatingComponent } from '@openchannel/react-common-components/dist/ui/market/atoms';
import { OcOverallRating } from '@openchannel/react-common-components/dist/ui/market/organisms';
import { OcRecommendedAppsComponent } from '@openchannel/react-common-components/dist/ui/common/organisms';
import { FullAppData } from '@openchannel/react-common-components';
import { CreateReviewRequest, ReviewResponse, Review } from '@openchannel/react-common-services';
import { ActionButton } from '../action-button';

import HelpIcon from '../../../../../public/assets/img/icon-help.svg';
import InternetIcon from '../../../../../public/assets/img/internet.svg';
import PadlockIcon from '../../../../../public/assets/img/padlock.svg';
import EmailIcon from '../../../../../public/assets/img/icon-email.svg';
import BubbleIcon from '../../../../../public/assets/img/speech-bubble.svg';
import {
  fetchRecommendedApps,
  fetchSelectedApp,
  statVisitApp,
  fetchCategories,
} from '../../../apps/store/apps/actions';
import DotsIcon from '../../../../../public/assets/img/dots-hr-icon.svg';
import {
  fetchReviewByAppId,
  fetchSorts,
  createReview,
  updateReview,
  deleteReview,
  fetchCurrentReview,
} from '../../../reviews/store/reviews/actions';
import { fetchUserId } from '../../store/session/actions';
import { ButtonAction } from '../action-button/types';
import { useTypedSelector } from 'features/common/hooks';

import './style.scss';

export interface AppDetailsProps {
  app: FullAppData;
  price?: number;
  appListingActions?: ButtonAction[];
}
export interface Option {
  label: string;
  [key: string]: string | undefined;
}
const dropdownMenuOptions = ['EDIT', 'DELETE'];

const dropdownSortOptions = [
  { label: 'All Stars', value: null },
  { label: '5 Stars', value: `{'rating': 500}` },
  { label: '4 Stars', value: `{'rating': 400}` },
  { label: '3 Stars', value: `{'rating': 300}` },
  { label: '2 Stars', value: `{'rating': 200}` },
  { label: '1 Stars', value: `{'rating': 100}` },
];

export const AppDetails: React.FC<AppDetailsProps> = (props) => {
  const { app, price = 0, appListingActions = [] } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  React.useEffect(() => {
    dispatch(fetchReviewByAppId(app.appId));
    setSortSelected({ label: '', value: '' });
    setFilterSelected({ label: 'All Stars', value: undefined });
    dispatch(fetchRecommendedApps());
    dispatch(fetchSorts());
  }, [app]);

  React.useEffect(() => {
    if (selectedApp !== null) {
      dispatch(statVisitApp(selectedApp.appId));
      dispatch(fetchCategories());
    }
  }, []);
  const { recommendedApps, selectedApp, isLoaded, categoryLinks } = useTypedSelector(({ apps }) => apps);
  const { reviewsByApp, sorts } = useTypedSelector(({ reviews }) => reviews);
  const { userId, isExist } = useTypedSelector(({ session }) => session);
  const [isWritingReview, setIsWritingReview] = React.useState(false);
  const [sortSelected, setSortSelected] = React.useState<Option | undefined>({ label: '', value: '' });
  const [filterSelected, setFilterSelected] = React.useState<Option | undefined>({
    label: 'All Stars',
    value: undefined,
  });
  const [selectedAction, setSelectedAction] = React.useState<Option | undefined>({ label: '', value: '' });
  const [currentEditReview, setCurrentEditReview] = React.useState(undefined);

  React.useEffect(() => {
    isExist ? dispatch(fetchUserId()) : undefined;
  }, [isExist]);

  React.useEffect(() => {
    switch (selectedAction!.value) {
      case 'EDIT':
        editReview();
        return;
      case 'DELETE':
        removeReview();
        return;
      default:
        return;
    }
  }, [selectedAction]);

  const historyBack = React.useCallback(() => {
    history.goBack();
  }, [history]);

  const handleDropdownClick = (appId: string, filter?: Option | undefined, sort?: Option | undefined) => {
    setSortSelected(sort);
    setFilterSelected(filter);
    dispatch(fetchReviewByAppId(appId, sort?.value, filter?.value));
  };

  const appRating = React.useMemo(
    () => (selectedApp && selectedApp.rating ? selectedApp.rating / 100 : 0),
    [selectedApp],
  );

  const appReviewCount = React.useMemo(
    () => (selectedApp && selectedApp.reviewCount ? selectedApp.reviewCount : 0),
    [selectedApp],
  );

  const appGalleryImages = app.customData
    ? app?.customData?.images?.map((imageUrl: string) => {
        return { image: imageUrl, title: '', description: '' };
      })
    : [];

  const overallReviews = React.useMemo(() => {
    const reviewList: Array<number> = reviewsByApp?.list.map((rev) => Math.round(rev.rating / 100)) || [];
    const countedReviews = {
      rating: appRating,
      reviewCount: appReviewCount,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    reviewList.forEach((review) => countedReviews[review]++);
    return countedReviews;
  }, [reviewsByApp]);

  const userReview = React.useMemo(() => {
    const hasUserReview = reviewsByApp ? !!find(reviewsByApp.list, ['userId', userId]) : false;
    return hasUserReview;
  }, [reviewsByApp]);

  const hasWriteReviewPermission = React.useMemo(
    () => app.ownership && !userReview && isExist,
    [app.ownership, userReview],
  );
  const onReviewSubmit = (review: Review | ReviewResponse): void => {
    if (selectedAction!.value === 'EDIT') {
      const reviewData: Review = {
        ...review,
        appId: app.appId,
      };
      dispatch(updateReview(reviewData));
      dispatch(fetchSelectedApp(app.safeName[0]));
      dispatch(fetchReviewByAppId(app.appId));
      setIsWritingReview(false);
      setCurrentEditReview(undefined);
    } else {
      const reviewData: ReviewResponse | CreateReviewRequest = {
        ...review,
        appId: app.appId,
      };
      dispatch(createReview(reviewData));
      dispatch(fetchSelectedApp(app.safeName[0]));
      dispatch(fetchReviewByAppId(app.appId));
      setIsWritingReview(false);
      setCurrentEditReview(undefined);
    }
  };

  const editReview = (): void => {
    //eslint-disable-next-line
    const review: any = find(reviewsByApp!.list, ['userId', userId]);
    dispatch(fetchCurrentReview(review!.reviewId));
    setCurrentEditReview(review);
    setIsWritingReview(true);
  };

  const removeReview = (): void => {
    //eslint-disable-next-line
    const review: any = find(reviewsByApp!.list, ['userId', userId]);
    dispatch(deleteReview(review.reviewId, app.appId));
    setCurrentEditReview(undefined);
    dispatch(fetchSelectedApp(app.safeName[0]));
    dispatch(fetchReviewByAppId(app.appId));
  };

  return (
    <>
      {isLoaded && (
        <>
          <div className="bg-container bg bg-s pb-7">
            <div className="container container_custom">
              <div className="app-detail__back-link height-unset">
                <div className="d-flex flex-row align-items-center">
                  <OcNavigationBreadcrumbs pageTitle="" navigateText="Back" navigateClick={historyBack} />
                </div>
              </div>
              <div className="app-detail__data">
                <div className="app-detail__data-description">
                  {app?.customData?.logo && (
                    <div className="col-md-auto mb-2 app-logo">
                      <img src={app?.customData?.logo} alt={`${app?.name || 'app-icon'}`} />
                    </div>
                  )}
                  <div className="d-flex flex-column">
                    <h1 className="mb-2 page-title-size">{app?.name}</h1>
                    {app?.customData?.categories.length > 0 && (
                      <ul className="categories mb-1">
                        {app.customData.categories.map((category: string) => (
                          <li key={category} className="categories__item mb-1">
                            <Link to={categoryLinks[category]}>{category}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                    <span className="app-detail__price mb-2">{(price || app.model[0]?.price) === 0 && 'Free'}</span>
                    <div className="text-secondary mb-2">{app?.customData.summary}</div>
                    <OcRatingComponent
                      className="mb-3 mb-md-2"
                      rating={appRating}
                      reviewCount={appReviewCount}
                      label="reviews"
                      labelClass="medium"
                      type="single-star"
                      disabled={true}
                    />
                    {appListingActions?.length > 0 && (
                      <div className="actions-container">
                        {
                          //eslint-disable-next-line
                          appListingActions?.map((action: any, index: number) => (
                            <ActionButton buttonAction={action} key={index} />
                          ))
                        }
                      </div>
                    )}
                  </div>
                </div>
                <div className="app-detail__video">
                  {app?.customData?.['video-url'] && <OcVideoComponent videoUrl={app?.customData?.['video-url']} />}
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="mt-8 d-block">
              {appGalleryImages && <OcImageGalleryComponent gallery={appGalleryImages} />}
            </div>

            <div className="row mb-0 mb-md-8 mt-3 mt-md-8">
              <div className="col-md-8">
                <OcAppDescription
                  appDescription={app?.customData.description as string}
                  truncateTextLength={800}
                  shortDescription={false}
                  showFullDescription={false}
                  header="About"
                  headerClass="mb-2"
                />
              </div>
              <div className="app-detail__data-support col-md ml-md-8 mt-3 mt-md-0">
                <h2 className="app-detail__data-support-title mb-2 ">Support</h2>
                <ul className="list-group list-group-flush">
                  {app?.customData['terms-of-service-url'] && (
                    <li className="list-group-item">
                      <img src={HelpIcon} className="pr-2" alt="icon" />
                      <a className="support-link" href={app?.customData['terms-of-service-url']}>
                        F.A.Q.
                      </a>
                    </li>
                  )}
                  {app?.customData['website-url'] && (
                    <li className="list-group-item">
                      <img src={InternetIcon} className="pr-2" alt="icon" />
                      <a className="support-link" href={app?.customData['website-url']}>
                        Developer website
                      </a>
                    </li>
                  )}
                  {app?.customData['terms-of-service-url'] && (
                    <li className="list-group-item">
                      <img src={PadlockIcon} className="pr-2" alt="icon" />
                      <a className="support-link" href={app?.customData['terms-of-service-url']}>
                        Privacy Policy
                      </a>
                    </li>
                  )}
                  {app?.customData['contact-email'] && (
                    <li className="list-group-item link">
                      <img src={EmailIcon} className="pr-2" alt="icon" />
                      <a className="support-link" href={`mailto: ${app?.customData['contact-email']}`}>
                        {app?.customData['contact-email']}
                      </a>
                    </li>
                  )}
                  {app?.customData['support-url'] && (
                    <li className="list-group-item">
                      <img src={BubbleIcon} className="pr-2" alt="icon" />
                      <a className="support-link" href={app?.customData['support-url']}>
                        Support website
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div className="d-flex flex-wrap flex-md-nowrap">
              <div className="rating-column">
                <OcOverallRating allReviewSummary={overallReviews} />
              </div>
              <div className="review-column">
                {!isWritingReview && (
                  <OcReviewListComponent
                    reviewList={reviewsByApp?.list || []}
                    writeReviewPermission={hasWriteReviewPermission}
                    writeReview={() => setIsWritingReview(!isWritingReview)}
                    reviewListTitle="Most recent reviews"
                    setSelectedAction={setSelectedAction}
                    currentUserId={userId}
                    dropdownDefaultIcon={DotsIcon}
                    dropdownActiveIcon={DotsIcon}
                    dropdownMenuOptions={dropdownMenuOptions}
                  >
                    <div>
                      <OcDropdown
                        title="Sort by"
                        options={sorts}
                        onSelect={(selectedSort: Option | undefined) =>
                          handleDropdownClick(app.appId, filterSelected, selectedSort)
                        }
                        selected={sortSelected}
                      />
                      <OcDropdown
                        options={dropdownSortOptions}
                        title="Show"
                        onSelect={(selectedFilter: Option | undefined) =>
                          handleDropdownClick(app.appId, selectedFilter, sortSelected)
                        }
                        selected={filterSelected}
                      />
                    </div>
                  </OcReviewListComponent>
                )}
                {isWritingReview && (
                  <OcReviewComponent
                    heading="Write a review"
                    onSubmit={onReviewSubmit}
                    onReviewCancel={() => setIsWritingReview(false)}
                    reviewData={currentEditReview}
                    enableButtons
                  />
                )}
              </div>
            </div>
          </div>
          {recommendedApps && (
            <div className="bg-container mt-5 pt-3 pb-4 px-3 px-md-0 py-md-8 min-height-auto">
              <div className="container">
                <OcRecommendedAppsComponent
                  recommendedAppTitle="Recommended for you"
                  appList={recommendedApps || []}
                  routerLinkForOneApp="/details"
                  clickByAppCard={() => {
                    window.scroll(0, 0);
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default AppDetails;
