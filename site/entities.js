  var _ = require('underscore')
    , Eventable = require('primo-events')
    , MemoryCanvas = require('primo-canvas')
    , EntityPlaceTool = require('./entityplacetool')

  var Entities = function(editor) {
    Eventable.call(this)
    this.editor = editor
    this.canvas = new MemoryCanvas(50,50)
    this.$entities = $('#entity-selection')
    this.populateEntities()
    this.$entities.on('click', '.entity', _.bind(this.onEntitySelected, this))
  }
  Entities.prototype = {
    populateEntities: function() {
      for(var i in this.editor.engine.namedEntities) {
        this.onEntityReceived(i, this.editor.engine.namedEntities[i])
      }
    //  $.getJSON('/entities', _.bind(this.onEntitiesReceived, this))
    },
    onEntitiesReceived: function(entities) {
      for(var i =0 ; i < entities.length; i++) {
        this.loadEntity(entities[i].link)
      }
    },
    loadEntity: function(path) {

    },
    onEntityReceived: function(path, EntityType) {
      var blah = new EntityType('editor', {x: 0, y: 0}, this.editor.engine)
      this.canvas.setup(blah.width, blah.height)
      blah.render(this.canvas.context)
      var imageData = this.canvas.getImage()
      this.$entities.append(
        $('<img/>').attr('src', imageData)
                   .attr('width', 25)
                   .attr('height', 25)
                   .addClass('entity')
                   .data('tool', new EntityPlaceTool(
                     path,
                     EntityType
                   ))
      )
    },
    onEntitySelected: function(ev) {
      var $entity = $(ev.target)
      var tool = $entity.data('tool')
      this.$entities.find('img').removeClass('selected')
      this.$selectedentity = $entity
      this.$selectedentity.addClass('selected')
      this.editor.setActiveTool(tool)
    }
  }
  _.extend(Entities.prototype, Eventable.prototype)

  module.exports = Entities
