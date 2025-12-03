<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = intval($_POST['id']); // Person ID
    $bank_id = intval($_POST['bank_id']);
    $banco = $conn->real_escape_string($_POST['banco']);
    $agencia = $conn->real_escape_string($_POST['agencia']);
    $gerente = $conn->real_escape_string($_POST['gerente']);

    if ($bank_id > 0 && $banco && $agencia && $gerente) {
        $sql = "UPDATE pessoas_conta_bancarias SET banco = '$banco', agencia = '$agencia', gerente = '$gerente' WHERE idpessoas_conta_bancarias = $bank_id";

        if ($conn->query($sql) === TRUE) {
            header("Location: detalhes.php?id=$id&msg=updated");
        } else {
            header("Location: detalhes.php?id=$id&error=update_failed");
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