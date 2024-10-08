<?php
// Conectar a la base de datos
$conn = new mysqli("localhost", "root", "", "marvel_champions");
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Obtener el ID de la partida a eliminar
$id = intval($_POST['id']);

// Preparar y ejecutar la consulta SQL para eliminar la partida
$sql = "DELETE FROM partidas WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $id);

if ($stmt->execute()) {
    echo "Partida eliminada correctamente";
} else {
    echo "Error al eliminar la partida: " . $conn->error;
}

// Cerrar la conexión
$stmt->close();
$conn->close();