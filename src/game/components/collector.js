const _ = require('lodash')

module.exports = {
  collector: {
    requires: ['position'],

    effects: {
      collectResource: (data, state, game, send) => {
        const collectorId = state.id
        const resource = getEntitiyFromPos({
          collectorId: collectorId,
          x: state.position.x,
          y: state.position.y
        }, game)

        if (resource) {
          send('game:deleteEntity', {
            data: { id: resource.id }
          }, _.noop)
        }

        return {}
      }
    }
  }
}

function getEntitiyFromPos ({ collectorId, x, y }, state) {
  return _.find(state.entities, (entity) => {
    return (entity.id !== collectorId &&
        entity.position.x === x &&
        entity.position.y === y) &&
        entity.collectable
  })
}
