import express from 'express'
import { Playlist, Song } from './tabels.mjs'
import {
  getRecord,
  getRecords,
  postRecord,
  putRecord,
  deleteRecord,
  deleteRecords,
} from './functions.mjs'

const router = express.Router()

router
  .route('/playlists')
  .get(async (request, response) => getRecords(Playlist, request, response))
  .post(async (request, response) => postRecord(Playlist, request, response))
  .delete(async (request, response) =>
    deleteRecords(Playlist, request, response),
  )
router
  .route('/playlists/:id')
  .get(async (request, response) => getRecord(Playlist, request, response))
  .put(async (request, response) => putRecord(Playlist, request, response))
  .delete(async (request, response) =>
    deleteRecord(Playlist, request, response),
  )

router
  .route('/songs')
  .get(async (request, response) => getRecords(Song, request, response))
  .post(async (request, response) => postRecord(Song, request, response))
  .delete(async (request, response) => deleteRecords(Song, request, response))
router
  .route('/songs/:id')
  .get(async (request, response) => getRecord(Song, request, response))
  .put(async (request, response) => putRecord(Song, request, response))
  .delete(async (request, response) => deleteRecord(Song, request, response))

export default router
