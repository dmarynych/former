var Form = function(selector, config) {
    var form_element = $(selector),
        inputs = form_element.find('input, select, textarea'),
        fields = {},
        that = this;

    inputs.each(function(k, el) {
        var $el = $(el),
            name = $el.attr('name'),
            tag_name = $el.prop('tagName');

        fields[name] = $el;

        if(config[name] && $.isFunction(config[name]) ) {
            config[name](el);
        }
    });


    this.on = function(events, callback, bubble) {
        var event, field_handler, form_handler, key_checker,
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

        events = events.split(',');


        // Defining all callbacks outside loop
        form_handler = function(ev_type, callback) {
            return function(e) {
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

                if( run === true ) {
                    callback(this, that);
                    if(bubble === false) {
                        e.stopPropagation();
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
                            form_element.on(ev_type, '[name='+ element_name +']', field_handler(ev_type, callback));
                        }
                    }
                    else {
                        form_element.on(ev_type, '[name='+ element_name +']', field_handler(ev_type, callback));
                    }
                }
            }

        }

        return this;
    };

    this.getValues = function() {
        var values = {},
            jqvals;

        jqvals = form_element.serializeArray();
        $.each(jqvals, function(k, v) {
            values[v.name] = v.value;
        });

        return values;
    };
};