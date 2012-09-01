$(function() {
    $('a').click(function() {
        $('#form_modal').modal();
    });
});

var form = new Form('#form', {
    // init input [name=title]
    'file': function(element) {
        $(element).uploadifive({
            'uploadScript': 'upload url here...',
            'dnd'          : true,
            'buttonText': 'or Upload File',
            'onUploadComplete': function(file, d) {

            }
        });
    },
    'category': function(element) {
        $(element).select2();
    }
});

// вешаем обработчик на 2 события: уход фокуса с инпута и нажатие энтера
form.on('title:blur, title:keyup:13', function(element) {
    var value, $el, search_url;

    $el = $(element);
    value = $el.val();

    search_url = 'https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q='+ value +'&rsz=1';

    $.ajax({
        url: search_url,
        dataType: 'jsonp',
        success: function(d) {
            var images, image, result;

            if( d.responseData.results && d.responseData.results !== 0 ) {
                images = d.responseData.results;
                result = images[0];

                image = $('<img />')
                    .attr('src', result.unescapedUrl)
                    .attr('title', result.titleNoFormatting)
                    .data('image_index', 0);

                $('#image_container').html(image);
                $('#form_image').fadeIn();
            }
        }
    });
}, false);

form.on('submit', function(element, form) {
    console.log(form.getValues());
});