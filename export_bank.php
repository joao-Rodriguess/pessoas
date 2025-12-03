<?php
include 'db.php';

if (!isset($_GET['id'])) {
    die("ID da pessoa não fornecido.");
}

$id = intval($_GET['id']);

// Fetch person name for filename
$sql_person = "SELECT pessoa_nome FROM table_pessoa WHERE pessoa_id = $id";
$result_person = $conn->query($sql_person);
$person = $result_person->fetch_assoc();
$filename = "contas_" . preg_replace('/[^a-zA-Z0-9]/', '_', $person['pessoa_nome']) . ".csv";

// Fetch bank accounts
$sql = "SELECT banco, agencia, gerente FROM pessoas_conta_bancarias WHERE table_pessoa_pessoa_id = $id";
$result = $conn->query($sql);

header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="' . $filename . '"');

$output = fopen('php://output', 'w');
fputcsv($output, array('Banco', 'Agência', 'Gerente'));

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        fputcsv($output, $row);
    }
}

fclose($output);
exit;
?>