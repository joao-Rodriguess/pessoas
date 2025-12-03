<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;

    if ($id <= 0) {
        die('ID da pessoa inválido.');
    }

    $banco = $conn->real_escape_string($_POST['banco'] ?? '');
    $agencia = $conn->real_escape_string($_POST['agencia'] ?? '');
    $gerente = $conn->real_escape_string($_POST['gerente'] ?? '');

    if ($banco && $agencia && $gerente) {
        $sql = "INSERT INTO pessoas_conta_bancarias (banco, agencia, gerente, table_pessoa_pessoa_id) VALUES ('$banco', '$agencia', '$gerente', $id)";

        if ($conn->query($sql) === TRUE) {
            header("Location: detalhes.php?id=$id&msg=bank_added");
        } else {
            header("Location: detalhes.php?id=$id&error=insert_failed");
        }
    } else {
        header("Location: detalhes.php?id=$id&error=missing_fields");
    }
    exit;
} else {
    header("Location: index.php");
    exit;
}
?>