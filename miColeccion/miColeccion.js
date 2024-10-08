window.onload = start()

function start(){
    getHeroes()
    getVillanos()
}
  
function getHeroes() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../heroes/getHeroes.php', true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var heroes = JSON.parse(xhr.responseText);

            var heroesSeccionContainer = document.getElementById('heroesSeccionContainer');

            // Limpiar la lista antes de agregar nuevas opciones
            heroesSeccionContainer.innerHTML = ''; 

            // Agregar las opciones con los nombres de los héroes
            heroes.forEach(function(heroe) {
                var divContainer = document.createElement("div");

                var img = document.createElement('img');
                var nombreFoto = heroe.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                img.src = "../heroes/img/" + nombreFoto + ".jpg";
                img.classList.add("img_coleccion");
                img.title= heroe.nombre
                // Inicializar el borde según el estado de la colección
                if (heroe.Coleccion == 1) {
                    img.style.border = "4px green solid";
                } else {
                    img.style.border = "4px red solid";
                }

                // Añadir evento para cambiar el estado al hacer click
                img.addEventListener('click', function() {
                    var nuevoEstado = (heroe.Coleccion == 1) ? 0 : 1;

                    // Cambiar visualmente el borde de la imagen
                    if (nuevoEstado == 1) {
                        img.style.border = "4px green solid";
                    } else {
                        img.style.border = "4px red solid";
                    }

                    // Llamar a la función para actualizar el estado en la base de datos
                    updateEstado('heroes', heroe.ID, nuevoEstado);

                    // Actualizar localmente el estado en el objeto
                    heroe.Coleccion = nuevoEstado;
                });

                divContainer.appendChild(img);
                heroesSeccionContainer.appendChild(divContainer);
            });
        } else {
            console.error('Error al cargar los héroes');
        }
    };

    xhr.send();
}

function getVillanos() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../villanos/getVillanos.php', true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var villanos = JSON.parse(xhr.responseText);

            var villanosSeccionContainer = document.getElementById('villanosSeccionContainer');

            // Limpiar la lista antes de agregar nuevas opciones
            villanosSeccionContainer.innerHTML = ''; 

            // Agregar las opciones con los nombres de los villanos
            villanos.forEach(function(villano) {
                var divContainer = document.createElement("div");

                var img = document.createElement('img');
                var nombreFoto = villano.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                img.src = "../villanos/img/" + nombreFoto + ".jpg";
                img.classList.add("img_coleccion");
                img.title= villano.nombre

                // Inicializar el borde según el estado de la colección
                if (villano.coleccion == 1) {
                    img.style.border = "4px green solid";
                } else {
                    img.style.border = "4px red solid";
                }

                // Añadir evento para cambiar el estado al hacer click
                img.addEventListener('click', function() {
                    var nuevoEstado = (villano.coleccion == 1) ? 0 : 1;

                    // Cambiar visualmente el borde de la imagen
                    if (nuevoEstado == 1) {
                        img.style.border = "4px green solid";
                    } else {
                        img.style.border = "4px red solid";
                    }

                    // Llamar a la función para actualizar el estado en la base de datos
                    updateEstado('villanos', villano.ID, nuevoEstado);

                    // Actualizar localmente el estado en el objeto
                    villano.coleccion = nuevoEstado;
                });

                divContainer.appendChild(img);
                villanosSeccionContainer.appendChild(divContainer);
            });
        } else {
            console.error('Error al cargar los villanos');
        }
    };

    xhr.send();
}

// Función para actualizar el estado en la base de datos
function updateEstado(tipo, id, nuevoEstado) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', `updateEstado.php`, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {
        if (xhr.status === 200) {
        } else {
            console.error('Error al actualizar el estado en la base de datos');
        }
    };

    // Enviar datos al servidor
    xhr.send(`id=${id}&nuevoEstado=${nuevoEstado}&tabla=${tipo}`);
}
