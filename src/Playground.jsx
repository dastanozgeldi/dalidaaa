import { useState, useEffect } from 'react';
import './Playground.css';

function Playground() {
    const [bpm, setBpm] = useState(0);
    const [user1, setUser1] = useState(true);
    const [isRecording, setIsRecording] = useState(false);

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

    const stopListening = () => {
        if (audioContext) {
            // Disconnect the microphone and script node
            scriptNode.removeEventListener('audioprocess', handleAudioProcess);
            scriptNode.disconnect();
            audioContext.close();
            audioContext = null;
        }
    };

    const [offsetRight, setOffsetRight] = useState(0);
    const [offsetLeft, setOffsetLeft] = useState(0);
    const [results, setResults] = useState("");

    const pushLeft = () => {
        setOffsetRight(offsetRight + 3);
        if (offsetRight - offsetLeft > 48) {
            setResults("Player Pushing Left won!");
        }
    };

    const pushRight = () => {
        const newOffsetLeft = offsetLeft + 3;
        if (newOffsetLeft - offsetRight > 48) {
            setResults("Player Pushing Right won!");
        } else {
            setOffsetLeft(newOffsetLeft);
        }
    };

    useEffect(() => {
        if (bpm > 5) {
            setTimeout(() => {
                pushRight();
            }, 100)

        }
    }, [bpm, offsetLeft]);

    return (
        <div className="playground">
            <h3>Rectangle Pushers</h3>
            <div className="rectangle" style={{ marginRight: `${offsetRight}px`, marginLeft: `${offsetLeft}px` }} />
            <button style={{ marginTop: "15px" }} onClick={() => { setOffsetLeft(0); setOffsetRight(0); setResults(""); }}>
                Set zero
            </button>
            <button onClick={startListening} disabled={isRecording}>
                Start
            </button>
            <div className="threshold" />
            <h3>{results}</h3>
            <p>{bpm}</p>
        </div>
    );
}

export default Playground;
