const main = document.querySelector('main');
const selectVoice = document.querySelector('select');
const readButton = document.getElementById('read');
const textArea = document.querySelector('textarea');
const insertTextButton = document.querySelector('.btn-toggle');
const textBox = document.querySelector('.text-box'); // Caixa de texto
const closeButton = document.querySelector('.text-box .close'); // Botão de fechar (X)

const humanExpressions = [
    { img: './img/drink.jpg', text: 'Estou com sede' },
    { img: './img/food.jpg', text: 'Estou com fome' },
    { img: './img/tired.jpg', text: 'Estou cansado' },
    { img: './img/hurt.jpg', text: 'Estou machucado' },
    { img: './img/happy.jpg', text: 'Estou feliz' },
    { img: './img/angry.jpg', text: 'Estou com raiva' },
    { img: './img/sad.jpg', text: 'Estou triste' },
    { img: './img/scared.jpg', text: 'Estou assustado' },
    { img: './img/outside.jpg', text: 'Quero ir lá fora' },
    { img: './img/home.jpg', text: 'Quero ir para casa' },
    { img: './img/school.jpg', text: 'Quero ir para a escola' },
    { img: './img/grandma.jpg', text: 'Quero ver a vovó' },
];

// Carregar as vozes disponíveis no SpeechSynthesis
const loadVoices = () => {
    const voices = speechSynthesis.getVoices();
    selectVoice.innerHTML = ''; // Limpar o conteúdo atual do select

    // Verificar se há vozes disponíveis
    if (voices.length === 0) {
        // Se as vozes não foram carregadas ainda, aguardamos um pouco e tentamos novamente
        setTimeout(loadVoices, 100);
        return;
    }

    // Filtrar apenas as vozes em pt-BR
    const ptBrVoices = voices.filter(voice => voice.lang === 'pt-BR');

    // Adicionar as vozes ao select
    ptBrVoices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.name;
        option.textContent = `${voice.name} (${voice.lang})`;
        selectVoice.appendChild(option);
    });
};

// Função para falar o texto usando SpeechSynthesis
const speakText = (text, voiceName) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();
    const selectedVoice = voices.find(voice => voice.name === voiceName);
    
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }
    
    speechSynthesis.speak(utterance);
};

// Mostrar ou esconder a caixa de texto ao clicar no botão
insertTextButton.addEventListener('click', () => {
    textBox.classList.toggle('show');
});

// Fechar a caixa de texto
closeButton.addEventListener('click', () => {
    textBox.classList.remove('show');
});

// Ao clicar no botão de leitura
readButton.addEventListener('click', () => {
    const text = textArea.value;
    const selectedVoice = selectVoice.value;

    if (text) {
        speakText(text, selectedVoice);
    } else {
        alert('Por favor, insira um texto.');
    }
});

// Gerar as expressões
humanExpressions.forEach(expression => {
    const box = document.createElement('div');
    box.classList.add('expression-box');
    box.innerHTML = `
      <img src="${expression.img}" alt="${expression.text}">
      <div class="info">${expression.text}</div>
    `;
    
    box.addEventListener('click', () => speakText(expression.text, selectVoice.value));
    main.appendChild(box);
});

// Carregar as vozes assim que o evento "voiceschanged" for disparado
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
}

// Caso o evento não seja disparado, tentamos carregar as vozes diretamente
window.addEventListener('load', loadVoices);
