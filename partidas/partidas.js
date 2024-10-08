window.onload = start()

function start(){
    getHeroes()
    getVillanos()
    getPartidas()
}
  
function getHeroes() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../heroes/getHeroes.php', true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var heroes = JSON.parse(xhr.responseText);

            var heroesSelect = document.getElementById('partida_nueva_heroe');

            // Limpiar la lista antes de agregar nuevas opciones
            heroesSelect.innerHTML = ''; 

            // Crear y agregar la opción vacía
            var emptyOption = document.createElement('option');
            emptyOption.value = '';
            emptyOption.selected = true;
            emptyOption.disabled = true;
            emptyOption.hidden = true;
            heroesSelect.appendChild(emptyOption);

            // Agregar las opciones con los nombres de los héroes
            heroes.forEach(function(object) {
                var option = document.createElement('option');
                nombre = object.nombre;
                option.value = nombre;
                option.textContent = nombre;
                heroesSelect.appendChild(option);
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

            var villanosSelect = document.getElementById('partida_nueva_villano');

            // Limpiar la lista antes de agregar nuevas opciones
            villanosSelect.innerHTML = ''; 

            // Crear y agregar la opción vacía
            var emptyOption = document.createElement('option');
            emptyOption.value = '';
            emptyOption.selected = true;
            emptyOption.disabled = true;
            emptyOption.hidden = true;
            villanosSelect.appendChild(emptyOption);

            // Agregar las opciones con los nombres de los héroes
            villanos.forEach(function(object) {
                var option = document.createElement('option');
                nombre = object.nombre;
                option.value = nombre;
                option.textContent = nombre;
                villanosSelect.appendChild(option);
            });
        } else {
            console.error('Error al cargar los héroes');
        }
    };

    xhr.send();
}

function getPartidas() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'getPartidas.php', true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var partidas = JSON.parse(xhr.responseText);
            var lista = document.getElementById('partidas_lista');
            
            var atributoNombre = {
                1: 'Agresividad',
                2: 'Justicia',
                3: 'Liderazgo',
                4: 'Protección',
                5: 'Masacrismo'
            };

            var dificultadVillano = {
                0: 'Normal',
                1: 'Experto'
            };

            lista.innerHTML = ''; // Limpiar la lista

            partidas.forEach(function(partida) {
                console.log(partida)

                var divContainer = document.createElement('div');
                divContainer.classList.add('partidaListado');
                divContainer.style.backgroundColor = partida.Resultado === '1' ? 'red' : 'green';
                lista.appendChild(divContainer);

                var div = document.createElement('div');
                div.innerHTML = partida.Heroe;
                div.innerHTML += " ("+atributoNombre[partida.Atributo]+")"
                divContainer.appendChild(div)   
                
                var div = document.createElement('div');
                div.classList.add("imageFight");
                var img = document.createElement('img');
                var nombreFoto = partida.Heroe.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                img.src = "../heroes/img/" + nombreFoto + ".jpg";
                div.appendChild(img);
                var img = document.createElement('img');
                img.src = "../img/vs.webp";
                div.appendChild(img);
                var img = document.createElement('img');
                var nombreFoto = partida.Villano.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                img.src = "../villanos/img/" + nombreFoto + ".jpg";
                div.appendChild(img);
                divContainer.appendChild(div)

                var div = document.createElement('div');
                div.innerHTML = partida.Villano;
                div.innerHTML += " ("+dificultadVillano[partida.Dificultad]+")"
                divContainer.appendChild(div)                

                var div = document.createElement('div');
                div.classList.add("iconFight");
                var img = document.createElement('img');
                img.src = "../img/delete.webp";
                div.title = "Eliminar partida"; 
                div.addEventListener('click', function() {
                    var confirmacion = confirm("¿Estás seguro de que deseas eliminar la partida "+ partida.Heroe+ " (" +atributoNombre[partida.Atributo]+ ") contra " + partida.Villano+  " ("+ dificultadVillano[partida.Dificultad] +")?");
                    if (confirmacion) {
                        eliminarPartida(partida.id); // Llama a la función con el ID de la partida si se confirma
                    }
                });
                div.style.cursor = "pointer"
                div.appendChild(img);
                divContainer.appendChild(div)
            });
        } else {
            console.error('Error al cargar las partidas');
        }
    };

    xhr.onerror = function() {
        console.error('Error de red');
    };

    xhr.send();
}

function eliminarPartida(idPartida) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'eliminarPartida.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log(xhr.responseText);
            location.reload(); // Refresca la página para mostrar la lista actualizada
        } else {
            console.error('Error al eliminar la partida');
        }
    };

    xhr.onerror = function() {
        console.error('Error de red');
    };

    xhr.send('id=' + encodeURIComponent(idPartida)); 
}
