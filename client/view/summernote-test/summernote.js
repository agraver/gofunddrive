Template.summernoteTest.rendered = function(){
  console.log("summernoteTest template created");
  $(document).ready(function() {
    $('#summernote').summernote({ airMode: false });
  });
};
