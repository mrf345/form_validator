// Dependencies: jQuery, jQuery-UI

var formValidator = function (options={}, callback=function () {}) {
    rFormValidator = {} // object to return

    rFormValidator.options = {
        formIds: options.formIds || ['#formValidator'],
        inputIds: options.inputIds || [['#validEmail']],
        texts: options.texts || [['Please enter a valid email']], // message to display if validator is false
        textClass: options.textClass || '',
        textStyle: options.textStyle || {'color': 'black'},
        duration: options.duration * 1000 || 3000,
        validators: options.validators || [[function (data) {
            return false
        }]], // function to check data and validate by returning true false
        before: options.before || [['false']] // where the text message will be appended. Before or after the input.
    }
    
    rFormValidator.loops = {} // to store animate intervals
    rFormValidator.text = {}
    rFormValidator.options.formIds.forEach(function (f, fIndex) {
        rFormValidator.options.inputIds[fIndex].forEach(function (i, iIndex) {
            rFormValidator.text[i] = $('<p>').addClass(rFormValidator.options.textClass + ' ' + i.slice(1))
            .css(Object.assign({'cursor': 'pointer'}, rFormValidator.options.textStyle)).text(rFormValidator.options.texts[fIndex][iIndex])
            .click(function () {
                clearInterval(rFormValidator.loops[i])
                $(rFormValidator.text[i]).remove()
            })
        })
    })

    rFormValidator.__effect__ = function (id) {
        var toFormEffect = function () {
            $(rFormValidator.text[id]).stop(true)
            .animate({'opacity': '0'}, rFormValidator.options.duration / 2)
            .animate({'opacity': '1'}, rFormValidator.options.duration / 2)
        }
        toFormEffect()
        rFormValidator.loops[id] = setInterval(toFormEffect, rFormValidator.options.duration * 2)
    }

    rFormValidator.__exit__ = function () {
        Object.keys(rFormValidator.loops).forEach(function (l) {
            clearInterval(rFormValidator.loops[l])
        })
    }

    rFormValidator.__init__ = function () {
        rFormValidator.options.formIds.forEach(function (f, fIndex) {
            $(f).submit(function (event) {
                rFormValidator.options.inputIds[fIndex].forEach(function (i, iIndex) {
                    if (!rFormValidator.options.validators[fIndex][iIndex]($(i).val())) {
                        event.preventDefault()
                        if (rFormValidator.options.before[fIndex][iIndex] === 'true') $(i).before(rFormValidator.text[i])
                        else $(i).after(rFormValidator.text[i])
                        rFormValidator.__effect__(i)
                        callback()
                    }
                })
            })
        })
    }

    if (document.readyState === 'complete') rFormValidator.__init__()
    else $(rFormValidator.__init__) // jQuery onload

    return rFormValidator // returning object for debugging 
}