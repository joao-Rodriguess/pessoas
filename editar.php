<?php
include 'db.php';

if (!isset($_GET['id'])) {
    header("Location: index.php");
    exit;
}

$id = intval($_GET['id']);
$msg = "";

// Handle Form Submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $conn->begin_transaction();
    try {
        // Update Person
        $nome = $conn->real_escape_string($_POST['nome']);
        $email = $conn->real_escape_string($_POST['email']);
        $celular = $conn->real_escape_string($_POST['celular']);
        $telefone = $conn->real_escape_string($_POST['telefone']);
        $situacao = intval($_POST['situacao']);
        $tipo = intval($_POST['tipo']);

        $sql_pessoa = "UPDATE table_pessoa SET 
                       pessoa_nome='$nome', 
                       pessoa_email='$email', 
                       pessoa_celular='$celular', 
                       pessoa_telefone='$telefone', 
                       pessoa_situacao_idpessoa_situacao='$situacao', 
                       tab_tipo_pessoa_idtab_tipo_pessoa='$tipo' 
                       WHERE pessoa_id=$id";
        $conn->query($sql_pessoa);

        // Get Document ID to update
        $result_doc_id = $conn->query("SELECT pessoa_documento_idpessoa_documento FROM table_pessoa WHERE pessoa_id=$id");
        $row_doc = $result_doc_id->fetch_assoc();
        $doc_id = $row_doc['pessoa_documento_idpessoa_documento'];

        if ($doc_id) {
            $cpf = $conn->real_escape_string($_POST['cpf']);
            $rg = $conn->real_escape_string($_POST['rg']);
            $sql_doc = "UPDATE pessoa_documento SET cpf='$cpf', rg='$rg' WHERE idpessoa_documento=$doc_id";
            $conn->query($sql_doc);
        }

        // Update Address (Editing the first one found for simplicity)
        $result_addr = $conn->query("SELECT idpessoas_ederecos FROM pessoas_ederecos WHERE table_pessoa_pessoa_id=$id LIMIT 1");
        $row_addr = $result_addr->fetch_assoc();

        if (!empty($_POST['endereco'])) {
            $end = $conn->real_escape_string($_POST['endereco']);
            $num = $conn->real_escape_string($_POST['numero']);
            $bairro = $conn->real_escape_string($_POST['bairro']);
            $cidade = $conn->real_escape_string($_POST['cidade']);
            $cep = $conn->real_escape_string($_POST['cep']);
            $tipo_end = intval($_POST['tipo_endereco']);

            if ($row_addr) {
                $addr_id = $row_addr['idpessoas_ederecos'];
                $sql_end = "UPDATE pessoas_ederecos SET 
                            endereco='$end', numero='$num', bairro='$bairro', cidade='$cidade', cep='$cep', pessoa_tipo_endereco_idpessoa_tipo_endereco='$tipo_end' 
                            WHERE idpessoas_ederecos=$addr_id";
                $conn->query($sql_end);
            } else {
                // Insert if didn't exist
                $sql_end = "INSERT INTO pessoas_ederecos (endereco, numero, bairro, cidade, cep, table_pessoa_pessoa_id, pessoa_tipo_endereco_idpessoa_tipo_endereco) 
                            VALUES ('$end', '$num', '$bairro', '$cidade', '$cep', '$id', '$tipo_end')";
                $conn->query($sql_end);
            }
        }

        $conn->commit();
        $msg = "<div class='alert alert-success'>Dados atualizados com sucesso!</div>";
    } catch (Exception $e) {
        $conn->rollback();
        $msg = "<div class='alert alert-danger'>Erro ao atualizar: " . $e->getMessage() . "</div>";
    }
}

// Fetch Current Data
$sql_person = "SELECT p.*, d.cpf, d.rg FROM table_pessoa p 
               LEFT JOIN pessoa_documento d ON p.pessoa_documento_idpessoa_documento = d.idpessoa_documento 
               WHERE p.pessoa_id = $id";
$person = $conn->query($sql_person)->fetch_assoc();

if (!$person) {
    echo "Pessoa não encontrada.";
    exit;
}

// Fetch Address
$sql_addr = "SELECT * FROM pessoas_ederecos WHERE table_pessoa_pessoa_id = $id LIMIT 1";
$addr = $conn->query($sql_addr)->fetch_assoc();

// Options
$situacoes = $conn->query("SELECT * FROM pessoa_situacao");
$tipos = $conn->query("SELECT * FROM tab_tipo_pessoa");
$tipos_end = $conn->query("SELECT * FROM pessoa_tipo_endereco");
?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Cadastro</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="css/style.css">
</head>

