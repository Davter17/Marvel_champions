<?php
require 'vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory; 

// Crear conexión a la base de datos MySQL.
$conn = new mysqli("localhost", "root", "", "marvel_champions");
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Verificar si se ha subido un archivo a través del formulario HTML.
if ($_FILES["excel_file"]["name"]) {
    $filePath = $_FILES["excel_file"]["tmp_name"];
    $spreadsheet = IOFactory::load($filePath); 

    // Iterar sobre cada hoja del archivo Excel (cada hoja representa un héroe diferente).
    foreach ($spreadsheet->getSheetNames() as $sheetIndex => $sheetName) {
        //Obtener el nombre del héroe de la hoja actual
        $sheet = $spreadsheet->getSheet($sheetIndex); 
        $heroName = $sheetName;  

        // Comenzar a iterar sobre las filas de la hoja, empezando desde la fila 4.
        $rowIterator = $sheet->getRowIterator(4);
        foreach ($rowIterator as $row) {
            $rowIndex = $row->getRowIndex(); // Obtener el índice de la fila actual.
            $villano = $sheet->getCell('A' . $rowIndex)->getValue();  // Obtener el valor de la columna A (nombre del villano).

            // Si la celda de la columna A está vacía, saltar a la siguiente fila.
            if (empty($villano)) {
                continue;
            }

            // Definir las columnas que corresponden a cada atributo y sus valores asociados.
            $columnaAtributos = [
                'B' => 1, 'C' => 1, 'L' => 1, 'M' => 1,
                'D' => 2, 'E' => 2, 'N' => 2, 'O' => 2,
                'F' => 3, 'G' => 3, 'P' => 3, 'Q' => 3,
                'H' => 4, 'I' => 4, 'R' => 4, 'S' => 4,
                'J' => 5, 'K' => 5, 'T' => 5, 'U' => 5
            ];
            $columnaDificultad = [
                'B' => 0, 'C' => 0, 'D' => 0, 'E' => 0, 'F' => 0, 'G' => 0, 
                'H' => 0, 'I' => 0, 'J' => 0, 'K' => 0,
                'L' => 1, 'M' => 1, 'N' => 1, 'O' => 1, 'P' => 1, 'Q' => 1,
                'R' => 1, 'S' => 1, 'T' => 1, 'U' => 1
            ];            
            $columnas = ['B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U'];

            // Iterar sobre las columnas que corresponden a la dificultad "Normal".
            foreach ($columnas as $col) {
                // Verificar el resultado de la partida (Victoria o Derrota) basado en la fila 3.
                $resultadoCelda = $sheet->getCell($col . '3')->getValue();
                $resultado = ($resultadoCelda === 'X') ? 1 : 0; // 1 = Derrota, 0 = Victoria

                // Obtener el número de partidas de la celda correspondiente.
                $valor = $sheet->getCell($col . $rowIndex)->getValue();
                if (!empty($valor) && is_numeric($valor)) { // Si hay un valor numérico válido.
                    // Insertar tantas filas como lo indique el valor de la celda.
                    $atributo = $columnaAtributos[$col];
                    $dificultad = $columnaDificultad[$col];
                    for ($i = 0; $i < intval($valor); $i++) {
                        $sql = "INSERT INTO partidas (Heroe, Atributo, Villano, Dificultad, Resultado) 
                                VALUES ('$heroName', $atributo, '$villano', $dificultad, $resultado)";
                        $conn->query($sql); // Ejecutar la consulta SQL para insertar el registro.
                    }
                }
            }

        }
    }

    echo "Datos insertados correctamente"; // Mensaje de éxito.
} else {
    echo "No se subió ningún archivo."; // Mensaje de error si no se subió ningún archivo.
}

$conn->close(); // Cerrar la conexión a la base de datos.
header("Location:partidas.html");