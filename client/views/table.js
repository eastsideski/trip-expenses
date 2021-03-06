Session.setDefault('showAll',true);

Template.table.allexpenses = function(){
  return Session.get('showAll') ? 
    Expenses.find({trip:Session.get('currentTrip')} ) :
    Expenses.find({trip:Session.get('currentTrip'), $or: [{payer: Meteor.userId()}, {owers: Meteor.userId()}]});
};
Template.table.showAll = function(){
  return Session.get('showAll');
}
Template.table.events({
  'click #showMore' : function(e){
    Session.set('showAll',true);
    e.preventDefault();
  },
  'click #showLess' : function(e){
    Session.set('showAll',false);
    e.preventDefault();
  }
});

Template.expenseRow.owersList = function(){
  var trip = Trips.findOne(Session.get('currentTrip'));
  var numUsers = Meteor.users.find({_id : {$in : trip.members}}).count();
  if (this.owers.length == numUsers){
    return 'Everyone'
  } else if(numUsers > 3 && this.owers.length == (numUsers-1)){
    var missing = Meteor.users.findOne({_id : {$nin: this.owers }});
    return 'Everyone except ' + getUsername(missing._id);
  } else if(numUsers > 4 && this.owers.length == (numUsers-2)){
    var missing = Meteor.users.find({_id : {$nin: this.owers }}).fetch();
    return 'Everyone except ' + getUsername(missing[0]._id) + ' and ' + getUsername(missing[1]._id);
  } else {
    var usernames = this.owers.map(getUsername);
    return usernames.join(', ');
  }
};
Template.expenseRow.events({
  'click .owersList' : function(e,template){
    template.find('.owersList').style.display="none";
    template.find('.editform').style.display="block";
  },
  'click .saveowers' : function(e,template){
    var owers = template.findAll('input:checked').map(function(){
      return this.value;
    }).toArray();
    if (owers.length == 0){
      return;
    }

    template.find('.owersList').style.display="block";
    template.find('.editform').style.display="none";

    Expenses.update(this._id, {$set: {owers: owers}});
  },
  'click .icon-remove' : function (e) {
    Expenses.remove(this._id);
    e.preventDefault();
  }
});
