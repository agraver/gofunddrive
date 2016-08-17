displayError = function(errMsg) {
  $(".errorMessage").html(errMsg);
  $(".alert-danger").removeClass('hidden');
}

displayHelp = function(helpMsg) {
  $(".helpMessage").html(helpMsg);
  $(".alert-info").removeClass('hidden');
}
