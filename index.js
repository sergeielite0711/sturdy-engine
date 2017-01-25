const P2P_CONFIG = {
  hubUrl: 'http://localhost:8042'
}

const _ = require('lodash')
const choo = require('choo')
const assets = require('./lib/utils/assets')
const clock = require('./models/clock')()
const runtime = require('./models/runtime')()
const gameModel = require('./models/game')
const editorModel = require('./models/editor')
const level = require('./models/tutorial/index')
const client = require('./models/client')(P2P_CONFIG)
const presenter = require('./models/presenter')(P2P_CONFIG)

const app = choo()

app.model(clock.model)
app.model(runtime.model)
app.model(gameModel)
app.model(editorModel)
app.model(level)
app.model(client)
app.model(presenter)

app.use({ onStateChange: (state) => runtime.setState(state.game) })

clock.onTick((send) => {
  send('game:beginStep', {}, _.noop)
  send('runtime:step', {}, _.noop)
  send('game:completeStep', {}, _.noop)
})

app.router([
  ['/', require('./pages/overview')],
  ['/editor', require('./pages/editor')],
  ['/tutorial/:level', require('./pages/tutorial')],
  ['/presenter', require('./pages/presenter')]
])

assets.load({
  WATER_TILE: '../assets/img/tiles/water-tile.png',
  DIRT_TILE: '../assets/img/tiles/dirt-tile.png',
  GRASS_TILE: '../assets/img/tiles/grass-tile.png',
  PLAIN_TILE: '../assets/img/tiles/plain-tile.png',
  STONE_TILE: '../assets/img/tiles/stone-tile.png',
  GEM: '../assets/img/gem-blue.png',
  ROBOT_FRONT: '../assets/img/cyborg/cyborg-morty-front.png',
  ROBOT_LEFT: '../assets/img/cyborg/cyborg-morty-left.png',
  ROBOT_BACK: '../assets/img/cyborg/cyborg-morty-back.png',
  ROBOT_RIGHT: '../assets/img/cyborg/cyborg-morty-right.png',
  BASE: '../assets/img/base.png',
  TOWER: '../assets/img/tower.png'
}).then(() => {
  document.body.appendChild(app.start())
})
