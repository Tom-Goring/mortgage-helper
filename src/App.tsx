import './App.css';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import * as z from 'zod';

import init, {
  calculate_amount_paid,
  calculate_pmt,
  calculate_time_to_pay_off,
  calculate_value_at_year,
} from '../finance-helper/pkg';
import { Card } from './components/Card';
import { Chart } from './components/Chart';

const formSchema = z.object({
  name: z.string(),
  housePrice: z.string(),
  deposit: z.string(),
  rate: z.string(),
  termLength: z.string(),
  overpayment: z.string(),
});

export type FormData = z.infer<typeof formSchema>;

export type Coord = { x: number; y: number; z: number };

export interface ChartData extends FormData {
  data: Coord[];
  color: 'hsl(152, 70%, 50%)';
}

function App() {
  const [series, setSeries] = useState<ChartData[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    init();
  }, []);

  const removeFromSeries = (index: number) => {
    setSeries((prev) => prev.filter((_, i) => i != index));
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    context: series,
    resolver: zodResolver(formSchema),
    defaultValues: {
      overpayment: '0',
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (series.find((series) => series.name == data.name)) {
      setError('A series with that name already exists!');
    } else {
      setError('');

      const pmt = calculate_pmt(
        data.housePrice.replace(/[^0-9.]+/g, ''),
        data.deposit.replace(/[^0-9.]+/g, ''),
        data.rate,
        data.termLength,
      );

      const timeToPayOff = Math.ceil(
        Number(
          calculate_time_to_pay_off(
            data.housePrice.replace(/[^0-9.]+/g, ''),
            data.deposit.replace(/[^0-9.]+/g, ''),
            data.rate,
            pmt,
            data.overpayment,
          ),
        ),
      );

      const totalPaid = timeToPayOff * Number(pmt);

      const dataSeries: Coord[] = [];
      for (let x = 0; x < 26; x++) {
        const value = calculate_value_at_year(
          data.housePrice.replace(/[^0-9.]+/g, ''),
          data.deposit.replace(/[^0-9.]+/g, ''),
          pmt,
          data.rate,
          String(x),
          data.overpayment,
        );

        dataSeries.push({
          x,
          y: Math.max(0, Number(value)),
          z: Math.min(
            Number(calculate_amount_paid(pmt, data.overpayment, String(x))),
            totalPaid,
          ),
        });
      }

      setSeries((prev) => [
        ...prev,
        { ...data, color: 'hsl(152, 70%, 50%)', data: dataSeries },
      ]);
    }
  };

  return (
    <div
      className="grid gap-8"
      style={{ gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' }}
    >
      <form className="w-1/2 m-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Name:{' '}
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register('name')}
          />
          {!!errors && (
            <span className="text-red-500 text-xs italic">
              {errors.name?.message as string}
            </span>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="housePrice"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Price:{' '}
          </label>
          <Controller
            name="housePrice"
            control={control}
            render={({ field: { ref, ...rest } }) => (
              <NumericFormat
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="£ "
                thousandSeparator=","
                decimalSeparator="."
                prefix="£ "
                decimalScale={2}
                getInputRef={ref}
                {...rest}
              />
            )}
          />
          {!!errors && (
            <span className="text-red-500 text-xs italic">
              {errors.housePrice?.message as string}
            </span>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="deposit" className="block text-gray-700 text-sm font-bold mb-2">
            Deposit:{' '}
          </label>
          <Controller
            name="deposit"
            control={control}
            render={({ field: { ref, ...rest } }) => (
              <NumericFormat
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="£ "
                thousandSeparator=","
                decimalSeparator="."
                prefix="£ "
                decimalScale={2}
                getInputRef={ref}
                {...rest}
              />
            )}
          />
          {!!errors && (
            <span className="text-red-500 text-xs italic">
              {errors.deposit?.message as string}
            </span>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="rate" className="block text-gray-700 text-sm font-bold mb-2">
            Rate: (%)
          </label>
          <input
            step={0.01}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register('rate')}
          />
          {!!errors && (
            <span className="text-red-500 text-xs italic">
              {errors.rate?.message as string}
            </span>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="termLength"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Term Length: (years)
          </label>
          <input
            step={1}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register('termLength')}
          />
          {!!errors && (
            <span className="text-red-500 text-xs italic">
              {errors.rate?.message as string}
            </span>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="overpayment"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Monthly Overpayment
          </label>
          <input
            step={1}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register('overpayment')}
          />
          {!!errors && (
            <span className="text-red-500 text-xs italic">
              {errors.overpayment?.message as string}
            </span>
          )}
        </div>

        <button
          className="w-full bg-blue-500 hover:bg-blue-700 text-2xl font-bold focus:outline-none focus:shadow-outline rounded"
          type="submit"
        >
          Add
        </button>
        {error && <span className="text-red-500 text-xs italic">{error}</span>}
      </form>
      <div className="m-4 overflow-auto" style={{ maxHeight: '50vh' }}>
        {series.map((series, index) => (
          <div key={index} className="p-4">
            <Card data={series} removeFromSeries={() => removeFromSeries(index)} />
          </div>
        ))}
      </div>
      <div style={{ gridColumnStart: 'span 2' }}>
        <Chart series={series} />
      </div>
    </div>
  );
}

export default App;
