import * as React from 'react';
import { OcChartComponent } from '@openchannel/react-common-components/dist/ui/portal/organisms';

import './styles.scss';

const month = {
  labelsY: [3, 10, 30, 50, 25, 40, 100, 70, 150, 200, 50, 85, 50],
  labelsX: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
  tabularLabels: [
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
    'January',
    'February',
    'March',
  ],
};

const day = {
  labelsY: [
    200, 400, 100, 50, 700, 750, 250, 200, 400, 100, 50, 700, 750, 200, 400, 100, 50, 700, 750, 250, 200, 400, 100, 50,
    700, 750, 43, 234, 376, 519,
  ],
  labelsX: [
    'Apr 29',
    'Apr 30',
    'May 01',
    'May 02',
    'May 03',
    'May 04',
    'May 05',
    'May 06',
    'May 07',
    'May 08',
    'May 09',
    'May 10',
    'May 11',
    'May 12',
    'May 13',
    'May 14',
    'May 15',
    'May 16',
    'May 17',
    'May 18',
    'May 19',
    'May 20',
    'May 21',
    'May 22',
    'May 23',
    'May 24',
    'May 25',
    'May 26',
    'May 27',
    'May 28',
  ],
  tabularLabels: [
    'Apr 29',
    'Apr 30',
    'May 01',
    'May 02',
    'May 03',
    'May 04',
    'May 05',
    'May 06',
    'May 07',
    'May 08',
    'May 09',
    'May 10',
    'May 11',
    'May 12',
    'May 13',
    'May 14',
    'May 15',
    'May 16',
    'May 17',
    'May 18',
    'May 19',
    'May 20',
    'May 21',
    'May 22',
    'May 23',
    'May 24',
    'May 25',
    'May 26',
    'May 27',
    'May 28',
  ],
};

const defaultProps = {
  chartData: {
    layout: 'standard',
    data: month,
    periods: [
      {
        id: 'month',
        label: 'Monthly',
        active: true,
        tabularLabel: 'Month',
      },
      {
        id: 'day',
        label: 'Daily',
        tabularLabel: 'Day',
      },
    ],
    fields: [
      {
        id: 'downloads',
        label: 'Downloads',
        active: true,
      },
      {
        id: 'reviews',
        label: 'Reviews',
      },
      {
        id: 'leads',
        label: 'Leads',
      },
      {
        id: 'views',
        label: 'Views',
      },
    ],
  },
  count: month.labelsY.reduce((a, b) => a + b, 0),
  countText: 'Total',
  downloadUrl: './img/upload_icon.svg',
  enablePoints: true,
  minDropdownWidth: '247px',
  activeDataType: 'graph',
};

// eslint-disable-next-line
const ChartPage: React.FC<any> = (props) => {
  const [chartData, setChartData] = React.useState(defaultProps.chartData);
  const [count, setCount] = React.useState(props.count);
  const [countText, setCountText] = React.useState(props.countText);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const changeChartOptions = ({ period, field }) => {
    const newChartDat = { ...chartData };

    if (period.id === 'day') {
      newChartDat.data = day;
    } else {
      newChartDat.data = month;
    }

    newChartDat.fields = chartData.fields.map((item) => ({
      ...item,
      active: field.id === item.id,
    }));
    newChartDat.periods = chartData.periods.map((item) => ({
      ...item,
      active: period.id === item.id,
    }));

    setChartData(newChartDat);
    setCount(newChartDat.data.labelsY.reduce((a, b) => a + b, 0));
    setCountText(`Total ${field.id}`);
  };

  return (
    <div className="bg-container pt-sm-5">
      <OcChartComponent
        {...props}
        chartData={chartData}
        count={count}
        countText={countText}
        changeChartOptions={changeChartOptions}
      />
    </div>
  );
};

export default ChartPage;
