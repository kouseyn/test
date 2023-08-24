const startBtn = document.getElementById('startBtn');
const output = document.getElementById('output');

// 音声認識をサポートしているかチェック
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'ja-JP';

    // JSON ファイルから応答を読み込む
    const request = new XMLHttpRequest();
    request.open('GET', 'responses.json', true);
    request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
            const responses = JSON.parse(request.responseText);

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                output.textContent = transcript;

                if (responses.hasOwnProperty(transcript)) {
                    speak(responses[transcript]);
                }
            };
        } else {
            output.textContent = "Failed to load responses.";
        }
    };
    request.onerror = () => {
        output.textContent = "Failed to load responses.";
    };
    request.send();

    recognition.onstart = () => {
        startBtn.disabled = true;
        startBtn.textContent = 'Listening...';
    };

    recognition.onend = () => {
        startBtn.disabled = false;
        startBtn.textContent = 'Start Listening';
    };

    startBtn.addEventListener('click', () => {
        recognition.start();
    });
} else {
    output.textContent = "Sorry, your browser doesn't support Speech Recognition.";
}

function speak(message) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);
    synth.speak(utterance);
}
