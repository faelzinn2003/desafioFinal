const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function validarNome(nome) {
    const valor = nome.trim();
    if (!valor) {
        return 'Nome é obrigatório';
    }
    if (valor.length < 3 || valor.length > 50) {
        return 'Nome deve ter entre 3 e 50 caracteres';
    }
    return '';
}

function validarSobrenome(sobrenome) {
    const valor = sobrenome.trim();
    if (!valor) {
        return 'Sobrenome é obrigatório';
    }
    if (valor.length < 3 || valor.length > 50) {
        return 'Sobrenome deve ter entre 3 e 50 caracteres';
    }
    return '';
}

function validarEmail(email) {
    const valor = email.trim();
    if (!valor) {
        return 'Email é obrigatório';
    }
    if (!regexEmail.test(valor)) {
        return 'Email inválido';
    }
    return '';
}

function validarIdade(idade) {
    if (!idade) {
        return 'Idade é obrigatória';
    }
    
    const numero = parseInt(idade);
    if (isNaN(numero)) {
        return 'Idade deve ser um número';
    }
    if (!Number.isInteger(numero)) {
        return 'Idade deve ser um número inteiro';
    }
    if (numero < 1) {
        return 'Idade deve ser positiva';
    }
    if (numero >= 120) {
        return 'Idade deve ser menor que 120';
    }
    return '';
}

function validarSenha(senha) {
    if (!senha) {
        return 'Senha é obrigatória';
    }
    if (senha.length < 6) {
        return 'Senha deve ter pelo menos 6 caracteres';
    }
    return '';
}

function mostrarErro(campo, mensagem) {
    const small = campo.parentElement.querySelector('.mensagem-erro');
    
    if (mensagem) {
        campo.classList.add('error');
        campo.classList.remove('success');
        small.textContent = mensagem;
    } else {
        campo.classList.remove('error');
        campo.classList.add('success');
        small.textContent = '';
    }
}

function validarFormularioCompleto() {
    const campos = [
        { id: 'nome', validar: validarNome },
        { id: 'sobrenome', validar: validarSobrenome },
        { id: 'email', validar: validarEmail },
        { id: 'idade', validar: validarIdade },
        { id: 'senha', validar: validarSenha }
    ];
    
    let formularioValido = true;
    
    campos.forEach(({ id, validar }) => {
        const campo = document.getElementById(id);
        if (campo) {
            const erro = validar(campo.value);
            mostrarErro(campo, erro);
            if (erro) formularioValido = false;
        }
    });
    
    return formularioValido;
}

if (document.getElementById('formulario-cadastro')) {
    const formulario = document.getElementById('formulario-cadastro');
    
    formulario.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validarFormularioCompleto()) {
            const dados = {
                nome: document.getElementById('nome').value.trim(),
                sobrenome: document.getElementById('sobrenome').value.trim(),
                email: document.getElementById('email').value.trim(),
                idade: document.getElementById('idade').value,
                senha: '***',
                dataCadastro: new Date().toLocaleString('pt-BR')
            };
            
            sessionStorage.setItem('dadosFormulario', JSON.stringify(dados));
            window.location.href = 'confirmation.html';
        }
    });
    
    const camposValidacao = ['nome', 'sobrenome', 'email', 'idade', 'senha'];
    camposValidacao.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.addEventListener('blur', function() {
                let erro = '';
                switch(id) {
                    case 'nome': erro = validarNome(this.value); break;
                    case 'sobrenome': erro = validarSobrenome(this.value); break;
                    case 'email': erro = validarEmail(this.value); break;
                    case 'idade': erro = validarIdade(this.value); break;
                    case 'senha': erro = validarSenha(this.value); break;
                }
                mostrarErro(this, erro);
            });
            
            campo.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    mostrarErro(this, '');
                }
            });
        }
    });
}

if (document.getElementById('dados-usuario')) {
    document.addEventListener('DOMContentLoaded', function() {
        const dados = JSON.parse(sessionStorage.getItem('dadosFormulario'));
        
        if (!dados) {
            document.getElementById('dados-usuario').innerHTML = 
                '<p style="color: var(--cor-erro); text-align: center;">Nenhum dado encontrado. Por favor, volte ao formulário.</p>';
            return;
        }
        
        document.getElementById('dados-usuario').innerHTML = `
            <p><strong>Nome:</strong> ${dados.nome}</p>
            <p><strong>Sobrenome:</strong> ${dados.sobrenome}</p>
            <p><strong>Email:</strong> ${dados.email}</p>
            <p><strong>Idade:</strong> ${dados.idade} anos</p>
            <p><strong>Senha:</strong> ${dados.senha}</p>
            <p><strong>Data de envio:</strong> ${dados.dataCadastro}</p>
        `;
        
        document.getElementById('btn-editar').addEventListener('click', function() {
            window.history.back();
        });
        
        document.getElementById('btn-confirmar').addEventListener('click', function() {
            localStorage.setItem('ultimoCadastro', JSON.stringify(dados));
            
            document.getElementById('btn-editar').disabled = true;
            document.getElementById('btn-confirmar').disabled = true;
            
            const mensagemSucesso = document.getElementById('mensagem-sucesso');
            let segundos = 3;
            
            mensagemSucesso.innerHTML = `
                <h3>✅ Cadastro realizado com sucesso!</h3>
                <p>Redirecionando para página inicial em <strong>${segundos}</strong> segundos...</p>
            `;
            mensagemSucesso.style.display = 'block';
            
            const contador = setInterval(function() {
                segundos--;
                mensagemSucesso.querySelector('strong').textContent = segundos;
                
                if (segundos <= 0) {
                    clearInterval(contador);
                    window.location.href = 'index.html';
                }
            }, 1000);
        });
    });
}

if (document.getElementById('ultimo-cadastro')) {
    document.addEventListener('DOMContentLoaded', function() {
        const ultimoCadastro = localStorage.getItem('ultimoCadastro');
        if (ultimoCadastro) {
            const dados = JSON.parse(ultimoCadastro);
            document.getElementById('dados-ultimo-cadastro').innerHTML = `
                <p><strong>Nome:</strong> ${dados.nome} ${dados.sobrenome}</p>
                <p><strong>Email:</strong> ${dados.email}</p>
                <p><strong>Idade:</strong> ${dados.idade} anos</p>
                <p><strong>Data do cadastro:</strong> ${dados.dataCadastro}</p>
            `;
            document.getElementById('ultimo-cadastro').style.display = 'block';
        }
    });
}
