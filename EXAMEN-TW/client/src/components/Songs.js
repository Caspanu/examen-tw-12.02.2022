import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'

function Songs(props) {
  const { playlistId } = useParams()
  const id = playlistId
  const [vizibilitateForm, setVizibilitateForm] = useState(false)
  const [songs, setSongs] = useState([])
  const [song, setSong] = useState({
    title: '',
    url: '',
    styleOfMusic: '',
    playlistId: id,
  })
  const [songId, setSongId] = useState('')
  useEffect(() => {
    setSongId(songId)
  }, [songId])

  const loadSongs = async () => {
    const response = await fetch('/songs')
    if (response.status === 200) {
      let body = await response.json()
      body = body.filter((x) => x.playlistId == id)
      setSongs(body)
    }
  }

  useEffect(() => {
    loadSongs()
  }, [songs])

  const salvareSong = async () => {
    if (songId === 'new') {
      const response = await fetch('/songs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(song),
      })
      console.log(response.status)
      if (response.status === 201) {
        setSongId(response.headers.get('Location').split('/')[5])
      }
    } else {
      await fetch(`/songs/${songId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(song),
      })
    }
    setVizibilitateForm(false)
  }

  const stergereSong = async (id_) => {
    if (songId !== 'new' && songId) {
      const response = await fetch(`/songs/${id_}`, {
        method: 'DELETE',
      })
      if (response.status === 204) {
        alert(`Record has been deleted!`)
      }
    }
  }

  function set(property, value) {
    const record = { ...song }
    record[property] = value
    setSong(record)
  }

  const handlerEditare = (rowData) => {
    setSongId(rowData.id)
    setSong(rowData)
    setVizibilitateForm(true)
  }

  const handlerStergere = (rowData) => {
    setSongId(rowData.id)
    stergereSong(rowData.id)
  }
  const handlerAdaugare = () => {
    setSongId('new')
    setSong({
      title: '',
      url: '',
      styleOfMusic: '',
      playlistId: id,
    })
    setVizibilitateForm(true)
  }

  const columnButtons = (rowData) => {
    return (
      <>
        <Button
          label="Delete"
          style={{ float: 'right' }}
          className="flex font-bold p-button-danger mr-3"
          onClick={() => handlerStergere(rowData)}
        />
        <Button
          label="Edit"
          style={{ float: 'right' }}
          className="flex surface-500 font-bold text-gray-900 p-button-secondary mr-3 bg-teal-500"
          onClick={() => handlerEditare(rowData)}
        />
      </>
    )
  }

  return (
    <div>
      <div>
        <h1 className="inline text-cyan-600">Songs: </h1>
        <Button
          label="Add Song"
          style={{ float: 'right' }}
          className="flex surface-500 font-bold text-gray-900 m-2"
          onClick={() => handlerAdaugare()}
        />
      </div>
      <DataTable className="mt-3" value={songs}>
        <Column header="Title" field="title" />
        <Column header="Url" field="url" />
        <Column header="StyleOfMusic" field="styleOfMusic" />
        <Column body={columnButtons} />
      </DataTable>

      <Dialog
        style={{ height: '30rem' }}
        header="Song Form"
        visible={vizibilitateForm}
        onHide={() => setVizibilitateForm(false)}
      >
        <div>
          <InputText
            className="mt-5"
            placeholder="Title"
            onChange={(e) => set('title', e.target.value)}
            value={song.title}
          />
        </div>
        <div>
          <InputText
            className="mt-5"
            placeholder="Url"
            onChange={(e) => set('url', e.target.value)}
            value={song.url}
          />
        </div>
        <div>
          <select
            className="text-600 text-base border-400 text-xl w-15rem h-3rem mt-5"
            onChange={(e) => set('styleOfMusic', e.target.value)}
            value={song.styleOfMusic}
          >
            <option value="-">StyleOfMusic</option>
            <option value="POP">POP</option>
            <option value="HIP-HOP">HIP-HOP</option>
            <option value="ROCK">ROCK</option>
          </select>
        </div>
        <div className="w-10">
          <Button
            label="Save"
            className="p-button bg-teal-500 mt-5 w-15rem"
            onClick={() => salvareSong()}
          />
        </div>
      </Dialog>
    </div>
  )
}
export default Songs
