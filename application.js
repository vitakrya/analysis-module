// Model

var Item = Backbone.Model.extend({

});

// Collection

var ItemsList = Backbone.Collection.extend({
  model: Item,
  localStorage: new Backbone.LocalStorage('items')
});

var itemsList = new ItemsList();

// Views

var ItemView = Backbone.View.extend({
  tagName: 'li',
  template: _.template(jQuery('#item-template').html()),
  events: {
    'click button' : 'deleteItem',
    'dblclick' : 'toggleEdit',
    'keypress input' : 'updateItem'
  },
  render: function(){
    this.$el.html(this.template(this.model.toJSON()));
    this.$input = this.$el.find('input');
    return this;
  },
  initialize: function(){
    this.listenTo(this.model, 'destroy', this.remove);
    this.listenTo(this.model, 'change', this.render);
    return this;
  },
  deleteItem: function(){
    this.model.destroy();
  },
  toggleEdit: function(){
    if(this.$el.attr('class') == 'editable')
      {
        this.$el.removeClass('editable');
      }
    else 
      {
        this.$el.addClass('editable');
        this.$input.select();
      }
  },
  updateItem: function(e){
    if(e.which == 13) {
      this.model.save({'title': this.$input.val()});
      if(!this.$input.val().trim() == ""){
        this.toggleEdit();
      }
      else
      {
        alert("Error");
        this.$input.focus();
      }
    }
  }
});

var AppView = Backbone.View.extend({
  el: '#app',
  events: {
    "keypress input#title" : "createItem"
  },
  createItem: function(e){
    if(e.which == 13){
      if(!this.$input.val().trim() == "")
        itemsList.create({title: this.$input.val()});
      else
        alert('Error');
    }
  },
  initialize: function(){
    this.$input = this.$el.find('input');
    this.box = this.$el.find('ul');
    this.listenTo(itemsList, 'add', this.addItem);
    itemsList.fetch();
    return this;
  },
  addItem: function(item){
    var item_view = new ItemView({model: item});
    this.box.append(item_view.render().el);
    this.$input.val('');
  }
});

// Main

new AppView();