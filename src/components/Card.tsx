import { FaTrash } from 'react-icons/fa';

import { FormData } from '../App';

interface CardProps {
  data: FormData;
  removeFromSeries: () => void;
}

export const Card = (props: CardProps) => {
  const PV = props.data.housePrice - props.data.deposit;

  const APR = props.data.rate / 100;

  const R = APR / 12;

  const n = 12 * props.data.termLength;

  const PMT = (PV * R) / (1 - Math.pow(1 + R, -n));

  // const FV = PMT * ((Math.pow(1 + R, n) - 1) / R);

  const i = R;

  const timeToPayOffMonths = -(
    Math.log(1 - (PV * i) / (PMT + props.data.overpayment)) / Math.log(1 + i)
  );

  const timeToPayOffYears = timeToPayOffMonths / 12;

  console.log(timeToPayOffYears);

  const GBP = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP' });
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
      <div className="px-6 py-4">
        <div className="flex flex-row justify-between">
          <div className="font-bold text-xl mb-2">{props.data.name}</div>
          <button
            onClick={props.removeFromSeries}
            className="button text-bold bg-white h-1 w-fit p-0 text-red-500 inline-block"
          >
            <FaTrash style={{ fontSize: '1rem' }} />
          </button>
        </div>
        <div className="px-6 py-4 grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <span>House Price: </span>
          <span>{GBP.format(props.data.housePrice)}</span>
          <span>Deposit: </span>
          <span>{GBP.format(props.data.deposit)}</span>
          <span>Mortgage: </span>
          <span>{GBP.format(PV)}</span>
          <span>Rate: </span>
          <span>{props.data.rate}%</span>
          <span>Term Length: </span>
          <span>{props.data.termLength} year(s)</span>
          <span>PMT:</span>
          <span>{GBP.format(PMT)}</span>
          <span>Value after {n} periods:</span>
          <span>{GBP.format(PMT * n)}</span>
          <span>Time to pay off with overpayments: </span>
          <span>
            {timeToPayOffYears.toPrecision(2)}y (
            {new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            }).format(timeToPayOffMonths)}
            m)
          </span>
        </div>
      </div>
    </div>
  );
};
