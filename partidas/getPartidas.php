<?php
// Crear conexión
$conn = new mysqli("localhost", "root", "", "marvel_champions");
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Realizar la consulta
$sql = "SELECT * FROM partidas ORDER BY id DESC";
$result = $conn->query($sql);

$partidas = array();

if ($result->num_rows > 0) {
    // Guardar los resultados en un array
    while($row = $result->fetch_assoc()) {
        $partidas[] = $row; // Agregar cada fila al array
    }
}

// Devolver el array en formato JSON
echo json_encode($partidas);

// Cerrar la conexión
$conn->close();