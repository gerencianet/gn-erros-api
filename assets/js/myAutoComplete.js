var active = -1;
var RESPONSE;
const startFrom = 1;
const countResults = 5
const KEYCODES = [ 13, 27, 38, 40 ];

$('#erro').keyup(event => {
    if (KEYCODES.includes(event.keyCode) && !$('#erros_complete').hasClass('invisible')) {
        if (event.keyCode === 13) {
            // Enter
            let childrens = $('#erros_complete').children().children();
            for (let i = 0; i < childrens.length; i++) {
                if ($($(childrens)[ i ]).children().hasClass('active')) {
                    $("#erro").val($(childrens).children()[ i ].id);
                    $('#erros_complete').addClass("invisible");
                    searchError();
                    break;
                }
            }
        } else if (event.keyCode === 38) {
            // Cima
            if (RESPONSE.length > 0) {
                active--;
                if (active < 0) {
                    if (RESPONSE.length >= countResults) {
                        active = countResults - 1;
                    } else {
                        active = RESPONSE.length - 1;
                    }
                    $($('#erros_complete').children().children().children()).removeClass('active');
                } else {
                    $($('#erros_complete').children().children()[ active + 1 ]).children().removeClass('active');
                }
                $($('#erros_complete').children().children()[ active ]).children().addClass('active');
            }

        } else if (event.keyCode === 40) {
            // Baixo
            if (RESPONSE.length > 0) {
                active++;
                if (active >= countResults) {
                    active = 0;
                    $($('#erros_complete')[ 0 ].children[ 0 ].children[ countResults - 1 ].children[ 0 ]).removeClass('active');
                } else if (active >= RESPONSE.length) {
                    active = 0;
                    $($('#erros_complete')[ 0 ].children[ 0 ].children[ RESPONSE.length - 1 ].children[ 0 ]).removeClass('active');
                }

                if (active > 0) {
                    $($('#erros_complete')[ 0 ].children[ 0 ].children[ active - 1 ].children[ 0 ]).removeClass('active');
                }
                $($('#erros_complete')[ 0 ].children[ 0 ].children[ active ].children[ 0 ]).addClass('active');

            }
        }
    }
});


function setAutocomplete(id_formfield, id_autocomplete_div, list) {
    $(id_formfield).keyup(event => {
        if (!KEYCODES.includes(event.keyCode)) {
            let text = event.target.value;
            RESPONSE = autoComplete(list, text);
            if (text.length >= startFrom) {
                render(RESPONSE, text, id_autocomplete_div, id_formfield, countResults);
            } else {
                $(id_autocomplete_div).addClass("invisible");
            }
        }
    });
}

function autoComplete(list, searchText) {
    return list.filter(item => item.toLowerCase().includes(searchText.toLowerCase()));
}

function render(results, search, container, form_id, maxResults) {
    $(container).html('');

    let form_width = $(form_id)[ 0 ].offsetWidth;
    $(container)[ 0 ].style.width = form_width.toString() + 'px';

    if (results.length > 0) {
        $(container).removeClass("invisible");
        let list = $("<ul />", {
            class: 'list-group'
        });

        $(container).append(list);

        for (let i = 0; i < maxResults && i < results.length; i++) {

            let a = $("<a />", {
                href: '#'
            });
            $(a).click(event => {
                event.preventDefault();
                event.stopPropagation();
                $(form_id)[ 0 ].value = results[ i ];
                $(container).addClass("invisible");

                searchError();
            })


            let item = $("<li />", {
                id: results[ i ],
                class: 'list-group-item list-index',
            });
            $(list).append(a);
            $(a).append(item);
            $(item).append(colorResult(results[ i ], search));
        }
    } else {
        $(container).addClass("invisible");
    }
}

function colorResult(result, textSearch) {
    let splitted = result.toLowerCase();

    let split = [];

    let span = "<span>";

    while (splitted.search(textSearch) !== -1) {
        let pos = splitted.search(textSearch);
        let normal = splitted.slice(0, pos);
        if (normal.length > 0) {
            split.push({
                text: normal,
                type: 'normal'
            });
        }
        let bold = splitted.slice(pos, pos + textSearch.length);
        split.push({
            text: bold,
            type: 'bold'
        });
        splitted = splitted.slice(pos + textSearch.length);
    }
    if (splitted.length > 0) {
        split.push({
            text: splitted,
            type: 'normal'
        });
    }
    split.forEach(elem => {
        if (elem.type === 'bold') {
            span += `<b>${elem.text}</b>`;
        } else {
            span += elem.text;
        }
    });
    span += `</span>`;
    return span;
}