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
