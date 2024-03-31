import { accessTokenAtom } from '@/atoms/accessTokenAtom'
import { useAtom } from 'jotai'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  useRouter,
  useSearchParams,
} from 'next/navigation'
import Link from 'next/link'

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

  const [errorMessage, setErrorMessage] =
    useState<string | undefined>()

  const handleLogin = useCallback(
    async (values: any) => {
      setLoading(true)
      try {
        const response = await fetch(
          '/api/auth/login',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          }
        )
        const json = await response.json()
        setLoading(false)
        if (json?.access_token) {
          setAccessToken(json?.access_token)
          const redirectUri = searchParams?.get(
            'redirectUri'
          )
          if (redirectUri) {
            router.push(redirectUri)
          } else {
            router.push('/')
          }
        } else {
          setErrorMessage(json?.message || 'Login failed')
          setLoading(false)
        }
      } catch (error) {
        console.error(error)
        setLoading(false)
        setErrorMessage('Login failed')
      }
    },
    [router, searchParams, setAccessToken]
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
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-1/2 w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Login
      </button>
      <Link href="/register">
        <button
          type="button"
          className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm sm:w-1/2 w-full  px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
        >
          New user? Register instead
        </button>
      </Link>
      {errorMessage && (
        <p
          style={{
            color: '#f1095a',
          }}
        >
          {errorMessage}
        </p>
      )}
    </form>
  )
}
