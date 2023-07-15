import './App.css';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import * as z from 'zod';

import { Card } from './components/Card';

const convertCurrencyStringToNum = (input: string): number =>
  Number(input.replace(/[^0-9.]+/g, ''));

const formSchema = z.object({
  name: z.string(),
  housePrice: z.string().transform(convertCurrencyStringToNum),
  deposit: z.string().transform(convertCurrencyStringToNum),
  rate: z.number(),
  termLength: z.number(),
  overpayment: z.number(),
});

export type FormData = z.infer<typeof formSchema>;

function App() {
  const [series, setSeries] = useState<FormData[]>([]);
  const [error, setError] = useState('');

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
      overpayment: 0,
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (series.find((series) => series.name == data.name)) {
      setError('A series with that name already exists!');
    } else {
      setSeries((prev) => [...prev, data]);
      setError('');
    }
  };

  return (
    <div className="grid gap-8" style={{ gridTemplateColumns: '1fr 1fr' }}>
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
            Rate:{' '}
          </label>
          <input
            step={0.01}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            {...register('rate', { valueAsNumber: true })}
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
            Term Length:{' '}
          </label>
          <input
            step={1}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            {...register('termLength', { valueAsNumber: true })}
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
            Overpayments:{' '}
          </label>
          <input
            step={1}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            {...register('overpayment', { valueAsNumber: true })}
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
      <div className="m-4">
        {series.map((series, index) => (
          <div key={index} className="p-4">
            <Card data={series} removeFromSeries={() => removeFromSeries(index)} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
