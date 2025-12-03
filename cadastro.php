<?php
include 'db.php';

$msg = "";

// Handle Form Submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $conn->begin_transaction();
    try {
        // 1. Insert Document
        $cpf = $_POST['cpf'];
        $rg = $_POST['rg'];
        $sql_doc = "INSERT INTO pessoa_documento (cpf, rg) VALUES ('$cpf', '$rg')";
        $conn->query($sql_doc);
        $doc_id = $conn->insert_id;

        // 2. Insert Person
        $nome = $_POST['nome'];
        $email = $_POST['email'];
        $celular = $_POST['celular'];
        $telefone = $_POST['telefone'];
        $situacao = $_POST['situacao'];
        $tipo = $_POST['tipo'];
        $data_cadastro = date('Y-m-d H:i:s');

        $sql_pessoa = "INSERT INTO table_pessoa (pessoa_nome, pessoa_email, pessoa_celular, pessoa_telefone, pessoa_data_cadastrada, pessoa_situacao_idpessoa_situacao, tab_tipo_pessoa_idtab_tipo_pessoa, pessoa_documento_idpessoa_documento) 
                       VALUES ('$nome', '$email', '$celular', '$telefone', '$data_cadastro', '$situacao', '$tipo', '$doc_id')";
        $conn->query($sql_pessoa);
        $pessoa_id = $conn->insert_id;

        // 3. Insert Address (Optional)
        if (!empty($_POST['endereco'])) {
            $end = $_POST['endereco'];
            $num = $_POST['numero'];
            $bairro = $_POST['bairro'];
            $cidade = $_POST['cidade'];
            $cep = $_POST['cep'];
            $tipo_end = $_POST['tipo_endereco'];

            $sql_end = "INSERT INTO pessoas_ederecos (endereco, numero, bairro, cidade, cep, table_pessoa_pessoa_id, pessoa_tipo_endereco_idpessoa_tipo_endereco) 
                        VALUES ('$end', '$num', '$bairro', '$cidade', '$cep', '$pessoa_id', '$tipo_end')";
            $conn->query($sql_end);
        }

        // Insert Bank Account (Optional)
        if (!empty($_POST['banco']) && !empty($_POST['agencia']) && !empty($_POST['gerente'])) {
            $banco = $conn->real_escape_string($_POST['banco']);
            $agencia = $conn->real_escape_string($_POST['agencia']);
            $gerente = $conn->real_escape_string($_POST['gerente']);
            $sql_bank = "INSERT INTO pessoas_conta_bancarias (banco, agencia, gerente, table_pessoa_pessoa_id) VALUES ('$banco', '$agencia', '$gerente', '$pessoa_id')";
            $conn->query($sql_bank);
        }
        $conn->commit();
        $msg = "<div class='alert alert-success'>Cadastro realizado com sucesso!</div>";
    } catch (Exception $e) {
        $conn->rollback();
        $msg = "<div class='alert alert-danger'>Erro ao cadastrar: " . $e->getMessage() . "</div>";
    }
}

// Fetch Options for Selects
$situacoes = $conn->query("SELECT * FROM pessoa_situacao");
$tipos = $conn->query("SELECT * FROM tab_tipo_pessoa");
$tipos_end = $conn->query("SELECT * FROM pessoa_tipo_endereco");
?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Novo Cadastro</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="css/style.css">
</head>

<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-success mb-4">
        <div class="container">
            <a class="navbar-brand" href="index.php"><i class="bi bi-arrow-left me-2"></i>Voltar</a>
            <span class="navbar-text text-white">Novo Cadastro</span>
        </div>
    </nav>

    <div class="container">
        <?php echo $msg; ?>
        <div class="card shadow-sm border-0">
            <div class="card-body p-4">
                <h4 class="card-title mb-4 text-success">Preencha os dados abaixo</h4>

                <form method="POST" action="cadastro.php">
                    <!-- Dados Pessoais -->
                    <h5 class="text-secondary border-bottom pb-2 mb-3">Dados Pessoais</h5>
                    <div class="row g-3 mb-4">
                        <div class="col-md-6">
                            <label class="form-label">Nome Completo</label>
                            <input type="text" name="nome" class="form-control" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Email</label>
                            <input type="email" name="email" class="form-control" required>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Celular</label>
                            <input type="text" name="celular" class="form-control">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Telefone</label>
                            <input type="text" name="telefone" class="form-control">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Situação</label>
                            <select name="situacao" class="form-select">
                                <?php while ($row = $situacoes->fetch_assoc()) {
                                    echo "<option value='" . $row['idpessoa_situacao'] . "'>" . $row['pessoa_situacao_desc'] . "</option>";
                                } ?>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Tipo</label>
                            <select name="tipo" class="form-select">
                                <?php while ($row = $tipos->fetch_assoc()) {
                                    echo "<option value='" . $row['idtab_tipo_pessoa'] . "'>" . $row['descricao'] . "</option>";
                                } ?>
                            </select>
                        </div>
                    </div>

                    <!-- Documentos -->
                    <h5 class="text-secondary border-bottom pb-2 mb-3">Documentos</h5>
                    <div class="row g-3 mb-4">
                        <div class="col-md-6">
                            <label class="form-label">CPF</label>
                            <input type="text" name="cpf" class="form-control">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">RG</label>
                            <input type="text" name="rg" class="form-control">
                        </div>
                    </div>

                    <!-- Endereço -->
                    <h5 class="text-secondary border-bottom pb-2 mb-3">Endereço Principal</h5>
                    <div class="row g-3 mb-4">
                        <div class="col-md-2">
                            <label class="form-label">CEP</label>
                            <input type="text" name="cep" class="form-control">
                        </div>
                        <div class="col-md-8">
                            <label class="form-label">Logradouro</label>
                            <input type="text" name="endereco" class="form-control">
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">Número</label>
                            <input type="text" name="numero" class="form-control">
                        </div>
                        <div class="col-md-5">
                            <label class="form-label">Bairro</label>
                            <input type="text" name="bairro" class="form-control">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Cidade</label>
                            <input type="text" name="cidade" class="form-control">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Tipo de Endereço</label>
                            <select name="tipo_endereco" class="form-select">
                                <?php while ($row = $tipos_end->fetch_assoc()) {
                                    echo "<option value='" . $row['idpessoa_tipo_endereco'] . "'>" . $row['descricao'] . "</option>";
                                } ?>
                            </select>
                        </div>
                    </div>
                    <!-- Bank Account -->
                    <h5 class="text-secondary border-bottom pb-2 mb-3">Conta Bancária (Opcional)</h5>
                    <div class="row g-3 mb-4">
                        <div class="col-md-4">
                            <label class="form-label">Banco</label>
                            <input type="text" name="banco" class="form-control" placeholder="Nome do banco">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Agência</label>
                            <input type="text" name="agencia" class="form-control" placeholder="Número da agência">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Gerente</label>
                            <input type="text" name="gerente" class="form-control" placeholder="Nome do gerente">
                        </div>
                    </div>

                    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                        <a href="index.php" class="btn btn-secondary me-md-2">Cancelar</a>
                        <button type="submit" class="btn btn-success px-5">Salvar Cadastro</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</body>

</html>