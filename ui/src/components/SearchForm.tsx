import { useForm } from 'react-hook-form'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'

interface SearchFormProps {
  onSubmit: (values: { query: string }) => void
  onCancel: () => void
}

export function SearchForm({
  onSubmit,
  onCancel,
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
      <div>
        <div
          style={{
            display: 'flex',
            position: 'relative',
          }}
        >
          <input
            autoFocus
            type="text"
            id="query"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder=""
            {...register('query')}
          />
          <button
            type="submit"
            style={{
              position: 'absolute',
              right: 0,
              top: '0.5em',
            }}
          >
            <MagnifyingGlassIcon
              className="h-6 w-6 text-white-500"
              style={{
                cursor: 'pointer',
                marginRight: '1em',
              }}
            />
          </button>
        </div>
      </div>
    </form>
  )
}
