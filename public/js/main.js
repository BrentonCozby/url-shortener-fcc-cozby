const urlForm = $('#url-form');
const shortUrl = $('#short-url');
const shortUrlLabel = $('#short-url-label');

urlForm.submit(function(e) {
    e.preventDefault();
    $.ajax({
        url: '/shorten',
        method: 'POST',
        data: urlForm.serialize()
    })
    .done(res => {
        shortUrl.html(res);
        shortUrlLabel.show();
    })
    .fail(function() {
        alert('There was an error while shortening your URL');
    });
});
