
$(function () {
    $('a').click(function() {
        $('#form_modal').modal();

        return false;
    });
});

var form = new Form('#form', {
    // init input [name=title]
    'file': function(input) {
        $(input).uploadifive({
            'uploadScript': 'upload url here...',
            'dnd'          : true,
            'buttonText': 'or Upload File',
            'onUploadComplete': function(file, d) {

            }
        });
    },
    'category': function(input) {
        $(input).select2();
    }
});

form.on('category:change', function(input, form) {
    if(input.value == 1) {
        form.getInput('title').removeAttr('required');
    }
    else {
        form.getInput('title').attr('required', 'required');
    }
});
// вешаем обработчик на 2 события: уход фокуса с инпута и нажатие энтера
form.on('title:blur title:keyup:enter', function(element) {
    var value, $el, search_url;

    $el = $(element);
    value = $el.val();

    search_url = 'https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q='+ value +'&rsz=1';

    $.ajax({
        url: search_url,
        dataType: 'jsonp',
        success: function(d) {
            var img, result;

            if( d.responseData.results && d.responseData.results !== 0 ) {
                result = d.responseData.results[0];

                img = $('<img />')
                    .attr('src', result.unescapedUrl);

                $('#image_container').html(img);
                $('#form_image').fadeIn();
            }
        }
    });
}, false);

form.on('submit', function(element, form) {
    console.log(form.getData());
});

form.on('invalid', function(element, form) {
    var err_inputs = form.element.find(':invalid');

    $(err_inputs).parents('.control-group:first').addClass('error');
}, false);