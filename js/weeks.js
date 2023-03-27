var jsonWeeksData = '{"202323":{"year":2023,"numweek":23,"color":"#33aaff","description":"La semana que todos esperabamos","priority":1,"link":"https://www.uoc.edu/"},"202324":{"year":2023,"numweek":24,"color":"#aaaaff","description":"La semana siguiente","priority":4,"link":"https://www.google.com/"}}';
var weeksData = $.parseJSON( jsonWeeksData );

function emptyWeeks() {
    $('#week-list').empty();
}

function drawWeeks(weeks) {
    // vaciamos el html de semanas
    emptyWeeks();
    // insertamos las cards de semana
    $.each(weeks, function(index, week) {
        drawWeek(index,week);
    });
}

function drawWeek(index,week) {
    // construimos el card y popup eliminar de la semana y la inyectamos en el DOM
    $('<div class="col-sm-6 col-md-4 col-lg-3"><div class="card" style="background-color:'+week.color+'"><div class="card-body"><img src="img/default.png" class="card-img-top" alt="Image SEMANA '+index+'"><h3 class="card-title">'+week.year+'-'+week.numweek+'</h3><p class="card-text">'+week.description+'</p><a name="btn-eliminar-card-'+index+'" id="btn-eliminar-card-'+index+'" class="btn btn-danger" data-bs-toggle="modal" href="#eliminar-card-'+index+'" role="button">Eliminar</a><button name="" id="" class="btn btn-primary" onclick="drawModalWeek('+index+')">Ver</button><a class="btn btn-success" href="interfaz3.html?yearweek='+index+'" role="button">Ver tareas</a></div></div></div><div class="modal" tabindex="-1" id="eliminar-card-'+index+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">Eliminar Semana '+week.year+'-'+week.numweek+'</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body"><p>¿Estás seguro que quieres eliminar SEMANA '+week.year+'-'+week.numweek+'?</p></div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button><button type="button" onclick="removeWeek('+index+')" class="btn btn-primary">Sí</button></div></div></div></div>').appendTo('#week-list');
}


function drawModalWeek(index) {

    // inicializamos valores
    var week = new Object();
    week.year = '';
    week.numweek = '';
    week.color = '#cccccc';
    week.description = '';
    week.priority = '';
    week.link = '';
    var title = 'Añadir ';

    // si viene definido un indice de semana cargaos sus datos
    if( index && typeof weeksData[index] != 'undefined' ) {
        var week = weeksData[index];
        var title = 'Ver/Editar ';
    }

    // preparamos opciones de los select
        var selected = '';
        // numweek
        var options_numweek = '';
        for (var i=1; i<53; i++) {
            selected = '';
            if( i == week.numweek ){ 
                selected = 'selected'; 
            }
            options_numweek += '<option value='+i+' '+selected+'>'+i+'</option>';
        }
        // year
        var options_year = '';
        for (var i=new Date().getFullYear(); i<(new Date().getFullYear()+3); i++) {
            selected = '';
            if( i == week.year ){ 
                selected = 'selected'; 
            }
            options_year += '<option value='+i+' '+selected+'>'+i+'</option>';
        }
        // priority
        var options_priority = '';
        for (var i=1; i<=5; i++) {
            selected = '';
            if( i == week.priority ){ 
                selected = 'selected'; 
            }
            options_priority += '<option value='+i+' '+selected+'>'+i+'</option>';
        }

    // preparamos html de cada campo del formulario
    var field_numweek = '<label for="numweek" class="form-label">Número semana</label><select id="numweek" name="numweek" class="form-select" aria-label="Número de semana" required><option value="">Selecciona Nº de semana</option>'+options_numweek+'</select>';
    var field_year = '<label for="year" class="form-label">Año</label><select id="year" name="year" class="form-select" aria-label="Año" required><option value="">Selecciona Año</option>'+options_year+'</select>';
    var field_description = '<label for="description" class="form-label">Descripción</label><textarea type="description" class="form-control" id="description" name="description" title="Descripción">'+week.description+'</textarea>';
    var field_color = '<label for="color" class="form-label">Color</label><input type="color" class="form-control form-control-color" id="color" name="color" value="'+week.color+'" title="Elige el color">';
    var field_priority = '<label for="priority" class="form-label">Prioridad</label><select id="priority" name="priority" class="form-select" aria-label="Prioridad" required><option value="">Selecciona Prioridad</option>'+options_priority+'</select>';
    var field_link = '<label for="link" class="form-label">Enlace</label><input type="text" class="form-control" id="link" name="link" value="'+week.link+'">';

    // preparamos html del formulario con los campos
    var formHtml = '<div class="modal" tabindex="-1" id="modal-semana"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">'+title+' semana</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><form id="semana-form" class="needs-validation"><div class="modal-body"><div class="mb-3 row"><div class="col-6">'+field_numweek+'</div><div class="col-6">'+field_year+'</div></div><div class="mb-3">'+field_description+'</div><div class="mb-3">'+field_color+'</div><div class="mb-3">'+field_priority+'</div><div class="mb-3">'+field_link+'</div></div><div class="modal-footer"><button id="modal-semana-button" type="submit" class="btn btn-primary">Guardar</button></div></form></div></div></div>';
    
    // borramos el formulario si existe y lo insertamos en el DOM
    $('#modal-semana').remove();
    $(formHtml).appendTo('#week-list');

    // añadimos el listener al evento de enviar el formulario para validar
    var form = document.getElementById("semana-form");
    form.addEventListener('submit', function (event) {
        // validamos el formulario
        if (!form.checkValidity()) {
            // si no valida detenemos acción
            event.preventDefault();
            event.stopPropagation();
        }

        // si valida añadirmos campos validados
        form.classList.add("was-validated");

        // recogemos los datos del formulario
        var values = {};
        $.each($('#semana-form').serializeArray(), function(i, field) {
            values[field.name] = field.value;
        });

        // guardamos la semana en el objeto weeks
        var newIndice = values['year']+values['numweek'];
        if( typeof weeksData[newIndice] == 'undefined' ) {
            weeksData[newIndice] = new Object();
        }
        weeksData[newIndice].year = values['year'];
        weeksData[newIndice].numweek = values['numweek'];
        weeksData[newIndice].color = values['color'];
        weeksData[newIndice].description = values['description'];
        weeksData[newIndice].priority = values['priority'];
        weeksData[newIndice].link = values['link'];
        
        // volvemos a dibujar las semanas
        drawWeeks(weeksData);

        // y cerrará el modal
        event.preventDefault();
        event.stopPropagation();
        $('#modal-semana').modal('hide');
        $('.modal-backdrop.show').remove();
        
    }, false);

    // abrimos el modal
    $('#modal-semana').modal('show');

}

function removeWeek(index) {
    if( typeof weeksData[index] != 'undefined' ) {
        delete weeksData[index];
    }
    // volvemos a dibujar las semanas
    drawWeeks(weeksData);
    $('.modal-backdrop.show').remove();
    return;
}

function drawSelectWeek(weeks, selected = null) {
    // seleccionamos el select
    var selectSemana = $('#select-semana');
    let searchParams = new URLSearchParams(window.location.search)
    // comprobamos si existe el select
    if( selectSemana ) {
        // borramos las opciones
        $('#select-semana option').remove();
        // insertamos semanas
        $.each(weeks, function(index, week) {
            selectSemana.append($('<option>', { 
                value: index,
                text : week.year+' - '+week.numweek,
                selected : ( selected == index ) ? true : false
            }));
        });
        // si hay definida la variable de la semana en la url la seteamos por defecto
        if( searchParams.has('yearweek') ) {
            $("#select-semana").val(searchParams.get('yearweek'));
        }
        // seleccionamos la primera semana por defecto si ninguna esta seleccionada
        if( !($('#select-semana').val()) ) {
            $("#select-semana").val($("#select-semana option:first").val());
        }
    }
}

function drawLinksTable(weeks) {
    // seleccionamos el select
    var tablaLinksBody = $('#table-links-list tbody');
    // comprobamos si existe el select
    $.each(weeks, function(index, week) {
        console.log(week)
        $('<tr><td>'+week.year+' - '+week.numweek+'</td><td>'+week.link+'</td></tr>').appendTo(tablaLinksBody);
    });
}

jQuery( document ).ready(function() {
    // coge los datos de semanas e inserta las cards de semanas en el DOM
    drawWeeks(weeksData);
    drawSelectWeek(weeksData);
    drawLinksTable(weeksData);
});