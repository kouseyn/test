const startButton = document.getElementById('startButton');
const responseElement = document.getElementById('response');

const recognition = new window.webkitSpeechRecognition();

recognition.lang = 'ja-JP';
recognition.continuous = false;
recognition.interimResults = false;

let responses = [];

fetch('responses.json')
  .then(response => response.json())
  .then(data => {
    responses = data.responses;
  })
  .catch(error => console.error('Error loading responses:', error));

recognition.onresult = (event) => {
  const speechResult = event.results[0][0].transcript;

  let matchingResponse = responses.find(response => speechResult.includes(response.input));

  if (matchingResponse) {
    responseElement.textContent = matchingResponse.output;
  } else {
    responseElement.textContent = 'すみません、よく聞き取れませんでした。';
  }
};

recognition.onerror = (event) => {
  console.error('Recognition error:', event.error);
};

startButton.addEventListener('click', () => {
  recognition.start();
  responseElement.textContent = 'Listening...';
});
