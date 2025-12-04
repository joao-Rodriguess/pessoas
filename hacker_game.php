<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>DEFCON-1 - Sistema Global</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Share+Tech+Mono&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;user-select:none;cursor:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="10" fill="none" stroke="%2300ffff" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="%2300ffff"/></svg>') 12 12, crosshair}
        body{font-family:'Share Tech Mono',monospace;overflow:hidden;height:100vh;background:#000}
        #bg{position:fixed;top:0;left:0;width:100%;height:100%;background:url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=100') center/cover;z-index:-1}
        .tv-effect{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998}
        .scanlines{background:repeating-linear-gradient(0deg,rgba(0,0,0,.15) 0px,rgba(0,0,0,.15) 1px,transparent 1px,transparent 2px);animation:scanMove 10s linear infinite}
        @keyframes scanMove{from{background-position:0 0}to{background-position:0 100px}}
        .vhs-line{position:absolute;width:100%;height:3px;background:rgba(255,255,255,.1);animation:vhsLine 8s linear infinite}
        @keyframes vhsLine{0%{top:-10px}100%{top:100%}}
        #desktop{width:100%;height:calc(100% - 45px);position:relative}
        .icon{width:75px;padding:8px;text-align:center;cursor:pointer;position:absolute;border-radius:4px;transition:all .2s}
        .icon:hover{background:rgba(0,150,255,.3);transform:scale(1.1)}
        .icon .i{font-size:36px;filter:drop-shadow(0 0 5px #0ff)}
        .icon span{color:#0ff;font-size:9px;display:block;margin-top:5px;text-shadow:0 0 10px #0ff}
        #taskbar{width:100%;height:45px;background:linear-gradient(to top,rgba(0,20,40,.95),rgba(0,40,80,.9));border-top:1px solid #0af;position:fixed;bottom:0;display:flex;align-items:center;padding:0 10px}
        #start{width:45px;height:35px;background:linear-gradient(135deg,#0af,#06a);border:1px solid #0cf;border-radius:5px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:20px}
        #apps{flex:1;display:flex;gap:5px;padding:0 15px}
        .titem{height:30px;padding:0 12px;background:rgba(0,100,150,.5);border:1px solid #0af;border-radius:3px;display:flex;align-items:center;cursor:pointer;color:#0ff;font-size:10px}
        #tray{display:flex;align-items:center;gap:12px;color:#0ff;font-size:12px}
        #clock{padding:5px 12px;background:rgba(0,50,100,.5);border-radius:3px;font-family:'Orbitron'}
        .win{position:absolute;background:rgba(5,20,40,.95);border:1px solid #0af;border-radius:8px;box-shadow:0 10px 40px rgba(0,150,255,.4);display:none;min-width:300px}
        .win.active{display:block;animation:winOpen .3s}
        @keyframes winOpen{from{transform:scale(.9);opacity:0}to{transform:scale(1);opacity:1}}
        .wh{height:32px;background:linear-gradient(90deg,#0af,#06a);display:flex;align-items:center;justify-content:space-between;padding:0 8px;cursor:move;border-radius:7px 7px 0 0}
        .wt{color:#fff;font-size:11px;font-weight:bold}.wc{display:flex;gap:4px}
        .wb{width:18px;height:18px;border:none;border-radius:50%;cursor:pointer;font-size:10px}
        .bc{background:#f55}.bm{background:#fa0}.bx{background:#5f5}
        .wcont{padding:10px;height:calc(100% - 32px);overflow:auto;color:#0ff}
        .term{background:linear-gradient(180deg,#000510,#001020);color:#0f0;font-family:'Share Tech Mono';padding:15px;height:100%;border:1px solid #0a3;box-shadow:inset 0 0 50px rgba(0,255,0,.1)}
        .term .l{margin:4px 0;white-space:pre-wrap;text-shadow:0 0 8px #0f0}.term .e{color:#f44;text-shadow:0 0 5px #f44}.term .s{color:#4f4;text-shadow:0 0 5px #4f4}.term .w{color:#ff0;text-shadow:0 0 5px #ff0}.term .y{color:#0ff;text-shadow:0 0 5px #0ff}
        #ti{display:flex;margin-top:10px;padding:10px;background:rgba(0,50,0,.3);border:1px solid #0a3;border-radius:5px}#tp{color:#0f0;text-shadow:0 0 5px #0f0;font-weight:bold}#tin{background:0;border:0;color:#0f0;font-family:inherit;flex:1;outline:0;text-shadow:0 0 5px #0f0}
        .puzzle-modal{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.9);display:none;align-items:center;justify-content:center;z-index:10000}
        .puzzle-modal.active{display:flex}
        .puzzle-box{background:#0a1020;border:2px solid #0af;border-radius:10px;padding:30px;max-width:500px;color:#0ff;text-align:center}
        .puzzle-title{font-size:24px;color:#ff0;margin-bottom:20px;font-family:'Orbitron'}
        .puzzle-desc{margin-bottom:20px;line-height:1.6}
        .puzzle-input{width:100%;padding:15px;font-size:20px;background:#001020;border:2px solid #0af;color:#0ff;text-align:center;border-radius:5px;margin-bottom:15px}
        .puzzle-btns{display:flex;gap:10px;justify-content:center}
        .puzzle-btn{padding:12px 30px;border:none;border-radius:5px;cursor:pointer;font-size:14px;font-weight:bold}
        .puzzle-ok{background:#0a0;color:#fff}.puzzle-hint{background:#aa0;color:#000}.puzzle-cancel{background:#a00;color:#fff}
        .hack-target{background:rgba(0,30,60,.9);border:1px solid #0af;border-radius:8px;padding:15px;margin:10px 0;cursor:pointer;transition:all .2s}
        .hack-target:hover{background:rgba(0,60,100,.9)}
        .hack-target .ht-name{font-size:14px;color:#0ff;font-weight:bold}.hack-target .ht-desc{font-size:11px;color:#888;margin-top:5px}.hack-target .ht-status{float:right;font-size:20px}
        .progress-bar{width:100%;height:20px;background:#001020;border:1px solid #0af;border-radius:3px;margin:10px 0;overflow:hidden}
        .progress-fill{height:100%;background:linear-gradient(90deg,#0af,#0f0);transition:width .5s}
        .file-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:15px;padding:10px}
        .file-item{background:rgba(0,50,100,.3);border:1px solid #0af;border-radius:8px;padding:15px;text-align:center;cursor:pointer;transition:all .2s}
        .file-item:hover{background:rgba(0,100,150,.5);transform:translateY(-3px)}
        .file-item .fi{font-size:32px;margin-bottom:8px}.file-item span{font-size:10px;color:#0ff}
        .elist{border:1px solid #0af;margin-bottom:10px}.eitem{padding:8px;border-bottom:1px solid #0af;cursor:pointer}.eitem:hover{background:rgba(0,150,255,.2)}.eitem.u{border-left:3px solid #f00}.esn{font-weight:bold;color:#0ff;font-size:11px}.esb{color:#888;font-size:10px}.eview{border:1px solid #0af;padding:12px;background:#001020;min-height:120px;font-size:12px}
        #mp{background:#0a0a1a;padding:15px;height:100%;color:#0f0}.mh{text-align:center;border-bottom:2px solid #f00;padding-bottom:12px;margin-bottom:15px}.mh h2{color:#f00;font-family:'Orbitron';animation:blink 1s infinite}@keyframes blink{50%{opacity:.5}}.mg{display:grid;grid-template-columns:1fr 1fr;gap:12px}.mb{border:1px solid #0f0;padding:12px;border-radius:5px}.mb h3{color:#ff0;margin-bottom:8px;font-size:12px}.led{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:6px}.lr{background:#f00;box-shadow:0 0 8px #f00}.lg{background:#0f0;box-shadow:0 0 8px #0f0}.ly{background:#ff0;box-shadow:0 0 8px #ff0}.cf{width:100%;padding:10px;background:#000;border:1px solid #0f0;color:#0f0;font-size:18px;text-align:center;letter-spacing:6px;margin:8px 0}.btn{padding:10px 20px;border:0;border-radius:5px;cursor:pointer;font-weight:bold;font-size:12px}.bv{background:#0a0;color:#fff}.ba{background:#a00;color:#fff}.ba:disabled{background:#444;cursor:not-allowed}#cd{font-size:42px;font-family:'Orbitron';text-align:center;color:#f00}
        #fbi{position:fixed;top:0;left:0;width:100%;height:100%;background:#000;display:none;flex-direction:column;align-items:center;justify-content:center;z-index:9999;color:#fff}#fbi.active{display:flex}.fbit{font-size:42px;color:#f00;animation:blink .5s infinite}
        #vic{position:fixed;top:0;left:0;width:100%;height:100%;background:linear-gradient(135deg,#0a2e0a,#1a4a1a);display:none;flex-direction:column;align-items:center;justify-content:center;z-index:9999;color:#0f0}#vic.active{display:flex}
        #trace{position:fixed;top:0;left:0;right:0;height:28px;background:rgba(20,0,0,.9);display:none;align-items:center;padding:0 15px;z-index:999;border-bottom:2px solid #f00}#trace.active{display:flex}.tl{color:#f00;font-weight:bold;margin-right:12px;font-size:11px}.tb{flex:1;height:14px;background:#200;border:1px solid #f00;border-radius:3px;overflow:hidden}.tf{height:100%;background:linear-gradient(90deg,#f00,#f44);width:0%}.tp{color:#f00;margin-left:8px;font-weight:bold;font-size:11px}
        #sm{display:none;position:absolute;bottom:45px;left:0;width:280px;background:rgba(5,20,40,.98);border:1px solid #0af;border-radius:8px 8px 0 0;padding:10px}#sm.active{display:block}.smi{padding:8px;cursor:pointer;border-radius:4px;font-size:11px;color:#0ff}.smi:hover{background:rgba(0,150,255,.3)}
        #np{width:100%;height:100%;background:#ffffea;color:#000;border:0;padding:10px;font-family:'Courier New';resize:none;outline:0}
        .cdisp{width:100%;padding:12px;background:#001020;border:1px solid #0af;color:#0ff;font-size:20px;text-align:right;margin-bottom:8px}
        .cg{display:grid;grid-template-columns:repeat(4,1fr);gap:4px}
        .cb{padding:12px;background:#0a3050;border:1px solid #0af;color:#0ff;font-size:16px;cursor:pointer}.cb:hover{background:#0a4060}.cb.o{background:#0af;color:#000}
        #paint{background:#fff;cursor:crosshair}
        .ptools{display:flex;gap:5px;padding:8px;background:#0a0a1a;border-bottom:1px solid #0af}
        .ptools button{padding:5px 10px;background:#0a3050;border:1px solid #0af;color:#0ff;cursor:pointer;font-size:10px}
        #browser{background:#1a1a2e;height:100%;display:flex;flex-direction:column}
        .bbar{display:flex;gap:5px;padding:8px;background:#0a0a1a;border-bottom:1px solid #0af}
        .bbar input{flex:1;padding:6px;background:#001020;border:1px solid #0af;color:#0ff;border-radius:3px;font-size:11px}
        .bbar button{padding:6px 12px;background:#0af;border:0;color:#000;border-radius:3px;cursor:pointer}
        .bcont{flex:1;background:#fff}.bcont iframe{width:100%;height:100%;border:none}
        #music{text-align:center;padding:20px}
        .mcover{width:150px;height:150px;background:linear-gradient(135deg,#0af,#06a);border-radius:10px;margin:0 auto 15px;display:flex;align-items:center;justify-content:center;font-size:50px}
        .mctrl{display:flex;justify-content:center;gap:15px;margin-top:15px}
        .mctrl button{width:40px;height:40px;border-radius:50%;background:#0a3050;border:1px solid #0af;color:#0ff;cursor:pointer;font-size:16px}
    </style>
</head>
<body>
<div class="tv-effect scanlines"></div>
<div class="tv-effect"><div class="vhs-line"></div><div class="vhs-line" style="animation-delay:3s"></div></div>
<div id="bg"></div>
<div id="desktop">
    <div class="icon" style="left:20px;top:20px" onclick="openW('term')"><div class="i">💻</div><span>Terminal</span></div>
    <div class="icon" style="left:20px;top:100px" onclick="openW('hack')"><div class="i">👾</div><span>HackTools</span></div>
    <div class="icon" style="left:20px;top:180px" onclick="openW('email')"><div class="i">📧</div><span>Email</span></div>
    <div class="icon" style="left:20px;top:260px" onclick="openW('files')"><div class="i">📁</div><span>Arquivos</span></div>
    <div class="icon" style="left:20px;top:340px" onclick="openW('db')"><div class="i">🗄️</div><span>Database</span></div>
    <div class="icon" style="left:100px;top:20px" onclick="openW('missile')" id="micon"><div class="i">🚀</div><span>DEFCON-1</span></div>
    <div class="icon" style="left:100px;top:100px" onclick="openW('bank')"><div class="i">🏦</div><span>Banco</span></div>
    <div class="icon" style="left:100px;top:180px" onclick="openW('power')"><div class="i">⚡</div><span>PowerGrid</span></div>
    <div class="icon" style="left:100px;top:260px" onclick="openW('sat')"><div class="i">🛰️</div><span>Satélite</span></div>
    <div class="icon" style="left:100px;top:340px" onclick="openW('cctv')"><div class="i">📹</div><span>CCTV</span></div>
    <div class="icon" style="left:180px;top:20px" onclick="openW('calc')"><div class="i">🔢</div><span>Calculadora</span></div>
    <div class="icon" style="left:180px;top:100px" onclick="openW('note')"><div class="i">📝</div><span>Notas</span></div>
    <div class="icon" style="left:180px;top:180px" onclick="openW('paint')"><div class="i">🎨</div><span>Paint</span></div>
    <div class="icon" style="left:180px;top:260px" onclick="openW('music')"><div class="i">🎵</div><span>Música</span></div>
    <div class="icon" style="left:180px;top:340px" onclick="openW('browser')"><div class="i">🌐</div><span>Browser</span></div>
</div>

<div class="win" id="w-term" style="width:650px;height:380px;left:150px;top:50px">
    <div class="wh" onmousedown="drag(event,'w-term')"><span class="wt">💻 Terminal</span><div class="wc"><button class="wb bc" onclick="closeW('term')">×</button></div></div>
    <div class="wcont" style="padding:0"><div class="term" id="tout"><div class="l y">╔═══ PENTAGON SECURE ═══╗</div><div class="l">Digite 'help'</div></div><div id="ti"><span id="tp">guest$ </span><input id="tin" autofocus></div></div>
</div>

<div class="win" id="w-hack" style="width:500px;height:450px;left:180px;top:60px">
    <div class="wh" onmousedown="drag(event,'w-hack')"><span class="wt">👾 HackTools</span><div class="wc"><button class="wb bc" onclick="closeW('hack')">×</button></div></div>
    <div class="wcont">
        <div class="hack-target" onclick="hackFirewall()"><span class="ht-status" id="fw-status">🔴</span><div class="ht-name">🛡️ Firewall</div><div class="ht-desc">Sistema de proteção</div></div>
        <div class="hack-target" onclick="hackEncryption()"><span class="ht-status" id="enc-status">🔴</span><div class="ht-name">🔐 Criptografia</div><div class="ht-desc">Descriptografar arquivos</div></div>
        <div class="hack-target" onclick="hackAuth()"><span class="ht-status" id="auth-status">🔴</span><div class="ht-name">🔑 Autenticação 2FA</div><div class="ht-desc">Bypassar login</div></div>
        <div class="hack-target" onclick="hackDatabase()"><span class="ht-status" id="db-status">🔴</span><div class="ht-name">🗄️ SQL Injection</div><div class="ht-desc">Acessar banco de dados</div></div>
        <div class="hack-target" onclick="hackNetwork()"><span class="ht-status" id="net-status">🔴</span><div class="ht-name">📡 Interceptar Rede</div><div class="ht-desc">Man-in-the-middle</div></div>
        <div style="margin-top:15px;padding:10px;background:#001020;border-radius:5px">
            <div style="color:#ff0">Progresso:</div>
            <div class="progress-bar"><div class="progress-fill" id="hack-progress" style="width:0%"></div></div>
            <div style="text-align:center;color:#888" id="hack-pct">0%</div>
        </div>
    </div>
</div>

<div class="win" id="w-email" style="width:550px;height:380px;left:200px;top:80px">
    <div class="wh" onmousedown="drag(event,'w-email')"><span class="wt">📧 Email</span><div class="wc"><button class="wb bc" onclick="closeW('email')">×</button></div></div>
    <div class="wcont"><div class="elist"><div class="eitem u" onclick="sE(0)"><div class="esn">🔴 Gen. Webb</div><div class="esb">Códigos URGENTE</div></div><div class="eitem" onclick="sE(1)"><div class="esn">Dr. Chen</div><div class="esb">Senha Admin</div></div><div class="eitem" onclick="sE(2)"><div class="esn">Sistema</div><div class="esb">Código Beta</div></div><div class="eitem" onclick="sE(3)"><div class="esn">🏦 Banco</div><div class="esb">Cofre</div></div></div><div class="eview" id="ev">Selecione um email</div></div>
</div>

<div class="win" id="w-files" style="width:500px;height:380px;left:220px;top:100px">
    <div class="wh" onmousedown="drag(event,'w-files')"><span class="wt">📁 Arquivos</span><div class="wc"><button class="wb bc" onclick="closeW('files')">×</button></div></div>
    <div class="wcont"><div class="file-grid"><div class="file-item" onclick="openFile('zeus')"><div class="fi">📄</div><span>projeto_zeus</span></div><div class="file-item" onclick="openFile('codes')"><div class="fi">🔐</div><span>codigos</span></div><div class="file-item" onclick="openFile('logs')"><div class="fi">📋</div><span>logs</span></div><div class="file-item" onclick="openFile('bank')"><div class="fi">💰</div><span>bank</span></div><div class="file-item" onclick="openFile('power')"><div class="fi">⚡</div><span>grid</span></div><div class="file-item" onclick="openFile('cctv')"><div class="fi">📹</div><span>cameras</span></div></div></div>
</div>

<div class="win" id="w-db" style="width:550px;height:400px;left:200px;top:70px">
    <div class="wh" onmousedown="drag(event,'w-db')"><span class="wt">🗄️ Database</span><div class="wc"><button class="wb bc" onclick="closeW('db')">×</button></div></div>
    <div class="wcont">
        <div style="color:#ff0;margin-bottom:10px">SQL Query:</div>
        <input type="text" id="sql-input" style="width:100%;padding:10px;background:#001020;border:1px solid #0af;color:#0f0;font-family:monospace" placeholder="SELECT * FROM users">
        <button onclick="runSQL()" style="margin:10px 0;padding:10px 20px;background:#0af;border:none;color:#000;cursor:pointer;border-radius:3px">Execute</button>
        <div id="sql-result" style="background:#000;padding:15px;border:1px solid #0af;min-height:150px;font-family:monospace;font-size:12px;color:#0f0">Aguardando...</div>
    </div>
</div>

<div class="win" id="w-bank" style="width:500px;height:400px;left:220px;top:80px">
    <div class="wh" style="background:linear-gradient(90deg,#d4af37,#aa8800)" onmousedown="drag(event,'w-bank')"><span class="wt">🏦 Banco</span><div class="wc"><button class="wb bc" onclick="closeW('bank')">×</button></div></div>
    <div class="wcont">
        <div style="text-align:center;padding:20px;background:#001020;border-radius:5px;margin-bottom:15px">
            <div style="color:#888">Saldo:</div>
            <div style="font-size:32px;color:#0f0;font-family:'Orbitron'" id="bank-balance">$0.00</div>
        </div>
        <div class="hack-target" onclick="hackBankVault()"><span class="ht-status" id="vault-status">🔴</span><div class="ht-name">🔐 Cofre</div><div class="ht-desc">Contas offshore</div></div>
        <div class="hack-target" onclick="hackTransfer()"><span class="ht-status" id="transfer-status">🔴</span><div class="ht-name">💸 Transferência</div><div class="ht-desc">Redirecionar fundos</div></div>
    </div>
</div>

<div class="win" id="w-power" style="width:550px;height:400px;left:180px;top:60px">
    <div class="wh" style="background:linear-gradient(90deg,#ff6600,#cc4400)" onmousedown="drag(event,'w-power')"><span class="wt">⚡ PowerGrid</span><div class="wc"><button class="wb bc" onclick="closeW('power')">×</button></div></div>
    <div class="wcont">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px">
            <div class="hack-target" onclick="hackPowerSector('east')"><span class="ht-status" id="power-east">🟢</span><div class="ht-name">Leste</div><div class="ht-desc">15.2 GW</div></div>
            <div class="hack-target" onclick="hackPowerSector('west')"><span class="ht-status" id="power-west">🟢</span><div class="ht-name">Oeste</div><div class="ht-desc">18.7 GW</div></div>
            <div class="hack-target" onclick="hackPowerSector('north')"><span class="ht-status" id="power-north">🟢</span><div class="ht-name">Norte</div><div class="ht-desc">12.1 GW</div></div>
            <div class="hack-target" onclick="hackPowerSector('south')"><span class="ht-status" id="power-south">🟢</span><div class="ht-name">Sul</div><div class="ht-desc">20.5 GW</div></div>
        </div>
    </div>
</div>

<div class="win" id="w-cctv" style="width:600px;height:400px;left:160px;top:50px">
    <div class="wh" onmousedown="drag(event,'w-cctv')"><span class="wt">📹 CCTV</span><div class="wc"><button class="wb bc" onclick="closeW('cctv')">×</button></div></div>
    <div class="wcont">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
            <div style="background:#000;height:100px;border:1px solid #0af;display:flex;align-items:center;justify-content:center"><span style="color:#0f0">CAM-01: Lobby</span></div>
            <div style="background:#000;height:100px;border:1px solid #0af;display:flex;align-items:center;justify-content:center"><span style="color:#0f0">CAM-02: Server</span></div>
            <div style="background:#000;height:100px;border:1px solid #0af;display:flex;align-items:center;justify-content:center"><span style="color:#888">CAM-03: OFFLINE</span></div>
            <div style="background:#000;height:100px;border:1px solid #0af;display:flex;align-items:center;justify-content:center"><span style="color:#0f0">CAM-04: Control</span></div>
        </div>
        <button onclick="disableCCTV()" style="margin-top:15px;padding:10px 30px;background:#a00;border:none;color:#fff;cursor:pointer;border-radius:3px;width:100%">🚫 Desativar</button>
    </div>
</div>

<div class="win" id="w-sat" style="width:700px;height:450px;left:150px;top:40px">
    <div class="wh" onmousedown="drag(event,'w-sat')"><span class="wt">🛰️ Satélite</span><div class="wc"><button class="wb bc" onclick="closeW('sat')">×</button></div></div>
    <div class="wcont" style="padding:0;background:url('map.png') center/cover;height:100%;position:relative">
        <div style="position:absolute;top:30%;left:20%;width:15px;height:15px;background:#f00;border-radius:50%;animation:pulse 1s infinite" onclick="alert('SILO-01 Montana')"></div>
        <div style="position:absolute;top:35%;left:25%;width:15px;height:15px;background:#f00;border-radius:50%;animation:pulse 1s infinite"></div>
        <div style="position:absolute;top:40%;left:22%;width:15px;height:15px;background:#f00;border-radius:50%;animation:pulse 1s infinite"></div>
        <div style="position:absolute;bottom:10px;left:10px;background:rgba(0,0,0,.8);padding:10px;border:1px solid #0af;font-size:11px">DEFCON: <span style="color:#f00">1</span></div>
    </div>
</div>
<style>@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.3)}}</style>

<div class="win" id="w-missile" style="width:750px;height:450px;left:100px;top:30px">
    <div class="wh" style="background:linear-gradient(90deg,#a00,#600)" onmousedown="drag(event,'w-missile')"><span class="wt">🚀 DEFCON-1</span><div class="wc"><button class="wb bc" onclick="closeW('missile')">×</button></div></div>
    <div class="wcont" style="padding:0"><div id="mp"><div class="mh"><h2>⚠️ MISSILE CONTROL ⚠️</h2></div><div class="mg"><div class="mb"><h3>🔐 Código Alpha</h3><input class="cf" id="ac" maxlength="6" placeholder="______"><button class="btn bv" onclick="vA()">OK</button></div><div class="mb"><h3>🔐 Código Beta</h3><input class="cf" id="bc" maxlength="6" placeholder="______" disabled><button class="btn bv" onclick="vB()" id="bb" disabled>OK</button></div><div class="mb"><h3>📡 Silos</h3><p><span class="led lr" id="s1"></span>Montana</p><p><span class="led lr" id="s2"></span>Wyoming</p><p><span class="led lr" id="s3"></span>Colorado</p></div><div class="mb"><h3>⏱️ Countdown</h3><div id="cd">--:--</div></div></div><button class="btn ba" id="ab" onclick="aM()" disabled style="display:block;margin:15px auto;padding:12px 40px;font-size:16px">🛑 ABORT</button></div></div>
</div>

<div class="win" id="w-calc" style="width:260px;height:340px;left:350px;top:100px">
    <div class="wh" onmousedown="drag(event,'w-calc')"><span class="wt">🔢 Calculadora</span><div class="wc"><button class="wb bc" onclick="closeW('calc')">×</button></div></div>
    <div class="wcont"><input class="cdisp" id="cdisp" readonly value="0"><div class="cg"><button class="cb" onclick="cP('7')">7</button><button class="cb" onclick="cP('8')">8</button><button class="cb" onclick="cP('9')">9</button><button class="cb o" onclick="cP('/')">/</button><button class="cb" onclick="cP('4')">4</button><button class="cb" onclick="cP('5')">5</button><button class="cb" onclick="cP('6')">6</button><button class="cb o" onclick="cP('*')">*</button><button class="cb" onclick="cP('1')">1</button><button class="cb" onclick="cP('2')">2</button><button class="cb" onclick="cP('3')">3</button><button class="cb o" onclick="cP('-')">-</button><button class="cb" onclick="cP('0')">0</button><button class="cb" onclick="cC()">C</button><button class="cb o" onclick="cE()">=</button><button class="cb o" onclick="cP('+')">+</button></div></div>
</div>

<div class="win" id="w-note" style="width:380px;height:280px;left:300px;top:150px">
    <div class="wh" onmousedown="drag(event,'w-note')"><span class="wt">📝 Notas</span><div class="wc"><button class="wb bc" onclick="closeW('note')">×</button></div></div>
    <div class="wcont" style="padding:0"><textarea id="np" placeholder="Anote aqui..."></textarea></div>
</div>

<div class="win" id="w-paint" style="width:500px;height:400px;left:180px;top:50px">
    <div class="wh" onmousedown="drag(event,'w-paint')"><span class="wt">🎨 Paint</span><div class="wc"><button class="wb bc" onclick="closeW('paint')">×</button></div></div>
    <div class="wcont" style="padding:0"><div class="ptools"><button onclick="pCol='#f00'">🔴</button><button onclick="pCol='#0f0'">🟢</button><button onclick="pCol='#00f'">🔵</button><button onclick="pCol='#ff0'">🟡</button><button onclick="pCol='#000'">⚫</button><button onclick="clearCanvas()">Limpar</button></div><canvas id="paint" width="498" height="330"></canvas></div>
</div>

<div class="win" id="w-music" style="width:300px;height:320px;left:320px;top:120px">
    <div class="wh" onmousedown="drag(event,'w-music')"><span class="wt">🎵 Música</span><div class="wc"><button class="wb bc" onclick="closeW('music')">×</button></div></div>
    <div class="wcont"><div id="music"><div class="mcover">🎵</div><div style="color:#0ff">Cyber Beats</div><div style="color:#888;font-size:11px">Electronic</div><div class="mctrl"><button>⏮️</button><button onclick="this.textContent=this.textContent==='▶️'?'⏸️':'▶️'">▶️</button><button>⏭️</button></div></div></div>
</div>

<div class="win" id="w-browser" style="width:700px;height:500px;left:150px;top:40px">
    <div class="wh" onmousedown="drag(event,'w-browser')"><span class="wt">🌐 Browser</span><div class="wc"><button class="wb bc" onclick="closeW('browser')">×</button></div></div>
    <div class="wcont" style="padding:0"><div id="browser"><div class="bbar"><button>←</button><button>→</button><input id="url" value="https://www.wikipedia.org"><button onclick="loadUrl()">Go</button></div><div class="bcont"><iframe id="bframe" src="https://www.wikipedia.org"></iframe></div></div></div>
</div>

<div id="taskbar">
    <div id="start" onclick="toggleStart()">⊞</div>
    <div id="apps"></div>
    <div id="tray"><span>🔊</span><span>📶</span><div id="clock">--:--</div></div>
</div>

<div id="sm">
    <div class="smi" onclick="openW('term')">💻 Terminal</div>
    <div class="smi" onclick="openW('hack')">👾 HackTools</div>
    <div class="smi" onclick="openW('calc')">🔢 Calculadora</div>
    <div class="smi" onclick="openW('note')">📝 Notas</div>
    <div class="smi" onclick="openW('paint')">🎨 Paint</div>
    <div class="smi" onclick="openW('browser')">🌐 Browser</div>
    <hr style="border-color:#0af;margin:8px 0">
    <div class="smi" style="color:#f55" onclick="location.reload()">⏻ Reiniciar</div>
</div>

<div class="puzzle-modal" id="puzzle-fw"><div class="puzzle-box"><div class="puzzle-title">🛡️ FIREWALL</div><div class="puzzle-desc">F(n) = 2^n + n²<br><br>Se n = 4, F(n) = ?</div><input class="puzzle-input" id="fw-answer" placeholder="Resposta"><div class="puzzle-btns"><button class="puzzle-btn puzzle-ok" onclick="checkFirewall()">OK</button><button class="puzzle-btn puzzle-hint" onclick="alert('2^4=16, 4²=16')">Dica</button><button class="puzzle-btn puzzle-cancel" onclick="closePuzzle('fw')">X</button></div></div></div>
<div class="puzzle-modal" id="puzzle-enc"><div class="puzzle-box"><div class="puzzle-title">🔐 DECRYPT</div><div class="puzzle-desc">César +3: VHQKD = ?</div><input class="puzzle-input" id="enc-answer" placeholder="Resposta"><div class="puzzle-btns"><button class="puzzle-btn puzzle-ok" onclick="checkEncryption()">OK</button><button class="puzzle-btn puzzle-hint" onclick="alert('V-3=S')">Dica</button><button class="puzzle-btn puzzle-cancel" onclick="closePuzzle('enc')">X</button></div></div></div>
<div class="puzzle-modal" id="puzzle-auth"><div class="puzzle-box"><div class="puzzle-title">🔑 2FA</div><div class="puzzle-desc">(hora×1000)+(min×10)<br>14:35 = ?</div><input class="puzzle-input" id="auth-answer" placeholder="Código"><div class="puzzle-btns"><button class="puzzle-btn puzzle-ok" onclick="checkAuth()">OK</button><button class="puzzle-btn puzzle-hint" onclick="alert('14×1000+35×10')">Dica</button><button class="puzzle-btn puzzle-cancel" onclick="closePuzzle('auth')">X</button></div></div></div>
<div class="puzzle-modal" id="puzzle-db"><div class="puzzle-box"><div class="puzzle-title">🗄️ SQL</div><div class="puzzle-desc">pass=' + ? = bypass</div><input class="puzzle-input" id="db-answer" placeholder="Injection"><div class="puzzle-btns"><button class="puzzle-btn puzzle-ok" onclick="checkDatabase()">OK</button><button class="puzzle-btn puzzle-hint" onclick="alert('OR 1=1')">Dica</button><button class="puzzle-btn puzzle-cancel" onclick="closePuzzle('db')">X</button></div></div></div>
<div class="puzzle-modal" id="puzzle-net"><div class="puzzle-box"><div class="puzzle-title">📡 IP</div><div class="puzzle-desc">11000000.10101000.00000001.00000001</div><input class="puzzle-input" id="net-answer" placeholder="x.x.x.x"><div class="puzzle-btns"><button class="puzzle-btn puzzle-ok" onclick="checkNetwork()">OK</button><button class="puzzle-btn puzzle-hint" onclick="alert('11000000=192')">Dica</button><button class="puzzle-btn puzzle-cancel" onclick="closePuzzle('net')">X</button></div></div></div>
<div class="puzzle-modal" id="puzzle-vault"><div class="puzzle-box"><div class="puzzle-title">🏦 COFRE</div><div class="puzzle-desc">2, 6, 12, 20, 30, ?</div><input class="puzzle-input" id="vault-answer" placeholder="Próximo"><div class="puzzle-btns"><button class="puzzle-btn puzzle-ok" onclick="checkVault()">OK</button><button class="puzzle-btn puzzle-hint" onclick="alert('+4,+6,+8,+10,+12')">Dica</button><button class="puzzle-btn puzzle-cancel" onclick="closePuzzle('vault')">X</button></div></div></div>

<div id="trace"><span class="tl">⚠️ TRACE:</span><div class="tb"><div class="tf" id="trf"></div></div><span class="tp" id="trp">0%</span></div>
<div id="fbi"><div style="font-size:80px">🛡️</div><div class="fbit">⚠️ FBI ⚠️</div><p style="font-size:18px;color:#f00;margin:15px">IDENTIFICADO</p><button onclick="location.reload()" style="padding:12px 30px;cursor:pointer;background:#444;color:#fff;border:0;border-radius:5px">🔄 Retry</button></div>
<div id="vic"><div style="font-size:80px">🎖️</div><h1 style="font-size:40px;margin:15px">MISSÃO COMPLETA</h1><p>Pontuação: <span id="fs">0</span></p><button onclick="location.reload()" style="padding:12px 30px;cursor:pointer;background:#0a0;color:#fff;border:0;border-radius:5px">🔄 Jogar</button></div>

<script>
const G={tr:0,tracing:0,admin:0,fw:0,enc:0,auth:0,db:0,net:0,vault:0,transfer:0,a:0,b:0,over:0,sc:0,hacks:0};
setInterval(()=>{document.getElementById('clock').textContent=new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit',second:'2-digit'})},1000);

let aW=null,dO={x:0,y:0};
function openW(n){const w=document.getElementById('w-'+n);if(w){w.classList.add('active');bF(w);uT();}if(n==='term')document.getElementById('tin').focus();document.getElementById('sm').classList.remove('active');}
function closeW(n){document.getElementById('w-'+n).classList.remove('active');uT();}
function bF(w){document.querySelectorAll('.win').forEach(x=>x.style.zIndex=1);w.style.zIndex=10;}
function drag(e,id){const w=document.getElementById(id);bF(w);aW=w;dO.x=e.clientX-w.offsetLeft;dO.y=e.clientY-w.offsetTop;document.onmousemove=e=>{if(aW){aW.style.left=(e.clientX-dO.x)+'px';aW.style.top=(e.clientY-dO.y)+'px';}};document.onmouseup=()=>{aW=null;document.onmousemove=null;};}
function uT(){const a=document.getElementById('apps');a.innerHTML='';document.querySelectorAll('.win.active').forEach(w=>{const i=document.createElement('div');i.className='titem';i.textContent=w.querySelector('.wt').textContent.substring(0,12);i.onclick=()=>bF(w);a.appendChild(i);});}
function toggleStart(){document.getElementById('sm').classList.toggle('active');}

function updateHackProgress(){G.hacks=0;if(G.fw)G.hacks++;if(G.enc)G.hacks++;if(G.auth)G.hacks++;if(G.db)G.hacks++;if(G.net)G.hacks++;const pct=(G.hacks/5)*100;document.getElementById('hack-progress').style.width=pct+'%';document.getElementById('hack-pct').textContent=pct+'%';if(G.hacks>=3)document.getElementById('micon').style.display='block';}

function hackFirewall(){if(G.fw)return;document.getElementById('puzzle-fw').classList.add('active');startTr();}
function hackEncryption(){if(!G.fw){alert('Firewall primeiro!');return;}if(G.enc)return;document.getElementById('puzzle-enc').classList.add('active');}
function hackAuth(){if(!G.enc){alert('Decrypt primeiro!');return;}if(G.auth)return;document.getElementById('puzzle-auth').classList.add('active');}
function hackDatabase(){if(G.db)return;document.getElementById('puzzle-db').classList.add('active');startTr();}
function hackNetwork(){if(G.net)return;document.getElementById('puzzle-net').classList.add('active');startTr();}
function hackBankVault(){if(G.vault)return;document.getElementById('puzzle-vault').classList.add('active');startTr();}
function closePuzzle(id){document.getElementById('puzzle-'+id).classList.remove('active');}

function checkFirewall(){if(document.getElementById('fw-answer').value==='32'){G.fw=1;G.sc+=200;document.getElementById('fw-status').textContent='🟢';closePuzzle('fw');updateHackProgress();}else{G.tr+=10;alert('❌');}}
function checkEncryption(){if(document.getElementById('enc-answer').value.toUpperCase()==='SENHA'){G.enc=1;G.sc+=200;document.getElementById('enc-status').textContent='🟢';closePuzzle('enc');updateHackProgress();}else{G.tr+=10;alert('❌');}}
function checkAuth(){if(document.getElementById('auth-answer').value==='14350'){G.auth=1;G.sc+=300;document.getElementById('auth-status').textContent='🟢';G.admin=1;document.getElementById('tp').textContent='root# ';closePuzzle('auth');updateHackProgress();}else{G.tr+=10;alert('❌');}}
function checkDatabase(){const a=document.getElementById('db-answer').value.toLowerCase().replace(/\s/g,'');if(a.includes("or1=1")||a.includes("'or")){G.db=1;G.sc+=250;document.getElementById('db-status').textContent='🟢';closePuzzle('db');updateHackProgress();}else{G.tr+=10;alert('❌');}}
function checkNetwork(){if(document.getElementById('net-answer').value==='192.168.1.1'){G.net=1;G.sc+=250;document.getElementById('net-status').textContent='🟢';closePuzzle('net');updateHackProgress();}else{G.tr+=10;alert('❌');}}
function checkVault(){if(document.getElementById('vault-answer').value==='42'){G.vault=1;G.sc+=500;document.getElementById('vault-status').textContent='🟢';document.getElementById('bank-balance').textContent='$50,000,000';closePuzzle('vault');}else{G.tr+=10;alert('❌');}}
function hackTransfer(){if(!G.vault){alert('Cofre primeiro!');return;}G.transfer=1;G.sc+=500;document.getElementById('transfer-status').textContent='🟢';alert('💰 $50M transferidos!');}
function hackPowerSector(s){const el=document.getElementById('power-'+s);el.textContent=el.textContent==='🟢'?'🔴':'🟢';G.sc+=100;}
function disableCCTV(){G.sc+=200;alert('📹 Câmeras OFF!');}
function runSQL(){const q=document.getElementById('sql-input').value.toLowerCase();if(q.includes('select')){document.getElementById('sql-result').innerHTML='ID|USER|PASS\n1|admin|ALPHA1983\n2|root|missile24';G.sc+=50;}else{document.getElementById('sql-result').textContent='Erro';}}

document.getElementById('tin').onkeydown=e=>{if(e.key==='Enter'){const c=e.target.value.trim().toLowerCase();e.target.value='';tCmd(c);}};
function tP(t,c=''){document.getElementById('tout').innerHTML+=`<div class="l ${c}">${t}</div>`;document.getElementById('tout').scrollTop=99999;}
function tCmd(c){tP('$ '+c,'y');if(c==='help')tP('help,scan,status,clear');else if(c==='scan'){tP('Escaneando...','w');setTimeout(()=>{tP('✓ Alvos: firewall,encryption,auth,database,network','s');startTr();},1000);}else if(c==='status')tP(`FW:${G.fw?'✓':'✗'} ENC:${G.enc?'✓':'✗'} AUTH:${G.auth?'✓':'✗'} DB:${G.db?'✓':'✗'} NET:${G.net?'✓':'✗'}`);else if(c==='clear')document.getElementById('tout').innerHTML='';else tP('?','e');}

function startTr(){if(G.tracing)return;G.tracing=1;document.getElementById('trace').classList.add('active');setInterval(()=>{if(G.over)return;G.tr+=1;document.getElementById('trf').style.width=G.tr+'%';document.getElementById('trp').textContent=G.tr+'%';if(G.tr>=100)gO();},1000);}
function gO(){G.over=1;document.getElementById('fbi').classList.add('active');}
function vic(){G.over=1;document.getElementById('fs').textContent=G.sc;document.getElementById('vic').classList.add('active');}

const em=['<b>Webb:</b> Alpha: <b style="color:#0f0">742839</b>','<b>Chen:</b> Senha: ALPHA1983','<b>Sistema:</b> Beta: <b style="color:#0f0">470511</b>','<b>Banco:</b> Sequência: 2,6,12,20,30,? = 42'];
function sE(i){document.getElementById('ev').innerHTML=em[i];G.sc+=25;}
const files={zeus:'Beta = 470511',codes:'Decrypt: SENHA',logs:'Senha: ALPHA1983',bank:'+4,+6,+8,+10,+12',power:'192.168.1.x',cctv:'10.0.0.1-254'};
function openFile(f){alert(files[f]||'?');G.sc+=15;}

function vA(){if(document.getElementById('ac').value==='742839'){G.a=1;document.getElementById('s1').className='led lg';document.getElementById('s2').className='led ly';document.getElementById('bc').disabled=0;document.getElementById('bb').disabled=0;G.sc+=400;}else{G.tr+=15;alert('❌');}}
function vB(){if(document.getElementById('bc').value==='470511'){G.b=1;document.getElementById('s2').className='led lg';document.getElementById('s3').className='led lg';document.getElementById('ab').disabled=0;G.sc+=400;let s=30;setInterval(()=>{if(G.over)return;s--;document.getElementById('cd').textContent=`00:${s.toString().padStart(2,'0')}`;if(s<=0)gO();},1000);}else{G.tr+=15;alert('❌');}}
function aM(){G.sc+=1000;vic();}

let cv='';function cP(v){cv+=v;document.getElementById('cdisp').value=cv;}function cC(){cv='';document.getElementById('cdisp').value='0';}function cE(){try{document.getElementById('cdisp').value=eval(cv);cv='';}catch{document.getElementById('cdisp').value='Err';cv='';}}

const canvas=document.getElementById('paint'),ctx=canvas.getContext('2d');let pCol='#000',drawing=0;
canvas.onmousedown=()=>drawing=1;canvas.onmouseup=()=>drawing=0;canvas.onmouseleave=()=>drawing=0;
canvas.onmousemove=e=>{if(!drawing)return;const r=canvas.getBoundingClientRect();ctx.fillStyle=pCol;ctx.beginPath();ctx.arc(e.clientX-r.left,e.clientY-r.top,3,0,Math.PI*2);ctx.fill();};
function clearCanvas(){ctx.clearRect(0,0,canvas.width,canvas.height);}
function loadUrl(){document.getElementById('bframe').src=document.getElementById('url').value;}

document.getElementById('micon').style.display='none';
</script>
</body>
</html>