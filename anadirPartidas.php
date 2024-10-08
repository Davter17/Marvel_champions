<?php
// Crear conexión
$conn = new mysqli("localhost", "root", "", "marvel_champions");
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$heroe = $_POST['partida_nueva_heroe'];
$atributo = $_POST['partida_nueva_atributo'];
$villano = $_POST['partida_nueva_villano'];
$dificultad = $_POST['partida_nueva_dificultad'];
$resultado = $_POST['partida_nueva_resultado'];

// Preparar la consulta SQL
$sql = "INSERT INTO partidas (Heroe, Atributo, Villano, Dificultad, Resultado)
VALUES (?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sisii", $heroe, $atributo, $villano, $dificultad, $resultado);

// Ejecutar la consulta
if ($stmt->execute()) {
    // Redirigir a la página partidas.html
    header("Location: partidas.html");
    exit(); // Asegura que no se ejecute más código después de la redirección
} else {
    echo "Error: " . $stmt->error;
}

// Cerrar la conexión
$stmt->close();
$conn->close();