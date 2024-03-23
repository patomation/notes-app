import React, { useEffect } from 'react'
import { accessTokenAtom } from '@/atoms/accessTokenAtom'
import { useAtom } from 'jotai'
import { redirect } from 'next/navigation'
import { useRouter } from 'next/router'

import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { SearchForm } from '@/components/SearchForm'
import { NoteForm } from '@/components/NoteForm'

export default function Home() {
  const [accessToken] = useAtom(accessTokenAtom)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const [notes, setNotes] = useState<Note[]>([
    {
      note_id: '1',
      content: 'This is a note, this is a note',
    },
    {
      note_id: '2',
      content: 'This is a note, this is a note',
    },
    {
      note_id: '3',
      content: 'This is a note, this is a note',
    },
    {
      note_id: '4',
      content: 'This is a note, this is a note',
    },
    {
      note_id: '5',
      content: 'This is a note, this is a note',
    },
  ])
  
  const handleSearchNotes  = useCallback(async (query = "") => {
    const response = await fetch(
      '/api/note/search?q=' + query,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        },
      }
    )
    const json = await response.json()
    setNotes(json.notes)
  }, [accessToken])

  const handleCreateNote  = useCallback(async (content = "") => {
    const response = await fetch(
      '/api/note/create',
      {
        method: 'POST',
        body: JSON.stringify({content}),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        },
      }
    )
    const json = await response.json()
    setNotes(json.notes)
  }, [accessToken])

  useEffect(() => {
    if(accessToken) {
      handleSearchNotes()
    }

  }, [accessToken])

 

  return (
    <>
      <SearchForm onSubmit={({query}) => {
        handleSearchNotes(query)
      }} />

      <NoteForm onSubmit={({content}) => {
        handleCreateNote(content)
      }} />
      <ul>
        {notes?.map(({ note_id, content }) => (
          <li key={note_id}>{content}</li>
        ))}
      </ul>
    </>
  )
}
