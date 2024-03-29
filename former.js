var Former = function(selector, config) {
    var form_element = $(selector),
        fields = {},
        that = this;

    this.element = form_element;
    this.inputs = form_element.find('input, select, textarea');

    this.inputs.each(function(k, el) {
        var $el = $(el),
            name = $el.attr('name'),
            tag_name = $el.prop('tagName');

        fields[name] = $el;

        $el.on('invalid', function(e) {
            $(e.target).parents('form').trigger('invalid', e);

            e.stopPropagation();
            return false;
        });

        if(config[name] && $.isFunction(config[name]) ) {
            config[name](el);
        }
    });


    this.on = function(events, callback, bubble) {
        var $el, event, field_handler, form_handler, key_checker, bind_element,
            ev_parts, ev_type, ev_subtype, ev_callback,
            element_name,
            key_code,
            key_refs = {
                enter: 13
            };


        if (!callback) {
            return this;
        }

        if(!bubble) {
            bubble = true;
        }

        events = events.split(/\s+/);


        // Defining all callbacks outside loop
        form_handler = function(ev_type, callback) {
            return function(e) {console.log(e);
                callback(this, that);

                e.stopPropagation();
                return false;
            };
        };
        field_handler = function(ev_type, callback, checkers) {
            return function(e) {
                // var, for checking if callback should be triggered
                var run = true;
                if( checkers && $.isArray(checkers) ) {
                    run = true;
                    $.each(checkers, function(k, v) {
                        // if one of checkers returns false - callback will not be ran
                        // and exiting loop
                        if( v(e) !== true ) {
                            run = false;
                            return false;
                        }
                    });
                }

                // if field doesnt pass validation - event is not triggered
                if($(e.target).is(':invalid')) {
                    run = false;
                }

                if( run === true ) {
                    callback(this, that);
                    if(bubble === false) {
                        e.stopPropagation();
                        return false;
                    }
                }
            };
        };
        key_checker = function(key_code) {
            return function(e) {
                return e.keyCode === key_code;
            };
        };

        while(event = events.shift()) {
            event = event.trim();
            ev_parts = event.split(':');

            if(ev_parts.length > 0) {
                if( ev_parts.length === 1) {
                    ev_type = ev_parts[0];

                    form_element.on(ev_type, form_handler(ev_type, callback));
                }
                else {
                    element_name = ev_parts[0];
                    ev_type = ev_parts[1];
                    $el = form_element.find('[name='+ element_name +']');

                    // if we have 3 event params
                    if(ev_parts.length > 2) {
                        // if its key event - we probably have subtype - key, to watch
                        if( $.inArray(ev_type, ['keyup', 'keypress', 'keydown']) !== -1 ) {
                            key_code = key_refs[ev_parts[2]] || ev_parts[2];
                            key_code = parseInt(key_code, 10);

                            form_element.on(
                                ev_type,
                                '[name='+ element_name +']',
                                field_handler(ev_type, callback, [key_checker(key_code)]));
                        }
                        else {
                            $el.on(ev_type, field_handler(ev_type, callback));
                        }
                    }
                    else {
                        $el.on(ev_type, field_handler(ev_type, callback));
                    }
                }
            }
        }

        return this;
    };

    this.getData = function() {
        /*var values = {},
            jqvals;

        jqvals = form_element.serializeArray();
        $.each(jqvals, function(k, v) {
            values[v.name] = v.value;
        });*/

        return form_element.serializeArray();
    };

    this.getInput = function(name) {
        return this.inputs.filter('[name='+ name +']');
    };
};




$.each( ['invalid'], function( i, name ) {
    $.fn[ name ] = function( data, fn ) {
        if ( fn === null ) {
            fn = data;
            data = null;
        }

        return arguments.length > 0 ?
            this.bind( name, data, fn ) :
            this.trigger( name );
    };
});

