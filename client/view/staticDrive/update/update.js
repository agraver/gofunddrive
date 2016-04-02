Template.update.helpers({
  timeAgo: function(createdAt) {
    return moment(createdAt).fromNow();
  }
});
