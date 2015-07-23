$('#upload-form').submit(function(event) {
  event.preventDefault();
  var password = $('#password-input').val();

  //use formdata class to create form for upload
  var data = new FormData();
  data.append('userFile', $('#file-input')[0].files[0]);
  if (password){
    data.append('password', password);
  }

  //multipart ajax call to upload file
  $.ajax({
    url: '/api/upload',
    data: data,
    cache: false,
    contentType: false,
    processData: false,
    enctype: 'multipart/form-data',
    type: 'POST',
    success: function(data){
      $('#file-url').remove();
      $('body').append('<a id="file-url"></a>');
      var urlMessage = 'The link to your file is: ' + window.location.href + 'api/' + data.uploadId;
      $('#file-url').text(urlMessage);
      $('#file-url').attr('href', window.location.href + 'api/' + data.uploadId);
    }
  });
});