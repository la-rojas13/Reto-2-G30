$(document).ready(function () {
    $("#btn-actualizar").hide();
})


function traerInformacion() {
    showSpinner()
    $.ajax({
        type: "GET",
        url: "https://g952dcce73c1796-db202109282342.adb.sa-santiago-1.oraclecloudapps.com/ords/admin/message/message",
        dataType: "JSON",
        success: function (response) {
            console.log(response.items)
            listarRespuesta(response.items)
            hideSpinner();
        },
        error: function (xhr, status) {
            console.log(status);
        }
    });
}

function listarRespuesta(items) {
    var tabla = `<table class="table table-bordered">
    <thead class="thead-dark">
              <tr>
                <th>ID</th>
                <th>MESSAGE</th>
                <th colspan="2">Acciones</th>
              </tr>
              </thead>
              `;

    for (let i = 0; i < items.length; i++) {
        tabla += `<tr>
        <td>${items[i].id}</td>
                             <td>${items[i].messagetext}</td>
                             <td><button class="btn btn-primary" onclick="editarRegistro(${items[i].id})">Editar</td>
                    <td><button class="btn btn-danger" onclick="borrarConfirmacion(${items[i].id})">Borrar</td>     
                </tr>
        `;
    }

    tabla += `</table>`;

    $("#table-container").html(tabla);

}

// Agregar

function agregar() {
    var datos = {
        id: $("#id").val(),
        messagetext: $("#message").val(),
    }
    console.log(datos)
    let datosPeticion = JSON.stringify(datos);

    $.ajax({
        url: "https://g952dcce73c1796-db202109282342.adb.sa-santiago-1.oraclecloudapps.com/ords/admin/message/message",
        data: datosPeticion,
        type: 'POST',
        contentType: "application/JSON",

        success: function (respuesta) {
            console.log("Insertado");
            traerInformacion();
            limpiarCampos()
            swal("Operación exitosa", "Elemento agregado", "success");
        },

        error: function (xhr, status) {
            console.log(status);
            swal("Error", "No se pudo agregar el elemento", "error");
        }
    });


}

// Borrar elemento

// modal confirmacion
function borrarConfirmacion(id) {
    swal({
        title: "Esta seguro?",
        text: "Los datos no podran ser recuperados",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                borrar(id)
                swal("El elemento fue eliminado", {
                    icon: "success",
                });
            } else {
                swal("El elemento no se borrara");
            }
        });
}



function borrar(numId) {
    var datos = {
        id: numId
    }

    let datosPeticion = JSON.stringify(datos);

    $.ajax({
        url: "https://g952dcce73c1796-db202109282342.adb.sa-santiago-1.oraclecloudapps.com/ords/admin/message/message",
        data: datosPeticion,
        type: 'DELETE',
        contentType: "application/JSON",

        success: function (respuesta) {
            console.log("Borrado");
            traerInformacion();
        },

        error: function (xhr, status) {
            console.log(status);
        }
    });

}
// Editar

function editarRegistro(numId) {
    $("#btn-actualizar").show();
    $("#btn-agregar").hide();
    $("#btn-listar").hide();
    $("#id").prop('disabled', true);
    $("#message").focus();
    var datos = {
        id: numId
    }

    $.ajax({
        url: "https://g952dcce73c1796-db202109282342.adb.sa-santiago-1.oraclecloudapps.com/ords/admin/message/message/" + numId,
        type: 'GET',
        dataType: 'json',

        success: function (respuesta) {
            let items = respuesta.items;
            console.log(items);
            $("#id").val(items[0].id),
                $("#message").val(items[0].messagetext)
        },
        error: function (xhr, status) {
            console.log(status);
        }
    });

}

function actualizar() {
    var datos = {
        id: $("#id").val(),
        messagetext: $("#message").val()
    }

    let datosPeticion = JSON.stringify(datos);

    $.ajax({
        url: "https://g952dcce73c1796-db202109282342.adb.sa-santiago-1.oraclecloudapps.com/ords/admin/message/message",
        data: datosPeticion,
        type: 'PUT',
        contentType: "application/JSON",

        success: function (respuesta) {
            console.log("Actualizado");
            traerInformacion();
            swal("Operación exitosa", "Elemento actualizado", "success");
            limpiarCampos();
            $("#btn-actualizar").hide();
            $("#btn-agregar").show();
            $("#btn-listar").show();
            $("#id").prop('disabled', false);
        },

        error: function (xhr, status) {
            console.log(status);
            swal("Error", "No se pudo actualizar el elemento", "error");
        }
    });
}

// Function to hide the Spinner
function hideSpinner() {
    document.getElementById('spinner')
        .style.display = 'none';
}

function showSpinner() {
    document.getElementById('spinner')
        .style.display = 'block';
}

function limpiarCampos() {
    $("#id").val("");
    $("#message").val("");
}