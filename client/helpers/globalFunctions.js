displayError = function(errMsg) {
  $(".errorMessage").html(errMsg);
  $(".alert-danger").removeClass('hidden');
}

displayHelp = function(helpMsg) {
  $(".helpMessage").html(helpMsg);
  $(".alert-info").removeClass('hidden');
}

$.validator.addMethod(
        "regex",
        function(value, element, regexp) {
            var re = new RegExp(regexp);
            return this.optional(element) || re.test(value);
        },
        "Please check your input."
);
