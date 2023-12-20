// url do meu servidor
const server_url = "http://localhost:5555";
const pessoaSelecionada = [];

function cadastrar() {
  console.log('Enviando dados ao servidor...');

  // Recuperando valores dos campos do formulário
  const dados = {
      nome: document.querySelector('[name="nome-pessoa"]').value,
      cpf: document.querySelector('[name="cpf"]').value,
      data_nascimento: document.querySelector('[name="data-de-nascimento"]').value,
      telefone: document.querySelector('[name="telefone"]').value,
      endereco: document.querySelector('[name="endereco"]').value,
      altura: document.querySelector('[name="altura"]').value,
      peso: document.querySelector('[name="peso"]').value
  };

  // Faz requisição ao servidor usando o verbo POST, enviando os dados para o servidor
  fetch(`${server_url}/cadastro`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
  })
    // Depois de feita a requisição, o front-end irá receber um retorno do servidor
    .then(response => {
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        if (response.status == 201) {
          const divDirInputs = document.querySelector('[class="dir-inputs"]');
          const paragrafoMensagem = document.createElement('p');
          paragrafoMensagem.setAttribute('class', 'msg-sucesso');
          paragrafoMensagem.textContent = "Pessoa cadastrada com sucesso!";

          divDirInputs.appendChild(paragrafoMensagem);

          setTimeout(() => {
            zerarCampos();
            divDirInputs.removeChild(paragrafoMensagem);
          }, '5555');

          return response.json();
        } else {
          console.log('Algo deu errado');
          return response.json();
        }
      } else {
        throw new Error('A resposta não é do tipo JSON');
      }
    })
    // Se toda a requisição deu certo, será informado no log
    .then(dados => {
      console.log('Resposta do servidor:', dados);
      // Faça algo com a resposta do servidor, se necessário
    })
    // Caso tenha algum tipo de erro na requisição, é lançada a excessão
    .catch(error => {
      console.error('Erro ao enviar dados para o servidor:', error);
      // Trate os erros, se necessário
    });
}

function listar() {

  // recupera o elemento da tabela
  const tabela = document.querySelector('table');
  // verifica quantas linhas existem na tabela
  const contadorLinhas = tabela.rows.length;
  // apaga todas as linhas da tabela
  for (var i = contadorLinhas - 1; i > 0; i--) {
    tabela.deleteRow(i);
  }

  fetch(`${server_url}/pessoas`)
    .then(response => response.json())
    .then(data => {
      console.log('Lista recebida do servidor:', data);
      // Faça algo com a lista recebida, como renderizá-la na interface do usuário

      const tabela = document.getElementById('tabela-pessoas'); // Suponha que você tenha um elemento HTML com o id 'lista' onde deseja exibir os dados

      data.rows.forEach(item => {
        const dataParse = new Date(item.data_nascimento);

        const trElement = document.createElement('tr');
        const tdId = document.createElement('td');
        const tdNome = document.createElement('td');
        const tdCPF = document.createElement('td');
        const tdDataNascimento = document.createElement('td');
        const tdTelefone = document.createElement('td');
        const tdEndereco = document.createElement('td');
        const tdAltura = document.createElement('td');
        const tdPeso = document.createElement('td');

        const tdAcao = document.createElement('td');
        const imgApagar = document.createElement('img');
        const imgEditar = document.createElement('img');

        tdId.textContent = item.id;
        tdId.hidden = true;
        trElement.appendChild(tdId);

        tdNome.textContent = item.nome;
        trElement.appendChild(tdNome);
        tdCPF.textContent = item.cpf;
        trElement.appendChild(tdCPF);
        tdDataNascimento.textContent = `${dataParse.getDate()}/${dataParse.getMonth() + 1}/${dataParse.getFullYear()}`;
        trElement.appendChild(tdDataNascimento);
        tdTelefone.textContent = item.telefone;
        trElement.appendChild(tdTelefone);
        tdEndereco.textContent = item.endereco;
        trElement.appendChild(tdEndereco);
        tdAltura.textContent = item.altura;
        trElement.appendChild(tdAltura);
        tdPeso.textContent = item.peso;
        trElement.appendChild(tdPeso);

        imgEditar.src = "../assets/images/editar-icon.png"
        imgEditar.addEventListener('click', () => editarPessoa(item));
        tdAcao.appendChild(imgEditar);

        imgApagar.src = "../assets/images/lixeira-icon.png";
        imgApagar.addEventListener('click', () => apagarPessoa(item.id, item.nome));
        tdAcao.appendChild(imgApagar);

        trElement.appendChild(tdAcao);

        tabela.appendChild(trElement);
      });

    })
    .catch(error => {
      console.error('Erro ao buscar a lista do servidor:', error);
      // Trate os erros, se necessário
    });
} 