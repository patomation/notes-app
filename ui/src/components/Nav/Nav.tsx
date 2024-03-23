import Link from 'next/link'
import React from 'react'
import {
  BeakerIcon,
  HomeIcon,
} from '@heroicons/react/24/solid'
import { useAtom } from 'jotai'
import { accessTokenAtom } from '@/atoms/accessTokenAtom'
import { access } from 'fs'

export function Nav() {
  const [accessToken, setAccessToken] = useAtom(
    accessTokenAtom
  )

  const links: {title: string ,to: string }[] = [
  
  ]
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
      <section
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '600px',
          padding: '0.25em 1em 0 1em',
        }}
      >
        <Link
          href="/"
          style={{
            padding: '0.5em 0',
          }}
        >
          <HomeIcon className="h-6 w-6 text-white-500" />
        </Link>

        {links.map(({ title, to }, i) => (
          <Link
            key={i}
            href={to}
            style={{
              padding: '0.5em 0.5em',
              border: '1px dotted gray',
            }}
          >
            <h6>{title}</h6>
          </Link>
        ))}

        {!accessToken && (
          <Link href="/login" style={{}}>
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Login
            </button>
          </Link>
        )}
      </section>
    </nav>
  )
}
