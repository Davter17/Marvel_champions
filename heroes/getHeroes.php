<?php
// Crear conexión
$conn = new mysqli("localhost", "root", "", "marvel_champions");
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Obtener el valor de orden desde la solicitud GET
$orden = isset($_GET['order']) ? intval($_GET['order']) : 0;

// Definir los posibles valores de orden
$ordenes = [
    "h.ID", 
    "Totales DESC", 
    "Porcentaje DESC", 
    "agr_ratio DESC, agr_victoria DESC", 
    "jus_ratio DESC, jus_victoria DESC", 
    "lid_ratio DESC, lid_victoria DESC", 
    "pro_ratio DESC, pro_victoria DESC", 
    "ext_ratio DESC, ext_victoria DESC"
];

// Validar que $orden sea un índice válido
if (!isset($ordenes[$orden])) {
    $orden = 0; // Valor predeterminado si el índice no es válido
}

// Obtener el valor de inCollection desde la solicitud GET
$inCollection = isset($_GET['inCollection']) ? intval($_GET['inCollection']) : 0;

// Realizar la consulta
$sql = "SELECT 
            h.ID,
            h.nombre, 
            h.Coleccion,
            SUM(P.Resultado = 0) as Ganadas, 
            SUM(p.Resultado = 1) as Perdidas,
            SUM(P.Resultado = 0) + SUM(p.Resultado = 1) as Totales, 
            (SUM(P.Resultado = 0))/(SUM(p.Resultado = 1 || p.Resultado = 0))*100 as Porcentaje, 
            SUM(p.Resultado= 0 && p.Atributo=1) as agr_victoria, 
            SUM(p.Resultado= 1 && p.Atributo=1) as agr_derrota,
            SUM(p.Resultado= 0 && p.Atributo=2) as jus_victoria, 
            SUM(p.Resultado= 1 && p.Atributo=2) as jus_derrota,
            SUM(p.Resultado= 0 && p.Atributo=3) as lid_victoria, 
            SUM(p.Resultado= 1 && p.Atributo=3) as lid_derrota,
            SUM(p.Resultado= 0 && p.Atributo=4) as pro_victoria, 
            SUM(p.Resultado= 1 && p.Atributo=4) as pro_derrota,
            SUM(p.Resultado= 0 && p.Atributo=5) as ext_victoria, 
            SUM(p.Resultado= 1 && p.Atributo=5) as ext_derrota,
            IFNULL(SUM(p.Resultado= 0 && p.Atributo=1) / NULLIF(SUM(p.Atributo=1), 0), -1) as agr_ratio,
            IFNULL(SUM(p.Resultado= 0 && p.Atributo=2) / NULLIF(SUM(p.Atributo=2), 0), -1) as jus_ratio,
            IFNULL(SUM(p.Resultado= 0 && p.Atributo=3) / NULLIF(SUM(p.Atributo=3), 0), -1) as lid_ratio,
            IFNULL(SUM(p.Resultado= 0 && p.Atributo=4) / NULLIF(SUM(p.Atributo=4), 0), -1) as pro_ratio,
            IFNULL(SUM(p.Resultado= 0 && p.Atributo=5) / NULLIF(SUM(p.Atributo=5), 0), -1) as ext_ratio
        FROM heroes h
        LEFT JOIN partidas p ON h.Nombre = p.Heroe
        WHERE (h.Coleccion = 1 AND $inCollection = 1) OR ($inCollection = 0)
        GROUP BY h.Nombre 
        ORDER BY {$ordenes[$orden]}";

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
