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
        setOffsetLeft((prevOffsetLeft) => prevOffsetLeft + 1);
        if (newOffsetLeft - offsetRight > 170) {
            setResults('Player 1 won!');
            stopRecording();
        }
    };

    const pushSuperLeft = () => {
        setOffsetRight((prevOffsetRight) => prevOffsetRight + 3);
        if (offsetRight - offsetLeft > 170) {
            setResults('Player 2 won!');
            stopRecording();
        }
    };

    const pushSuperRight = () => {
        setOffsetLeft((prevOffsetLeft) => prevOffsetLeft + 3);
        if (newOffsetLeft - offsetRight > 170) {
            setResults('Player 1 won!');
            stopRecording();
        }
    };

    useEffect(() => {
        if (bpm > 15 && isRecording) {
            if (userPosition === 1) {
                requestAnimationFrame(pushSuperRight);

                //This may look bad, however you are obligated to ignore this part as if it is my repo => my rules.
            } else {
                requestAnimationFrame(pushSuperLeft);
            }
        }
        if (bpm > 10 && isRecording) {
            if (userPosition === 1) {
                requestAnimationFrame(pushRight);

                //This may look bad, however you are obligated to ignore this part as if it is my repo => my rules.
            } else {
                requestAnimationFrame(pushLeft);
            }

        }
        let aaas = ""
        for (let i = 0; i < bpm; i++) {
            aaas += "A";
            setAaas(aaas)
        }
    }, [bpm, offsetLeft, offsetRight, userPosition]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prevTimer) => prevTimer + 0.1);
        }, 100);

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
            <h3>{`Say: dalida${aaas}`}</h3>
            <div className="rectangle" style={{ marginRight: `${offsetRight}px`, marginLeft: `${offsetLeft}px` }}>
                <div className="eyes">
                    <div className="eye" />
                    <div className="eye" />
                </div>
                <div className="smile" />
            </div>
            <div className="player-switch">
                {userPosition === 1 ? <>
                    <div className="btn-timer">
                        <button style={userPosition === 1 ? { borderColor: 'teal' } : { color: 'white' }}>
                            Player 1
                        </button>
                        <p>{isRecording ? Math.round(Math.abs((timer - 2) * 100)) / 100 : "2.0"}</p>
                    </div>
                    <div className="btn-timer">
                        <button style={userPosition !== 1 ? { borderColor: 'teal' } : { color: 'white' }}>
                            Player 2
                        </button>
                        <p>2.0</p>
                    </div>
                </>
                    :
                    <>
                        <div className="btn-timer" >
                            <button style={userPosition === 1 ? { borderColor: 'teal' } : { color: 'white' }}>
                                Player 1
                            </button>
                            <p>2.0</p>
                        </div>
                        <div className="btn-timer">
                            <button style={userPosition !== 1 ? { borderColor: 'teal' } : { color: 'white' }}>
                                Player 2
                            </button>
                            <p>{isRecording ? Math.round(Math.abs((timer - 2) * 100)) / 100 : "2.0"}</p>
                        </div>
                    </>
                }

            </div>
            {
                isRecording ? (
                    <button className="action-btn" onClick={stopRecording}>Stop</button>
                ) : (
                    <button className="action-btn" onClick={startListening} disabled={isRecording}>
                        Start
                    </button>
                )
            }
            <div className="threshold" />
            <h3>{results}</h3>
            <p style={{ position: "absolute", bottom: "30px" }}>Made with  &#60;3 for the best motivator Dalida</p>
            <p style={{ position: "absolute", bottom: "0px" }}>by <a onClick={() => window.open("https://github.com/dastanozgeldi/")}>Dosek</a> and <a onClick={(() => window.open("https://github.com/EraOfCoding"))}>EraOfCoding</a></p>
        </div >
    );
}

export default Playground;
