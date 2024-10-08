<?php
// Crear conexión
$conn = new mysqli("localhost", "root", "", "marvel_champions");
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Realizar la consulta
$sql = "SELECT v.nombre, SUM(P.Resultado = 0) as Ganadas, SUM(p.Resultado = 1) as Perdidas, (SUM(P.Resultado = 0))/(SUM(p.Resultado = 1 || p.Resultado = 0))*100 as Porcentaje, SUM(p.Resultado= 0 && p.Dificultad=0) as nor_victoria, SUM(p.Resultado= 1 && p.Dificultad=0) as nor_derrota,
SUM(p.Resultado= 0 && p.Dificultad=1) as exp_victoria, SUM(p.Resultado= 1 && p.Dificultad=1) as exp_derrota
FROM villanos v
LEFT JOIN partidas p ON v.Nombre = p.Villano
GROUP BY v.Nombre ORDER BY v.ID" ;
$result = $conn->query($sql);

$heroes = array();

if ($result->num_rows > 0) {
    // Guardar los resultados en un array
    while ($row = $result->fetch_assoc()) {
        $heroes[] = $row;
    }
}

// Devolver el array en formato JSON
echo json_encode($heroes);

// Cerrar la conexión
$conn->close();
