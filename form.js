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
        var event, element_name,
            ev_parts, ev_type, ev_subtype, ev_callback,
            key_code,
            key_refs = {
                enter: 13
            };

        if (!callback) return this;

        if(!bubble) bubble = true;

        events = events.split(',');

        while (event = events.shift()) {
            event = event.trim();
            ev_parts = event.split(':');

            if(ev_parts.length === 0) continue;

            if( ev_parts.length === 1) {
                ev_type = ev_parts[0];
                form_element.on(ev_type, function(e) {
                    callback(this, that);

                    e.stopPropagation();
                    return false;
                });
            }
            else if( ev_parts.length > 1) {
                element_name = ev_parts[0];
                ev_type = ev_parts[1];

                if(ev_type === 'keyup') {
                    if( ev_parts.length > 2) {
                        key_code = ev_parts[2];
                    }
                    ev_callback = function(e) {
                        if(e.keyCode == key_code || e.keyCode === key_refs[key_code]) {
                            callback(this, that);

                            if(bubble === false) {
                                e.stopPropagation();
                            }
                        }
                    };
                }
                else {
                    ev_callback = function(e) {
                        callback(this, that);

                        if(bubble === false) {
                            e.stopPropagation();
                        }
                    };
                }

                // binding on <form> element, to be sure that event will be triggered in all cases,
                // even when for moment of binding, element doesnt exist, but later will.
                form_element.on(ev_type, '[name='+ element_name +']', ev_callback);
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