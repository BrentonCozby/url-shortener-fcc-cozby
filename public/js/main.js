const urlForm = $('#url-form');
const shortUrl = $('#short-url');

urlForm.submit(function(e) {
    e.preventDefault();
    shortUrl.fadeOut();
    $.ajax({
        url: '/shorten',
        method: 'POST',
        data: urlForm.serialize()
    })
    .done(res => {
        shortUrl.attr('href', window.location.href + res.path);
        shortUrl.html(window.location.href + res.path);
        shortUrl.fadeIn();
    })
    .fail(function() {
        alert('There was an error while shortening your URL');
    });
});
