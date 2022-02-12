import Sequelize from 'sequelize'

const connection = new Sequelize({
  dialect: 'sqlite',
  storage: './DBplaylist.db',
})

const Playlist = connection.define('playlist', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: 3,
    },
  },
  dateCreated: {
    type: Sequelize.DATE,
    allowNull: false,
  },
})

const Song = connection.define('song', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: 5,
    },
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isUrl: true,
    },
  },
  styleOfMusic: {
    type: Sequelize.ENUM,
    allowNull: false,
    values: ['POP', 'ROCK', 'HIP-HOP'],
  },
})

Playlist.hasMany(Song, { foreignkey: 'playlistId' })
Song.belongsTo(Playlist, { foreignkey: 'playlistId' })

async function initialize() {
  await connection.authenticate()
  await connection.sync()
}

export { initialize, Playlist, Song }
