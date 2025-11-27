<?php include 'db.php'; ?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard de Pessoas</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div class="container">
            <a class="navbar-brand" href="index.php"><i class="bi bi-people-fill me-2"></i>Gestão de Pessoas</a>
        </div>
    </nav>

    <div class="container">
        <div class="row mb-4 align-items-center">
            <div class="col-md-6">
                <h2 class="text-primary">Lista de Cadastros</h2>
                <p class="text-muted">Visualize e gerencie as pessoas cadastradas no sistema.</p>
            </div>
            <div class="col-md-6 text-md-end">
                <a href="cadastro.php" class="btn btn-success btn-lg"><i class="bi bi-plus-circle me-2"></i>Novo Cadastro</a>
            </div>
        </div>

        <!-- Search Bar -->
        <div class="card mb-4 border-0 shadow-sm">
            <div class="card-body">
                <form action="index.php" method="GET" class="row g-3">
                    <div class="col-md-10">
                        <div class="input-group">
                            <span class="input-group-text bg-white border-end-0"><i class="bi bi-search text-muted"></i></span>
                            <input type="text" name="busca" class="form-control border-start-0" placeholder="Buscar por nome, email ou CPF..." value="<?php echo isset($_GET['busca']) ? htmlspecialchars($_GET['busca']) : ''; ?>">
                        </div>
                    </div>
                    <div class="col-md-2">
                        <button type="submit" class="btn btn-primary w-100">Filtrar</button>
                    </div>
                </form>
            </div>
        </div>

        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            <?php
            $busca = isset($_GET['busca']) ? $conn->real_escape_string($_GET['busca']) : '';
            $sql = "SELECT p.*, s.pessoa_situacao_desc, t.descricao as tipo_desc 
                    FROM table_pessoa p 
                    LEFT JOIN pessoa_situacao s ON p.pessoa_situacao_idpessoa_situacao = s.idpessoa_situacao
                    LEFT JOIN tab_tipo_pessoa t ON p.tab_tipo_pessoa_idtab_tipo_pessoa = t.idtab_tipo_pessoa
                    WHERE p.pessoa_nome LIKE '%$busca%' OR p.pessoa_email LIKE '%$busca%'
                    ORDER BY p.pessoa_nome ASC";
            $result = $conn->query($sql);

            if ($result && $result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    $statusColor = 'secondary';
                    if ($row['pessoa_situacao_desc'] == 'Ativo') $statusColor = 'success';
                    if ($row['pessoa_situacao_desc'] == 'Inativo') $statusColor = 'danger';
                    if ($row['pessoa_situacao_desc'] == 'Bloqueado') $statusColor = 'warning';
            ?>
            <div class="col">
                <div class="card h-100 border-0 shadow-sm card-person" onclick="window.location='detalhes.php?id=<?php echo $row['pessoa_id']; ?>'">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title text-dark fw-bold mb-0"><?php echo htmlspecialchars($row['pessoa_nome']); ?></h5>
                            <span class="badge bg-<?php echo $statusColor; ?> status-badge"><?php echo htmlspecialchars($row['pessoa_situacao_desc']); ?></span>
                        </div>
                        <h6 class="card-subtitle mb-3 text-muted"><i class="bi bi-tag me-1"></i><?php echo htmlspecialchars($row['tipo_desc']); ?></h6>
                        
                        <p class="card-text mb-1"><i class="bi bi-envelope me-2 text-primary"></i><?php echo htmlspecialchars($row['pessoa_email']); ?></p>
                        <p class="card-text"><i class="bi bi-telephone me-2 text-primary"></i><?php echo htmlspecialchars($row['pessoa_celular']); ?></p>
                    </div>
                    <div class="card-footer bg-white border-0 pt-0 pb-3">
                        <a href="detalhes.php?id=<?php echo $row['pessoa_id']; ?>" class="btn btn-outline-primary w-100 btn-sm">Ver Detalhes</a>
                    </div>
                </div>
            </div>
            <?php
                }
            } else {
                echo '<div class="col-12"><div class="alert alert-info">Nenhum registro encontrado.</div></div>';
            }
            ?>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>