<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div class="container">
            <a class="navbar-brand" href="index.php"><i class="bi bi-arrow-left me-2"></i>Voltar</a>
            <span class="navbar-text text-white">Editar Cadastro</span>
        </div>
    </nav>

    <div class="container">
        <?php echo $msg; ?>
        <div class="card shadow-sm border-0">
            <div class="card-body p-4">
                <h4 class="card-title mb-4 text-primary">Editar dados de
                    <?php echo htmlspecialchars($person['pessoa_nome']); ?></h4>

                <form method="POST">
                    <!-- Dados Pessoais -->
                    <h5 class="text-secondary border-bottom pb-2 mb-3">Dados Pessoais</h5>
                    <div class="row g-3 mb-4">
                        <div class="col-md-6">
                            <label class="form-label">Nome Completo</label>
                            <input type="text" name="nome" class="form-control"
                                value="<?php echo htmlspecialchars($person['pessoa_nome']); ?>" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Email</label>
                            <input type="email" name="email" class="form-control"
                                value="<?php echo htmlspecialchars($person['pessoa_email']); ?>" required>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Celular</label>
                            <input type="text" name="celular" class="form-control"
                                value="<?php echo htmlspecialchars($person['pessoa_celular']); ?>">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Telefone</label>
                            <input type="text" name="telefone" class="form-control"
                                value="<?php echo htmlspecialchars($person['pessoa_telefone']); ?>">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Situação</label>
                            <select name="situacao" class="form-select">
                                <?php while ($row = $situacoes->fetch_assoc()) {
                                    $selected = ($row['idpessoa_situacao'] == $person['pessoa_situacao_idpessoa_situacao']) ? 'selected' : '';
                                    echo "<option value='" . $row['idpessoa_situacao'] . "' $selected>" . $row['pessoa_situacao_desc'] . "</option>";
                                } ?>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Tipo</label>
                            <select name="tipo" class="form-select">
                                <?php while ($row = $tipos->fetch_assoc()) {
                                    $selected = ($row['idtab_tipo_pessoa'] == $person['tab_tipo_pessoa_idtab_tipo_pessoa']) ? 'selected' : '';
                                    echo "<option value='" . $row['idtab_tipo_pessoa'] . "' $selected>" . $row['descricao'] . "</option>";
                                } ?>
                            </select>
                        </div>
                    </div>

                    <!-- Documentos -->
                    <h5 class="text-secondary border-bottom pb-2 mb-3">Documentos</h5>
                    <div class="row g-3 mb-4">
                        <div class="col-md-6">
                            <label class="form-label">CPF</label>
                            <input type="text" name="cpf" class="form-control"
                                value="<?php echo htmlspecialchars($person['cpf']); ?>">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">RG</label>
                            <input type="text" name="rg" class="form-control"
                                value="<?php echo htmlspecialchars($person['rg']); ?>">
                        </div>
                    </div>

                    <!-- Endereço -->
                    <h5 class="text-secondary border-bottom pb-2 mb-3">Endereço Principal</h5>
                    <div class="row g-3 mb-4">
                        <div class="col-md-2">
                            <label class="form-label">CEP</label>
                            <input type="text" name="cep" class="form-control"
                                value="<?php echo $addr ? htmlspecialchars($addr['cep']) : ''; ?>">
                        </div>
                        <div class="col-md-8">
                            <label class="form-label">Logradouro</label>
                            <input type="text" name="endereco" class="form-control"
                                value="<?php echo $addr ? htmlspecialchars($addr['endereco']) : ''; ?>">
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">Número</label>
                            <input type="text" name="numero" class="form-control"
                                value="<?php echo $addr ? htmlspecialchars($addr['numero']) : ''; ?>">
                        </div>
                        <div class="col-md-5">
                            <label class="form-label">Bairro</label>
                            <input type="text" name="bairro" class="form-control"
                                value="<?php echo $addr ? htmlspecialchars($addr['bairro']) : ''; ?>">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Cidade</label>
                            <input type="text" name="cidade" class="form-control"
                                value="<?php echo $addr ? htmlspecialchars($addr['cidade']) : ''; ?>">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Tipo de Endereço</label>
                            <select name="tipo_endereco" class="form-select">
                                <?php while ($row = $tipos_end->fetch_assoc()) {
                                    $selected = ($addr && $row['idpessoa_tipo_endereco'] == $addr['pessoa_tipo_endereco_idpessoa_tipo_endereco']) ? 'selected' : '';
                                    echo "<option value='" . $row['idpessoa_tipo_endereco'] . "' $selected>" . $row['descricao'] . "</option>";
                                } ?>
                            </select>
                        </div>
                    </div>

                    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                        <a href="detalhes.php?id=<?php echo $id; ?>" class="btn btn-secondary me-md-2">Cancelar</a>
                        <button type="submit" class="btn btn-primary px-5">Salvar Alterações</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</body>

</html>