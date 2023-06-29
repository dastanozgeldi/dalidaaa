import { useState, useEffect } from 'react';
import './Playground.css';

function Playground() {
    const [bpm, setBpm] = useState(0);
    const [userPosition, setUserPosition] = useState(1);
    const [isRecording, setIsRecording] = useState(false);
    const [offsetRight, setOffsetRight] = useState(0);
    const [offsetLeft, setOffsetLeft] = useState(0);
    const [results, setResults] = useState('');
    const [timer, setTimer] = useState(0);
    const [aaas, setAaas] = useState("")

    let audioContext = null;
    let scriptNode = null;

    const handleAudioProcess = (event) => {
        const buffer = event.inputBuffer.getChannelData(0);
        const bufferSize = buffer.length;
        let sum = 0;

        // Calculate the average amplitude of the audio buffer
        for (let i = 0; i < bufferSize; i++) {
            sum += Math.abs(buffer[i]);
        }
        const averageAmplitude = sum / bufferSize;

        // Calculate the BPM based on the average amplitude
        const instantBpm = Math.round(60 * averageAmplitude);

        // Update the BPM state
        setBpm(instantBpm);
    };

    const startListening = async () => {
        try {
            setIsRecording(true);
            setResults("")
            // Access the user's microphone
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Create an AudioContext and connect the microphone stream to it
            audioContext = new AudioContext();
            const microphone = audioContext.createMediaStreamSource(stream);

            // Create a ScriptProcessorNode to process the audio data
            scriptNode = audioContext.createScriptProcessor(4096, 1, 1);
            scriptNode.addEventListener('audioprocess', handleAudioProcess);

            // Connect the microphone to the ScriptProcessorNode and then to the audio destination
            microphone.connect(scriptNode);
            scriptNode.connect(audioContext.destination);
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    const stopRecording = () => {
        setIsRecording(false);
        resetGame()
        scriptNode.removeEventListener('audioprocess', handleAudioProcess);
        audioContext.close().then(() => {
            audioContext = null;
            scriptNode = null;
        });
    };

    const pushLeft = () => {
        setOffsetRight((prevOffsetRight) => prevOffsetRight + 1);
        if (offsetRight - offsetLeft > 170) {
            setResults('Player 2 won!');
            stopRecording();
        }
    };

    const pushRight = () => {
        const newOffsetLeft = offsetLeft + 1;
        if (newOffsetLeft - offsetRight > 170) {
            setResults('Player 1 won!');
            stopRecording();
        } else {
            setOffsetLeft(newOffsetLeft);
        }
    };

    useEffect(() => {
        if (bpm > 10 && isRecording) {
            if (userPosition === 1) {
                requestAnimationFrame(pushRight);

                //This may look bad, however you are obligated to ignore this part as if it is my repo => my rules.
            } else {
                requestAnimationFrame(pushLeft);
            }

        }
        if (bpm < 1) {
            setAaas("")
        }
        if (bpm > 0) {
            setAaas("A")
        }
        if (bpm > 1) {
            setAaas("AA")
        }
        if (bpm > 2) {
            setAaas("AAA")
        }
        if (bpm > 3) {
            setAaas("AAAA")
        }
        if (bpm > 4) {
            setAaas("AAAAA")
        }
        if (bpm > 5) {
            setAaas("AAAAAA")
        }
        if (bpm > 6) {
            setAaas("AAAAAAA")
        }
        if (bpm > 7) {
            setAaas("AAAAAAAA")
        }
        if (bpm > 8) {
            setAaas("AAAAAAAAA")
        }
        if (bpm > 9) {
            setAaas("AAAAAAAAAA")
        }
        if (bpm > 10) {
            setAaas("AAAAAAAAAAA")
        }
        if (bpm > 11) {
            setAaas("AAAAAAAAAAA")
        }
        if (bpm > 12) {
            setAaas("AAAAAAAAAAAAA")
        }
        if (bpm > 13) {
            setAaas("AAAAAAAAAAAAAA")
        }
        if (bpm > 14) {
            setAaas("AAAAAAAAAAAAAAA")
        }
        if (bpm > 15) {
            setAaas("AAAAAAAAAAAAAAAA")
        }
        if (bpm > 16) {
            setAaas("AAAAAAAAAAAAAAAAA")
        }
        if (bpm > 17) {
            setAaas("AAAAAAAAAAAAAAAAAA...")
        }
    }, [bpm, offsetLeft, offsetRight, userPosition]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prevTimer) => prevTimer + 1);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [timer]);

    useEffect(() => {
        if (timer > 2 && isRecording) {
            setUserPosition((prevUserPosition) => (prevUserPosition === 1 ? 0 : 1));
            setTimer(0);
        }
    }, [timer]);

    const resetGame = () => {
        setOffsetLeft(0);
        setOffsetRight(0);
        setTimer(0)
        setAaas("")
    };

    return (
        <div className="playground">
            <h3>{`dalida${aaas}`}</h3>
            <div className="rectangle" style={{ marginRight: `${offsetRight}px`, marginLeft: `${offsetLeft}px` }} />
            <div className="player-switch">
                <button style={userPosition === 1 ? { borderColor: 'teal' } : { color: 'white' }}>
                    Player 1
                </button>
                <button style={userPosition !== 1 ? { borderColor: 'teal' } : { color: 'white' }}>
                    Player 2
                </button>
            </div>
            {isRecording ? (
                <button className="action-btn" onClick={stopRecording}>Stop</button>
            ) : (
                <button className="action-btn" onClick={startListening} disabled={isRecording}>
                    Start
                </button>
            )}
            <div className="threshold" />
            <h3>{results}</h3>
            {/* <p>{bpm}</p> */}
        </div>
    );
}

export default Playground;
