var CHARGING_ERRORS;
var PIX_ERRORS;
var AUTO_COMPLETE;

loadJSONCharging(response => {
    CHARGING_ERRORS = JSON.parse(response);
});

loadJSONPix(response => {
    PIX_ERRORS = JSON.parse(response);
});

const initialAutocomplete = CHARGING_ERRORS.map(elem => elem.code);
setAutocomplete('#erro', '#erros_complete', initialAutocomplete);

$('input[name="checkAPI"]').change((event) => {
    $("#endpoints").html(" ");
    $("#message").html(" ");
    $("#solve").addClass("d-none");
    $("#erros_complete").addClass("invisible");
    $("#erros_complete").html('');

    changeAutocomplete()

});


$("#opcao").change((event) => {
    $("#endpoints").html(" ");
    $("#message").html(" ");
    $("#solve").addClass("d-none");
    $("#erros_complete").addClass("invisible");
    $("#erros_complete").html('');

    changeAutocomplete();

});

$("#downloadArq").click(event => {
    if ($("#checkCobranca")[ 0 ].checked) {
        window.open('./assets/db/erros_cobrancas.json', "_blank");
    } else {
        window.open('./assets/db/erros_pix.json', "_blank");
    }

});

function searchError() {
    active = -1;
    $("#endpoints").html(" ");
    $("#message").html(" ");
    $("#solve").addClass("d-none");
    $("#erros_complete").addClass("invisible");
    $("#erros_complete").html('');

    let error = null;

    if ($("#checkCobranca").prop("checked")) {
        $("#message").removeClass("d-none");
        if ($("#opcao").val() === 'code') {
            error = findError('code');
        } else {
            error = findError('message');
        }
        insertMessage(error);
        if (error != null || error != undefined) {
            if (Array.isArray(error.endpoints)) {
                if (error.endpoints.length) {
                    completeTableEndpoint(error);
                } else {
                    completeTableEndpointEmpty();
                }
            } else {
                completeTableEndpointAll(error);
            }
        }
        buttonSolution(error);
    } else {
        let accordion = $("<div />", {
            id: 'accordionEndpoints',
            class: 'accordion',
        });

        if ($("#opcao").val() === 'code') {
            error = findError('code');
        } else {
            error = findError('message');
        }
        insertMessage(error);

        if (error != null || error != undefined) {
            if (Array.isArray(error.erro)) {
                createBadge("Lista de possíveis falhas");
                $("#endpoints").append(accordion);
                error.erro.forEach((elem, index) => {
                    completeTableEndpointPix(elem, index);
                })
            } else {
                if (Array.isArray(error.endpoints)) {
                    if (error.endpoints.length) {
                        completeTableEndpoint(error);
                        buttonSolution(error);
                    } else {
                        completeTableEndpointEmpty();
                        buttonSolution(error);
                    }
                }
            }
        }
    }
}

function buttonSolution(error, div = '#endpoints') {
    if (error != null || error != undefined) {


        //        <article class="">
        let divCenter = $("<div />", {
            class: 'd-flex justify-content-center',
        });

        let buttonSolution = $("<button />", {
            id: 'solve',
            class: 'btn btn-success',
            html: 'Solução'
        });

        $(buttonSolution).click(() => clickButtonSolution(error));
        $(divCenter).append(buttonSolution);
        $(div).append(divCenter);

    }
}

function clickButtonSolution(error) {
    Swal.fire({
        title: 'Como podemos resolver?',
        html:
            error.solve,
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: '#198754',
        cancelButtonColor: '#b50000',
        confirmButtonText: '😄',
        cancelButtonText: '😟'
    }).then((result) => {
        if (result.dismiss === 'cancel') {
            Swal.fire({
                title: 'A solução não te ajudou?',
                html:
                    'Caso a resposta não tenha solucionado sua dúvida <br/>' +
                    'Você pode entrar em contato com o time tecnico da Gerencianet através da nossa comunidade<br/><br/><br/>' +
                    '<a href="https://discord.com/invite/ptGHMtczcV" target="_blank">' +
                    '<button type="button" class="btn btn-primary">' +
                    '<b>Discord Gerencianet</b> <i class="fab fa-discord"></i>' +
                    '</button></a>',
                showConfirmButton: false,
                icon: 'warning',
                footer: '<a href="https://gerencianet.com.br/fale-conosco/" target="_blank"><button type="button" class="btn btn-outline-warning btn-sm">Abra um ticket &nbsp;&nbsp;<i class="fas fa-ticket-alt"></i></button></a>',

                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                }
            })
        }
    });
}

function insertMessage(error) {
    let card = $("<div />", {
        id: 'card',
        class: 'card shadow-sm p-3 mb-3 bg-body rounded',
    });
    let cardBody = $("<div />", {
        id: 'cardBody',
        class: 'cardBody',
    });
    let cardCode;
    let cardMessage

    $("#message").append(card);
    $("#card").append(cardBody);
    if (error != null || error != undefined) {

        if (error.code != null || error.code != undefined) {
            cardCode = $("<h5 />", {
                id: 'cardCode',
                class: 'card-title ps-2',
                html: 'Código: ' + error.code
            });
            $("#cardBody").append(cardCode);
        }

        if (error.message != null || error.message != undefined) {
            cardMessage = $("<h6 />", {
                id: 'cardMessage',
                class: 'card-subtitle  text-muted ps-2',
                html: 'Mensagem: ' + error.message
            });
        }

    } else {
        cardMessage = $("<h6 />", {
            id: 'cardMessage',
            class: 'card-subtitle text-muted ps-2',
            html: 'Nenhum error encontrado!'
        });
    }



    $("#cardBody").append(cardMessage);
}

