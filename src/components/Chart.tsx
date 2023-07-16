import { ResponsiveLine } from '@nivo/line';

import { ChartData, Coord } from '../App';

interface ChartProps {
  series: ChartData[];
}

export const Chart = (props: ChartProps) => {
  const data = props.series.map((serie) => ({
    id: serie.name,
    color: serie.color,
    data: serie.data,
  }));

  const GBP = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP' });

  return (
    <ResponsiveLine
      useMesh={true}
      curve="monotoneX"
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
        stacked: false,
        reverse: false,
      }}
      tooltip={(value) => {
        const serieData = data.find((serie) => serie.id == value.point.serieId)?.data;

        const shareXCoord = data.map((serie) => ({
          id: serie.id,
          coord: serie.data[Number(value.point.data.x)],
        }));

        let points: { id: string; coord: Coord }[] = [];
        if (serieData) {
          points = shareXCoord.filter(
            (data) => data.coord.y == serieData[Number(value.point.data.x)].y,
          );
        }

        return (
          <div className="bg-white">
            {points.map((point, index) => (
              <div
                key={index}
                className="bg-white flex flex-col border border-collapse border-slate-500 p-1"
              >
                <div className="text-bold">{point.id}</div>
                <div>x: {point.coord.x}</div>
                <div>remaining: {GBP.format(point.coord.y)}</div>
                <div>spent: {GBP.format(point.coord.z)}</div>
              </div>
            ))}
          </div>
        );
      }}
      enableCrosshair={true}
      isInteractive={true}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      data={data}
      animate={true}
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: 'left-to-right',
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: 'hover',
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};
