import React, { useEffect } from 'react'
import { accessTokenAtom } from '@/atoms/accessTokenAtom'
import { useAtom } from 'jotai'
import { useCallback, useState } from 'react'
import { SearchForm } from '@/components/SearchForm'
import { NoteForm } from '@/components/NoteForm'
import { useMachine } from '@xstate/react'
import {
  MagnifyingGlassIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/solid'
import { createMachine } from 'xstate'

const createMainMachine = createMachine({
  initial: 'VIEW',
  states: {
    VIEW: {
      on: {
        SEARCH: {
          target: 'SEARCH',
        },
        NEW: {
          target: 'NEW',
        },
      },
    },
    SEARCH: {
      on: {
        NEW: {
          target: 'NEW',
        },
        CANCEL: {
          target: 'VIEW',
        },
      },
    },
    NEW: {
      on: {
        SEARCH: {
          target: 'SEARCH',
        },
        SAVE: {
          target: 'VIEW',
        },
        CANCEL: {
          target: 'VIEW',
        },
      },
    },
  },
})

export default function Home() {
  const [current, send] = useMachine(
    createMainMachine
  )
  const [accessToken] = useAtom(accessTokenAtom)

  const [notes, setNotes] = useState<Note[]>([])

  const handleSearchNotes = useCallback(
    async (query = '') => {
      const response = await fetch(
        '/api/note/search?q=' + query,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              'Bearer ' + accessToken,
          },
        }
      )
      const json = await response.json()
      setNotes(json.notes)
    },
    [accessToken]
  )

  const handleCreateNote = useCallback(
    async (content = '') => {
      const response = await fetch(
        '/api/note/create',
        {
          method: 'POST',
          body: JSON.stringify({ content }),
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              'Bearer ' + accessToken,
          },
        }
      )
      const json = await response.json()
      setNotes((prev) => [
        { note_id: 'new', content },
        ...prev,
      ])
      send({ type: 'SAVE' })
    },
    [accessToken, send]
  )

  useEffect(() => {
    if (accessToken) {
      handleSearchNotes()
    }
  }, [accessToken, handleSearchNotes])

  return (
    accessToken && (
      <>
        {accessToken && (
          <div
            style={{
              display: 'flex',
              alignContent: 'center',
              alignItems: 'center',
            }}
          >
            {current.matches('SEARCH') ? (
              <SearchForm
                onSubmit={({ query }) => {
                  handleSearchNotes(query)
                }}
                onCancel={() =>
                  send({ type: 'CANCEL' })
                }
              />
            ) : (
              <MagnifyingGlassIcon
                className="h-6 w-6 text-white-500"
                style={{
                  cursor: 'pointer',
                }}
                onClick={() =>
                  send({ type: 'SEARCH' })
                }
              />
            )}

            <PlusCircleIcon
              className="h-6 w-6 text-white-500"
              style={{
                cursor: 'pointer',
                marginLeft: '1em',
              }}
              onClick={() =>
                send({ type: 'NEW' })
              }
            />
          </div>
        )}
        {current.matches('NEW') && (
          <NoteForm
            onSubmit={({ content }) => {
              handleCreateNote(content)
            }}
            onCancel={() =>
              send({ type: 'CANCEL' })
            }
          />
        )}
        <ul>
          {notes?.map(({ note_id, content }) => (
            <li
              key={note_id}
              style={{
                padding: '1em 1em',
                margin: '1em 0',
                borderRadius: '1em',
                border: '1px solid gray',
                background:
                  'rgba(255,255,255,0.5)',
                wordWrap: 'break-word',
              }}
            >
              <span>{content}</span>
            </li>
          ))}
        </ul>
      </>
    )
  )
}
