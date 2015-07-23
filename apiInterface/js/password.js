$('#password-form').submit(function(event) {
  event.preventDefault();
  var password = $('#password-input').val();
  /* rest of this code attempts to download the file using the password provided by the user */
  $('#downloadFrame').remove();
  //invisible iframe to trigger file download
  $('body').append('<iframe id="downloadFrame" style="display:none"></iframe>');
  $('#downloadFrame').load(window.location.href, 'password=' + password, function(response, status, xhr) {
    if (xhr.status === 400) {
      alert('Wrong password! Please try again.');
    }
    else {
    $('#downloadFrame').attr('src', window.location.href + '?password=' + password);
    }
  });
});