function findError(field) {
    if ($("#checkCobranca")[ 0 ].checked) {
        return CHARGING_ERRORS.find(elem => elem[ field ] == ($("#erro").val()));
    }
    if (field === 'message') {
        return PIX_ERRORS.map(erros => erros.erro).reduce((acc, cur) => acc.concat(cur), []).find(elem => elem[ field ] == ($("#erro").val()));
    }
    return PIX_ERRORS.find(elem => elem[ field ] == ($("#erro").val()));

}

function completeTableEndpointPix(error, pos) {

    let accordionItem = $("<div />", {
        class: 'accordion-item',
    });

    let accordionHeader = $("<h6 />", {
        id: 'accordionHeader' + pos,
        class: 'accordion-header',
    });

    let accordionButton = $("<button />", {
        class: 'accordion-button collapsed',
        type: 'button',
        html: error.message
    });
    accordionButton.attr("data-bs-toggle", "collapse");
    accordionButton.attr("data-bs-target", "#collapse" + pos);
    accordionButton.attr("aria-expanded", false);
    accordionButton.attr("aria-controls", "collapse" + pos);

    $(accordionHeader).append(accordionButton);
    $(accordionItem).append(accordionHeader);


    let accordionOpen = $("<div />", {
        id: 'collapse' + pos,
        class: 'accordion-collapse collapse',
    });
    accordionOpen.attr("aria-labelledby", "accordionHeader" + pos);
    accordionOpen.attr("data-bs-parent", "#accordionEndpoints");

    let accordionBody = $("<div />", {
        class: 'accordion-body',
    });


    error.endpoints.forEach((endpoint, index) => {
        let divEndpoint = $("<div />", {
            id: 'endpointResponse-' + pos + '-' + index,
            class: 'gn-endpoint',
        });

        $(accordionBody).append(divEndpoint);

        let http = $("<span />", {
            class: 'http-method ' + endpoint.method,
        });
        http[ 0 ].innerHTML = endpoint.method;

        $(divEndpoint).append(http);

        let endpointRoute = $("<span />", {
            class: 'endpoint'
        });
        endpointRoute[ 0 ].innerHTML = endpoint.route;

        $(divEndpoint).append(endpointRoute);
    });

    buttonSolution(error, accordionBody);

    $(accordionOpen).append(accordionBody);
    $(accordionItem).append(accordionOpen);
    $("#accordionEndpoints").append(accordionItem);


}

function completeTableEndpoint(error) {

    createBadge();

    error.endpoints.forEach((endpoint, index) => {

        let divEndpoint = $("<div />", {
            id: 'endpointResponse-' + index,
            class: 'gn-endpoint',
        });

        $("#endpoints").append(divEndpoint);

        let http = $("<span />", {
            class: 'http-method ' + endpoint.method,
        });
        http[ 0 ].innerHTML = endpoint.method;

        $("#endpointResponse-" + index).append(http);

        let endpointRoute = $("<span />", {
            class: 'endpoint'
        });
        endpointRoute[ 0 ].innerHTML = endpoint.route;

        $("#endpointResponse-" + index).append(endpointRoute);
    });
}

function createBadge(mensagem = "Lista de possíveis endpoints") {
    let titleEndpoint = $("<h5 />", {
        id: 'titleEndpoint',
        class: 'card-title ps-4 mb-3',
        html: mensagem
    });

    $("#endpoints").append(titleEndpoint);
}

function completeTableEndpointEmpty() {
    $('<div>', {
        id: 'endpointResponse',
        class: 'gn-endpoint',
    }).appendTo('#endpoints');

    $('<span>', {
        class: 'endpoint',
        html: "Erro não derivado da API"
    }).appendTo('#endpointResponse');
}

function completeTableEndpointAll(error) {

    $('<div>', {
        id: 'endpointResponse',
        class: 'gn-endpoint ',
    }).appendTo('#endpoints');

    $('<span>', {
        class: 'endpoint ',
        html: error.endpoints
    }).appendTo('#endpointResponse');
}

function changeAutocomplete() {
    $("#endpoints").html(" ");
    $("#message").html(" ");
    $("#erro").val("");
    $("#message").removeClass("edge-error");

    if ($("#checkCobranca")[ 0 ].checked) {
        if ($("#opcao").val() === 'code') {
            AUTO_COMPLETE = CHARGING_ERRORS.map(elem => elem.code);
        } else {
            AUTO_COMPLETE = CHARGING_ERRORS.map(elem => elem.message);
        }
    } else {
        if ($("#opcao").val() === 'code') {
            AUTO_COMPLETE = PIX_ERRORS.map(elem => elem.code);
        } else {
            AUTO_COMPLETE = PIX_ERRORS.map(erros => erros.erro).reduce((acc, cur) => acc.concat(cur), []).map(elem => elem.message);
        }
    }
    active = -1;
    setAutocomplete('#erro', '#erros_complete', AUTO_COMPLETE);
}


function loadJSONCharging(callback) {
    const xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', "./assets/db/erros_cobrancas.json", false);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function loadJSONPix(callback) {
    const xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', "./assets/db/erros_pix.json", false);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}
