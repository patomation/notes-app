import Link from 'next/link'
import React from 'react'
import { useAtom } from 'jotai'
import { accessTokenAtom } from '@/atoms/accessTokenAtom'

export function Nav() {
  const [accessToken, setAccessToken] = useAtom(
    accessTokenAtom
  )

  return (
    <nav
      id="nav"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        background: '#000000',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <section>
        {!accessToken && (
          <div id="anon-view">
            <Link href="/register">
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Register
              </button>
            </Link>
            <Link href="/login">
              <button
                type="button"
                className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
              >
                Login
              </button>
            </Link>
          </div>
        )}
        {accessToken && (
          <div id="registered-view">
            <Link
              href="/login"
              onClick={() => setAccessToken(null)}
            >
              Log Out
            </Link>
          </div>
        )}
      </section>
    </nav>
  )
}
