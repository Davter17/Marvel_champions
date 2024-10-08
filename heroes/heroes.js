window.onload = start()

function start(){
    getHeroes(0)
    ordenContainer = document.getElementById("orden");
    ordenContainer.addEventListener("change", function(){
        getHeroes(ordenContainer.value)
        console.log(ordenContainer.value)
    })
}

function getHeroes(order) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'heroes/getHeroes.php?order=' + order, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var heroes = JSON.parse(xhr.responseText);
            console.log(heroes); // Aquí puedes manejar los datos como desees
            
            var lista = document.getElementById('listaPersonajes');
            lista.innerHTML = ''; // Limpiar la lista
            
            heroes.forEach(function(hero) {
                var div = document.createElement('div');
                div.classList.add('cardListado');
                lista.appendChild(div);

                // Crear y agregar imagen
                var img = document.createElement('img');
                var nombreFoto = hero.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                img.src = "heroes/img/" + nombreFoto + ".jpg";
                div.appendChild(img);
                
                // Crear y agregar tabla
                var table = document.createElement('table');
                div.appendChild(table);
                
                //1ª fila - Nombre del héroe
                var tr = document.createElement('tr');
                var th = document.createElement('th');
                th.colSpan = 20;
                th.innerHTML = hero.nombre; 
                tr.appendChild(th);
                table.appendChild(tr);

                //2ª fila - Ganadas, Porcentaje, Perdidas
                tr = document.createElement('tr');
                tr.classList.add("trResultados");
                if (hero.Ganadas != null){
                    var data = [
                        hero.Ganadas,
                        parseFloat(hero.Porcentaje).toFixed(2) + " %",
                        hero.Perdidas
                    ];
                } else{
                    var data = [
                        "-","-", "-"
                    ];
                }
                
                data.forEach(function(value, index) {
                    var td = document.createElement('td');
                    if (index === 1) { // Verifica si es el segundo elemento (índice 1)
                        td.colSpan = 10;
                    } else {
                        td.colSpan = 5;
                    }
                    td.innerHTML = value;
                    tr.appendChild(td);
                });
                
                table.appendChild(tr);

                //3ª fila - Agrupación, Justicia, Liderazgo, Promoción, Experto
                tr = document.createElement('tr');
                var labels = ["Agr.", "Jus.", "Lid.", "Pro.", "Mas."];
                labels.forEach(function(label) {
                    var td = document.createElement('td');
                    td.colSpan = 4;
                    td.innerHTML = label;
                    tr.appendChild(td);
                });
                table.appendChild(tr);
                
                //4ª fila - Datos de agrupación y habilidades
                tr = document.createElement('tr');
                tr.classList.add("trColoreada");
                var attributes = [
                    [hero.agr_victoria, hero.agr_derrota],
                    [hero.jus_victoria, hero.jus_derrota],
                    [hero.lid_victoria, hero.lid_derrota],
                    [hero.pro_victoria, hero.pro_derrota],
                    [hero.ext_victoria, hero.ext_derrota]
                ];
                attributes.forEach(function(value, index) {
                    var td = document.createElement('td');
                    td.colSpan = 2;
                    td.innerHTML = value ? value : "-"; // Muestra "-" si el valor es nulo o 0
                    tr.appendChild(td);
                });
                table.appendChild(tr);
            });
        } else {
            console.error('Error al cargar los héroes');
        }
    };

    xhr.onerror = function() {
        console.error('Error de red');
    };

    xhr.send();
}
