window.onload = getVillanos()

function getVillanos() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'villanos/getVillanos.php', true);
    xhr.onload = function() {
        
        if (xhr.status === 200) {
            var villanos = JSON.parse(xhr.responseText);
            
            var lista = document.getElementById('listaPersonajes');
            
            lista.innerHTML = ''; // Limpiar la lista
            
            villanos.forEach(function(villano) {
                var div = document.createElement('div');
                div.classList.add('cardListado');
                lista.appendChild(div);

                // Crear y agregar imagen
                var img = document.createElement('img');
                var nombreFoto = villano.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                img.src = "villanos/img/" + nombreFoto + ".jpg";
                div.appendChild(img);
                
                // Crear y agregar tabla
                var table = document.createElement('table');
                div.appendChild(table);
                
                //1ª fila - Nombre del héroe
                var tr = document.createElement('tr');
                var th = document.createElement('th');
                th.colSpan = 20;
                th.innerHTML = villano.nombre; 
                tr.appendChild(th);
                table.appendChild(tr);

                //2ª fila - Ganadas, Porcentaje, Perdidas
                tr = document.createElement('tr');
                tr.classList.add("trResultados");
                console.log(villano)
                if (villano.Ganadas != null){
                    var data = [
                        villano.Ganadas,
                        parseFloat(villano.Porcentaje).toFixed(2) + " %",
                        villano.Perdidas
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
                var labels = ["Normal", "Experto"];
                labels.forEach(function(label) {
                    var td = document.createElement('td');
                    td.colSpan = 10;
                    td.innerHTML = label;
                    tr.appendChild(td);
                });
                table.appendChild(tr);
                
                //4ª fila - Datos de agrupación y habilidades
                tr = document.createElement('tr');
                tr.classList.add("trColoreada");
                var attributes = [
                    villano.nor_victoria, villano.nor_derrota,
                    villano.exp_victoria, villano.exp_derrota,
                ];
                attributes.forEach(function(value, index) {
                    var td = document.createElement('td');
                    td.colSpan = 5;
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
