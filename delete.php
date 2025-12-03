<?php
include 'db.php';

// Get ID from query string
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
if ($id <= 0) {
    die("<div class='alert alert-danger'>ID inválido.</div>");
}

// Start transaction
$conn->begin_transaction();
try {
    // Delete addresses
    $conn->query("DELETE FROM pessoas_ederecos WHERE table_pessoa_pessoa_id = $id");
    // Delete document (first get document id)
    $docResult = $conn->query("SELECT pessoa_documento_idpessoa_documento FROM table_pessoa WHERE pessoa_id = $id");
    if ($docResult && $docRow = $docResult->fetch_assoc()) {
        $docId = $docRow['pessoa_documento_idpessoa_documento'];
        if ($docId) {
            $conn->query("DELETE FROM pessoa_documento WHERE idpessoa_documento = $docId");
        }
    }
    // Delete bank accounts
    $conn->query("DELETE FROM pessoas_conta_bancarias WHERE table_pessoa_pessoa_id = $id");
    // Delete person record
    $conn->query("DELETE FROM table_pessoa WHERE pessoa_id = $id");

    $conn->commit();
    // Redirect back to index with success message
    header('Location: index.php?msg=deleted');
    exit;
} catch (Exception $e) {
    $conn->rollback();
    die("<div class='alert alert-danger'>Erro ao excluir: " . $e->getMessage() . "</div>");
}
?>