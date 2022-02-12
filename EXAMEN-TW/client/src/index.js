import React from 'react'
import ReactDOM from 'react-dom'
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Start from './components/Start'
import Songs from './components/Songs'

ReactDOM.render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<Start />} />
      <Route path="/playlists/:playlistId" element={<Songs />} />
    </Routes>
  </HashRouter>,
  document.getElementById('root'),
)
