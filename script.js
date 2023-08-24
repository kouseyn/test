const startButton = document.getElementById('startButton');
const responseElement = document.getElementById('response');

const recognition = new window.webkitSpeechRecognition();

const apiKey = "6467347f4329ae09ce8041d32edca306"; 
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
recognition.onresult = async (event) => {
    const speechResult = event.results[0][0].transcript;
  
    let matchingResponse = responses.find(response => {
      return speechResult.includes(response.input) || response.input.split(' ').some(word => speechResult.includes(word));
    });
  
    if (matchingResponse) {
      responseElement.textContent = matchingResponse.output;
    } else {
      let wordResponses = responses.filter(response => {
        return speechResult.includes(response.input);
      });
  
      if (wordResponses.length > 0) {
        responseElement.textContent = wordResponses[0].output;
      } else if (speechResult.includes("あしたの天気予報おしえて")) {
        try {
          const weather = await fetchWeather(); // 天気情報の取得
          responseElement.textContent = `今日の天気は${weather}です！。`; // 応答生成
        } catch (error) {
          responseElement.textContent = "天気情報の取得に失敗しました。";
        }
      } else {
        responseElement.textContent = 'すみません、よく聞き取れませんでした。';
      }
    }
  };
  
  async function fetchWeather() {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Tokyo&units=metric&appid=${apiKey}`);
      const data = await response.json();
      const weatherDescription = data.weather[0].description;
      return weatherDescription;
    } catch (error) {
      throw error;
    }
  }

