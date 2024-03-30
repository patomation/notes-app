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
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/solid'
import { assign, createMachine } from 'xstate'

const mainMachine = createMachine({
  initial: 'VIEW',
  context: {
    note_id: '',
    content: '',
  },
  states: {
    VIEW: {
      on: {
        SEARCH: {
          target: 'SEARCH',
        },
        NEW: {
          target: 'NEW',
        },
        EDIT: {
          target: 'EDIT',
          actions: [
            assign({
              note_id: ({ event }) =>
                event.note_id,
              content: ({ event }) =>
                event.content,
            }),
          ],
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
        EDIT: {
          target: 'EDIT',
          actions: [
            assign({
              note_id: ({ event }) =>
                event.note_id,
              content: ({ event }) =>
                event.content,
            }),
          ],
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
        EDIT: {
          target: 'EDIT',
          actions: [
            assign({
              note_id: ({ event }) =>
                event.note_id,
              content: ({ event }) =>
                event.content,
            }),
          ],
        },
      },
    },
    EDIT: {
      on: {
        NEW: {
          target: 'NEW',
        },
        SEARCH: {
          target: 'SEARCH',
        },
        SAVE: {
          target: 'VIEW',
        },
        CANCEL: {
          target: 'VIEW',
        },
        EDIT: {
          target: 'EDIT',
          actions: [
            assign({
              note_id: ({ event }) =>
                event.note_id,
              content: ({ event }) =>
                event.content,
            }),
          ],
        },
      },
    },
  },
})

export default function Home() {
  const [current, send] = useMachine(mainMachine)
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
      setNotes((prev) => [
        { note_id: 'OPTIMISTIC', content },
        ...prev,
      ])
      send({ type: 'SAVE' })
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
      const note = await response.json()
      setNotes((prev) => [
        note,
        ...prev.filter(
          (n) => n.note_id !== 'OPTIMISTIC'
        ),
      ])
    },
    [accessToken, send]
  )

  const handleUpdateNote = useCallback(
    async (
      note_id: string,
      content: string = ''
    ) => {
      setNotes((prev) =>
        prev.map((n) => ({
          ...n,
          content:
            n.note_id === note_id
              ? content
              : n.content,
        }))
      )
      send({ type: 'SAVE' })
      await fetch('/api/note/' + note_id, {
        method: 'PATCH',
        body: JSON.stringify({ content }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken,
        },
      })
    },
    [accessToken, send]
  )

  const handleDeleteNote = useCallback(
    async (note_id: string) => {
      setNotes((prev) =>
        prev.filter((n) => n.note_id !== note_id)
      )
      fetch('/api/note/' + note_id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken,
        },
      })
    },
    [accessToken, send]
  )

  useEffect(() => {
    if (accessToken) {
      handleSearchNotes()
    }
  }, [accessToken, handleSearchNotes])

  console.log({ current })

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
          {notes.map(({ note_id, content }) =>
            current.matches('EDIT') &&
            current.context.note_id ===
              note_id ? (
              <NoteForm
                key={note_id}
                defaultValue={content}
                onSubmit={(values) => {
                  handleUpdateNote(
                    note_id,
                    values.content
                  )
                }}
                onCancel={() => {
                  send({ type: 'CANCEL' })
                }}
              />
            ) : (
              <li
                key={note_id}
                style={{
                  padding: '1em 1em',
                  margin: '1em 0',
                  borderRadius: '1em',
                  border: '1px solid gray',
                  background:
                    'rgba(255,255,255,0.25)',
                }}
              >
                {/* <NoteForm onSubmit={() => {}} onCancel={() => {send({type: "CANCEL"})}}/> */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      flexGrow: 1,
                      minWidth: '0', // fixes wordWrap
                    }}
                  >
                    <div
                      style={{
                        wordWrap: 'break-word',
                        display: 'block',
                        paddingRight: '1em',
                      }}
                    >
                      {content}
                    </div>
                  </div>

                  {note_id !== 'OPTIMISTIC' && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent:
                          'space-between',
                        height: '100%',
                      }}
                    >
                      <PencilIcon
                        className="h-6 w-6 text-white-500"
                        style={{
                          cursor: 'pointer',
                          marginRight: '1em',
                        }}
                        onClick={() =>
                          send({
                            type: 'EDIT',
                            note_id,
                            content,
                          })
                        }
                      />
                      <TrashIcon
                        className="h-6 w-6 text-white-500"
                        style={{
                          cursor: 'pointer',
                        }}
                        onClick={() =>
                          handleDeleteNote(
                            note_id
                          )
                        }
                      />
                    </div>
                  )}
                </div>
              </li>
            )
          )}
        </ul>
      </>
    )
  )
}
