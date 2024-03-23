import { useForm } from 'react-hook-form'


interface SearchFormProps {
  onSubmit: (values: { query: string }) => void
}

export function SearchForm({
  onSubmit,
}: SearchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<
    Parameters<SearchFormProps['onSubmit']>[0]
  >()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-6">
        <div>
          <label
            htmlFor="query"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Search Notes
          </label>
          <input
            type="text"
            id="query"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder=""
            {...register('query')}
          />
        </div>
      </div>
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Search
      </button>
    </form>
  )
}
