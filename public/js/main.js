const urlForm = $('#url-form');
const shortUrl = $('#short-url');
const shortUrlLabel = $('#short-url-label');

urlForm.submit(function(e) {
    e.preventDefault();
    shortUrlLabel.fadeOut();
    $.ajax({
        url: '/shorten',
        method: 'POST',
        data: urlForm.serialize()
    })
    .done(res => {
        shortUrl.attr('href', window.location.href + 'short/' + res.path);
        shortUrl.html(window.location.href + 'short/' + res.path);
        shortUrlLabel.fadeIn();
    })
    .fail(function() {
        alert('There was an error while shortening your URL');
    });
});
