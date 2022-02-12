import { useEffect, useState } from 'react'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'

function Playlists() {
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [first, setFirst] = useState(0)
  const [count, setCount] = useState(0)
  const [vizibilitateForm, setVizibilitateForm] = useState(false)

  const [sortField, setSortField] = useState('')
  const [sortOrder, setSortOrder] = useState('+')
  const [filter1, setFilter1] = useState({ name: '', code: '' })
  const [filter2, setFilter2] = useState({ name: '', code: '' })
  const filtre = [
    { name: 'Id', code: 'id' },
    { name: 'Description', code: 'description' },
    { name: 'Date Created', code: 'dateCreated' },
  ]

  const [playlistId, setPlaylistId] = useState('')
  const [playlist, setPlaylist] = useState({
    description: '',
    dateCreated: '',
  })
  const [playlists, setPlaylists] = useState([])
  useEffect(() => {
    loadPlaylists()
  }, [playlists])

  const loadPlaylists = async () => {
    const response = await fetch('/playlists', {
      headers: {
        'x-fields': existaFiltru(),
        'x-sort': existaSortare(),
      },
    })
    if (response.status === 200) {
      let body = await response.json()
      setPlaylists(body)
      setCount(body.length)
    }
  }

  function existaFiltru() {
    if (filter1.code !== '' || filter2.code !== '') {
      if (filter1.code !== '' && filter2.code === '') {
        return filter1.code
      } else if (filter2.code !== '' && filter1.code === '') {
        return filter2.code
      } else {
        return filter1.code + ',' + filter2.code
      }
    } else {
      return ''
    }
  }

  const handlerClearFilter = () => {
    setFilter1({ name: '', code: '' })
    setFilter2({ name: '', code: '' })
  }

  function existaSortare() {
    if (sortField !== '') {
      return sortOrder + sortField
    } else {
      return ''
    }
  }

  const handleSort = (evt) => {
    setSortField(evt.sortField)
    setSortOrder(evt.sortOrder)
  }

  const salvarePlaylist = async () => {
    if (playlistId === 'new') {
      await fetch('/playlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playlist),
      })
    } else {
      await fetch(`/playlists/${playlistId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playlist),
      })
    }
    setVizibilitateForm(false)
    setPageCount(0)
  }

  const stergerePlaylist = async () => {
    if (playlistId !== 'new' && playlistId) {
      const response = await fetch(`/playlists/${playlistId}`, {
        method: 'DELETE',
      })
      if (response.status === 204) {
        alert(`Record has been deleted!`)
      }
    }
  }

  const handlerEditare = (rowData) => {
    setPlaylistId(rowData.id)
    setPlaylist(rowData)
    setVizibilitateForm(true)
  }

  const handlerStergere = (rowData) => {
    setPlaylistId(rowData.id)
    stergerePlaylist()
  }

  const columnButtons = (rowData) => {
    return (
      <>
        <div
          className="bg-gray-500 text-3xl p-2 flex"
          style={{ float: 'right' }}
        >
          <a
            className="no-underline text-white"
            href={`#/playlists/${playlistId}`}
            onClick={() => setPlaylistId(rowData.id)}
          >
            Songs of Playlist
          </a>
        </div>

        <Button
          label="Delete"
          style={{ float: 'right' }}
          className="flex p-button mr-3 p-button-danger"
          onClick={() => handlerStergere(rowData)}
        />
        <Button
          label="Edit"
          style={{ float: 'right' }}
          className="flex p-button-secondary mr-3 text-gray-900 bg-teal-500"
          onClick={() => handlerEditare(rowData)}
        />
      </>
    )
  }
  const handlerAdaugare = () => {
    setPlaylistId('new')
    setPlaylist('')
    setVizibilitateForm(true)
  }

  const handlePageChange = (evt) => {
    setPage(evt.page)
    setFirst(evt.page * 2)
  }

  function set(property, value) {
    const record = { ...playlist }
    record[property] = value
    setPlaylist(record)
  }

  return (
    <div>
      <div className="flex justify-content-center">
        <h1 className="text-cyan-600">Filters:</h1>
        <Dropdown
          value={filter1}
          options={filtre}
          onChange={(e) => setFilter1(e.value)}
          optionLabel="name"
          filter
          filterBy="name"
          placeholder="Select filter1"
        />
        <Dropdown
          value={filter2}
          options={filtre}
          onChange={(e) => setFilter2(e.value)}
          optionLabel="name"
          filter
          filterBy="name"
          placeholder="Select filter2"
        />
        <Button
          label="Clear"
          icon="pi pi-filter"
          className="p-button-rounded p-button-text p-button-plain"
          onClick={() => handlerClearFilter()}
        />
      </div>

      <div className="mt-5">
        <h1 className="inline text-cyan-600">You have {count} playlists:</h1>
        <Button
          label="Add Playlist"
          style={{ float: 'right' }}
          className="flex surface-500 font-bold text-gray-900 m-2"
          onClick={() => handlerAdaugare()}
        />
      </div>

      <DataTable
        className="mt-3"
        value={playlists}
        selection={playlist}
        selectionMode="radiobutton"
        onSelectionChange={(e) => setPlaylist(e.value)}
        paginator
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        rowsPerPageOptions={[2, 5, 10, 20]}
        onPageChange={handlePageChange}
        first={first}
        rows={2}
        totalRecords={count}
        removableSort
        onSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
      >
        <Column header="Id" field="id" sortable />
        <Column header="Description" field="description" sortable />
        <Column header="Date Created" field="dateCreated" sortable />
        <Column body={columnButtons} />
      </DataTable>

      <Dialog
        style={{ height: '25rem' }}
        header="Playlist Form"
        visible={vizibilitateForm}
        onHide={() => setVizibilitateForm(false)}
      >
        <div>
          <InputText
            className="mt-5"
            placeholder="description"
            onChange={(e) => set('description', e.target.value)}
            value={playlist.description}
          />
        </div>
        <div>
          <InputText
            className="mt-5"
            placeholder="Date Created"
            onChange={(e) => set('dateCreated', e.target.value)}
            value={playlist.dateCreated}
          />
        </div>
        <div className="w-10">
          <Button
            label="Save"
            className="p-button-success bg-teal-500 mt-5 w-15rem"
            onClick={() => salvarePlaylist()}
          />
        </div>
      </Dialog>
    </div>
  )
}

export default Playlists
