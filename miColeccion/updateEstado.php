<?php
// Conectar a la base de datos
$conn = new mysqli("localhost", "root", "", "marvel_champions");
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$id = $_POST['id'];
$nuevoEstado = $_POST['nuevoEstado'];
$tabla = $_POST['tabla'];

// Verificar que la tabla sea 'heroes' o 'villanos'
if ($tabla === 'heroes' || $tabla === 'villanos') {
    // Preparar la consulta para actualizar el estado
    $query = "UPDATE $tabla SET Coleccion = $nuevoEstado WHERE id = $id";
    $stmt = $conn->prepare($query);

    if ($stmt->execute()) {
        echo "$query";
    } else {
        echo "Error al actualizar el estado en $tabla";
    }
} else {
    echo "Tabla no válida.";
}