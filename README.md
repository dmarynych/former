Former.js
====

Former simplifies common tasks in forms development:
* Simple and clean form fields initialisation.
* Event handlers
* From validation, with stantard api

As an example we will create form with this fields:
* Title - when this field loses focus or user hits enter, we will ask google search api, with given keyword, and display first found image.
* Category - select list, styled with [Select2 jQuery plugin](http://ivaynberg.github.com/select2). It will contain 2 categories - First and Second. If user selects First - title becomes required, if Second - title is not required.

Let's look, how Former helps create this form:

Form HTML
~~~
<form id="form">
    <input name="title" type="text" required />
	<select name="category">
		<option value="1">First</option>
		<option value="2">Second</option>
    	</select>
	<input name="title" type="file" />
</form>
~~~

Form inititalisation
~~~
var form = new Former('#form_id', {
    // Category select box
    category: function(input) {
        $(input).select2();
    }
});
~~~

You can subscribe to any event, that will happen inside form, in simple way.
Subscribing on select box change, then toggling required state of title
~~~
form.on('category:change', function(input, form) {
    if(input.value == 1) {
    	form.getInput('title').attr('required', 'required');
    }
    else {
        form.getInput('title').removeAttr('required');
    }
});
~~~


Subscribing on two events - blur and hitting enter, on title field, separated by space. 
Then search in google, for entered query.
~~~
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

                img = $('<img />').attr('src', result.unescapedUrl);

                $('#image_container').html(img);
                $('#form_image').fadeIn();
            }
        }
    });
}, false);
~~~


Form submit handler
~~~
form.on('submit', function(element, form) {
    console.log(form.getData());
});
~~~


Validation handler
~~~
form.on('invalid', function(element, form) {
    var err_inputs = form.element.find(':invalid');

    $(err_inputs).parents('.control-group:first').addClass('error');
}, false);
~~~


Of course you can subscribe to validation error, in specific field in form
~~~
form.on('title:invalid', function(element, form) {
    console.log('title is invalid')
}, false);
~~~


