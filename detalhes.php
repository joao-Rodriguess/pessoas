<?php 
include 'db.php'; 

if (!isset($_GET['id'])) {
    header("Location: index.php");
    exit;
}

$id = intval($_GET['id']);

// Fetch Main Person Data
$sql_person = "SELECT p.*, s.pessoa_situacao_desc, t.descricao as tipo_desc, d.* 
               FROM table_pessoa p 
               LEFT JOIN pessoa_situacao s ON p.pessoa_situacao_idpessoa_situacao = s.idpessoa_situacao
               LEFT JOIN tab_tipo_pessoa t ON p.tab_tipo_pessoa_idtab_tipo_pessoa = t.idtab_tipo_pessoa
               LEFT JOIN pessoa_documento d ON p.pessoa_documento_idpessoa_documento = d.idpessoa_documento
               WHERE p.pessoa_id = $id";
$result_person = $conn->query($sql_person);
$person = $result_person->fetch_assoc();

if (!$person) {
    echo "Pessoa não encontrada.";
    exit;
}

// Fetch Addresses
$sql_addr = "SELECT e.*, te.descricao as tipo_end_desc 
             FROM pessoas_ederecos e 
             LEFT JOIN pessoa_tipo_endereco te ON e.pessoa_tipo_endereco_idpessoa_tipo_endereco = te.idpessoa_tipo_endereco
             WHERE e.table_pessoa_pessoa_id = $id";
$result_addr = $conn->query($sql_addr);

// Fetch Bank Accounts
$sql_bank = "SELECT * FROM pessoas_conta_bancarias WHERE table_pessoa_pessoa_id = $id";
$result_bank = $conn->query($sql_bank);
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Detalhes - <?php echo htmlspecialchars($person['pessoa_nome']); ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div class="container">
            <a class="navbar-brand" href="index.php"><i class="bi bi-arrow-left me-2"></i>Voltar</a>
            <span class="navbar-text text-white">Detalhes do Cadastro</span>
        </div>
    </nav>

    <div class="container">
        <div class="row">
            <!-- Main Info Column -->
            <div class="col-md-4 mb-4">
                <div class="card shadow-sm border-0">
                    <div class="card-body text-center">
                        <div class="mb-3">
                            <i class="bi bi-person-circle display-1 text-secondary"></i>
                        </div>
                        <h3 class="card-title fw-bold"><?php echo htmlspecialchars($person['pessoa_nome']); ?></h3>
                        <div class="mb-3">
                            <span class="badge bg-primary"><?php echo htmlspecialchars($person['tipo_desc']); ?></span>
                            <span class="badge bg-secondary"><?php echo htmlspecialchars($person['pessoa_situacao_desc']); ?></span>
                        </div>
                        <a href="editar.php?id=<?php echo $id; ?>" class="btn btn-primary w-100 mb-3"><i class="bi bi-pencil-square me-2"></i>Editar Cadastro</a>
                        
                        <ul class="list-group list-group-flush text-start mt-3">
                            <li class="list-group-item"><strong>Email:</strong> <?php echo htmlspecialchars($person['pessoa_email']); ?></li>
                            <li class="list-group-item"><strong>Celular:</strong> <?php echo htmlspecialchars($person['pessoa_celular']); ?></li>
                            <li class="list-group-item"><strong>Telefone:</strong> <?php echo htmlspecialchars($person['pessoa_telefone']); ?></li>
                            <li class="list-group-item"><strong>Cadastro:</strong> <?php echo date('d/m/Y H:i', strtotime($person['pessoa_data_cadastrada'])); ?></li>
                        </ul>
                    </div>
                </div>
                
                <div class="card shadow-sm border-0 mt-3">
                    <div class="card-body">
                        <h5 class="card-title text-primary"><i class="bi bi-card-heading me-2"></i>Documentos</h5>
                        <ul class="list-unstyled">
                            <?php if($person['cpf']) echo "<li><strong>CPF:</strong> " . htmlspecialchars($person['cpf']) . "</li>"; ?>
                            <?php if($person['rg']) echo "<li><strong>RG:</strong> " . htmlspecialchars($person['rg']) . "</li>"; ?>
                            <?php if($person['cnh']) echo "<li><strong>CNH:</strong> " . htmlspecialchars($person['cnh']) . "</li>"; ?>
                            <?php if($person['titulo']) echo "<li><strong>Título:</strong> " . htmlspecialchars($person['titulo']) . "</li>"; ?>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Details Column -->
            <div class="col-md-8">
                <!-- Addresses -->
                <div class="card shadow-sm border-0 mb-4">
                    <div class="card-body">
                        <h4 class="section-title"><i class="bi bi-geo-alt-fill me-2"></i>Endereços</h4>
                        <div class="row g-3">
                            <?php if ($result_addr && $result_addr->num_rows > 0): ?>
                                <?php while($addr = $result_addr->fetch_assoc()): ?>
                                <div class="col-md-6">
                                    <div class="card h-100 bg-light border-0">
                                        <div class="card-body">
                                            <h6 class="fw-bold text-primary"><?php echo htmlspecialchars($addr['tipo_end_desc']); ?></h6>
                                            <p class="mb-1"><?php echo htmlspecialchars($addr['endereco']) . ", " . htmlspecialchars($addr['numero']); ?></p>
                                            <p class="mb-1"><?php echo htmlspecialchars($addr['bairro']) . " - " . htmlspecialchars($addr['cidade']); ?></p>
                                            <small class="text-muted">CEP: <?php echo htmlspecialchars($addr['cep']); ?></small>
                                            <?php if($addr['obs']): ?>
                                                <div class="mt-2 small text-info"><i class="bi bi-info-circle me-1"></i><?php echo htmlspecialchars($addr['obs']); ?></div>
                                            <?php endif; ?>
                                        </div>
                                    </div>
                                </div>
                                <?php endwhile; ?>
                            <?php else: ?>
                                <p class="text-muted">Nenhum endereço cadastrado.</p>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>

                <!-- Bank Accounts -->
                <div class="card shadow-sm border-0">
                    <div class="card-body">
                        <h4 class="section-title"><i class="bi bi-bank me-2"></i>Contas Bancárias</h4>
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead class="table-light">
                                    <tr>
                                        <th>Banco</th>
                                        <th>Agência</th>
                                        <th>Gerente</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php if ($result_bank && $result_bank->num_rows > 0): ?>
                                        <?php while($bank = $result_bank->fetch_assoc()): ?>
                                        <tr>
                                            <td><?php echo htmlspecialchars($bank['banco']); ?></td>
                                            <td><?php echo htmlspecialchars($bank['agencia']); ?></td>
                                            <td><?php echo htmlspecialchars($bank['gerente']); ?></td>
                                        </tr>
                                        <?php endwhile; ?>
                                    <?php else: ?>
                                        <tr><td colspan="3" class="text-center text-muted">Nenhuma conta bancária cadastrada.</td></tr>
                                    <?php endif; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
