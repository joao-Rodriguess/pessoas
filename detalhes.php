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
<a href="delete.php?id=<?php echo $id; ?>" class="btn btn-danger w-100 mb-3 ms-2" onclick="return confirm('Tem certeza que deseja excluir esta pessoa?');"><i class="bi bi-trash me-2"></i>Excluir Cadastro</a>
                        
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
                <div class="d-flex justify-content-between mb-3">
    <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#addAccountModal"><i class="bi bi-plus-circle me-2"></i>Adicionar Conta Bancária</button>
    <button type="button" class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exportModal"><i class="bi bi-file-earmark-arrow-down me-2"></i>Exportar Contas</button>
</div>
                    <div class="card-body">
                        <h4 class="section-title"><i class="bi bi-bank me-2"></i>Contas Bancárias</h4>
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead class="table-light">
                                    <tr>
                                        <th>Banco</th>
                                        <th>Gerente</th>
                                        <th>Agência</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php if ($result_bank && $result_bank->num_rows > 0): ?>
                                        <?php while($bank = $result_bank->fetch_assoc()): ?>
                                        <tr>
                                            <td><?php echo htmlspecialchars($bank['banco']); ?></td>
                                            <td><?php echo htmlspecialchars($bank['gerente']); ?></td>
                                            <td><?php echo htmlspecialchars($bank['agencia']); ?></td>
                                            <td>
                                                <button type="button" class="btn btn-sm btn-primary me-1" 
                                                    data-bs-toggle="modal" 
                                                    data-bs-target="#editAccountModal"
                                                    data-bank-id="<?php echo $bank['idpessoas_conta_bancarias']; ?>"
                                                    data-banco="<?php echo htmlspecialchars($bank['banco']); ?>"
                                                    data-agencia="<?php echo htmlspecialchars($bank['agencia']); ?>"
                                                    data-gerente="<?php echo htmlspecialchars($bank['gerente']); ?>">
                                                    <i class="bi bi-pencil-square"></i>
                                                </button>
                                                <a href="delete_bank.php?id=<?php echo $id; ?>&bank_id=<?php echo $bank['idpessoas_conta_bancarias']; ?>" class="btn btn-sm btn-danger" onclick="return confirm('Tem certeza que deseja excluir esta conta?');"><i class="bi bi-trash"></i></a>
                                            </td>
                                        </tr>
                                        <?php endwhile; ?>
                                    <?php else: ?>
                                        <tr><td colspan="4" class="text-center text-muted">Nenhuma conta bancária cadastrada.</td></tr>
                                    <?php endif; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Export Modal -->
    <div class="modal fade" id="exportModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Exportar Contas Bancárias</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>Deseja exportar todas as contas bancárias desta pessoa para um arquivo CSV?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <a href="export_bank.php?id=<?php echo $id; ?>" class="btn btn-primary">Exportar</a>
                </div>
            </div>
        </div>
    </div>

    <!-- Edit Account Modal -->
    <div class="modal fade" id="editAccountModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Editar Conta Bancária</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form action="update_bank.php" method="POST">
                    <div class="modal-body">
                        <input type="hidden" name="id" value="<?php echo $id; ?>">
                        <input type="hidden" name="bank_id" id="edit_bank_id">
                        <div class="mb-3">
                            <label for="edit_banco" class="form-label">Banco</label>
                            <input type="text" class="form-control" id="edit_banco" name="banco" required>
                        </div>
                        <div class="mb-3">
                            <label for="edit_agencia" class="form-label">Agência</label>
                            <input type="text" class="form-control" id="edit_agencia" name="agencia" required>
                        </div>
                        <div class="mb-3">
                            <label for="edit_gerente" class="form-label">Gerente</label>
                            <input type="text" class="form-control" id="edit_gerente" name="gerente" required>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Salvar Alterações</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Add Account Modal -->
    <div class="modal fade" id="addAccountModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Adicionar Conta Bancária</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form action="insert_bank.php" method="POST">
                    <div class="modal-body">
                        <input type="hidden" name="id" value="<?php echo $id; ?>">
                        <div class="mb-3">
                            <label for="add_banco" class="form-label">Banco</label>
                            <input type="text" class="form-control" id="add_banco" name="banco" required>
                        </div>
                        <div class="mb-3">
                            <label for="add_agencia" class="form-label">Agência</label>
                            <input type="text" class="form-control" id="add_agencia" name="agencia" required>
                        </div>
                        <div class="mb-3">
                            <label for="add_gerente" class="form-label">Gerente</label>
                            <input type="text" class="form-control" id="add_gerente" name="gerente" required>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" class="btn btn-success">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        const editAccountModal = document.getElementById('editAccountModal');
        editAccountModal.addEventListener('show.bs.modal', event => {
            const button = event.relatedTarget;
            const bankId = button.getAttribute('data-bank-id');
            const banco = button.getAttribute('data-banco');
            const agencia = button.getAttribute('data-agencia');
            const gerente = button.getAttribute('data-gerente');

            const modalBodyInputId = editAccountModal.querySelector('#edit_bank_id');
            const modalBodyInputBanco = editAccountModal.querySelector('#edit_banco');
            const modalBodyInputAgencia = editAccountModal.querySelector('#edit_agencia');
            const modalBodyInputGerente = editAccountModal.querySelector('#edit_gerente');

            modalBodyInputId.value = bankId;
            modalBodyInputBanco.value = banco;
            modalBodyInputAgencia.value = agencia;
            modalBodyInputGerente.value = gerente;
        });
    </script>
</body>
</html>
