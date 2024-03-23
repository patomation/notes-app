import { accessTokenAtom } from '@/atoms/accessTokenAtom'
import { useAtom } from 'jotai'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  useRouter,
  useSearchParams,
} from 'next/navigation'

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const [accessToken, setAccessToken] = useAtom(
    accessTokenAtom
  )

  const searchParams = useSearchParams()
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const handleLogin = useCallback(
    async (values: any) => {
      setLoading(true)
      try {
        const response = await fetch(
          '/api/auth/register',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          }
        )
        const json = await response.json()
        setAccessToken(json?.access_token)
        setLoading(false)
        const redirectUri = searchParams?.get(
          'redirectUri'
        )
        if (redirectUri) {
          router.push(redirectUri)
        } else {
          router.push('/')
        }
      } catch (error) {
        console.error(error)
        setLoading(false)
      }
    },
    []
  )

  if (loading) {
    return <h1>Loading...</h1>
  }

  return (
    <form onSubmit={handleSubmit(handleLogin)}>
      <div className="mb-6">
        <div>
          <label
            htmlFor="user_name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            User Name
          </label>
          <input
            type="text"
            id="user_name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder=""
            required
            {...register('username')}
          />
        </div>
      </div>
      <div className="mb-6">
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder=""
          required
          {...register('password')}
        />
      </div>
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Register
      </button>
    </form>
  )
}
