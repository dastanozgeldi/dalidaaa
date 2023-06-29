import { useState } from 'react';

export const AmplitudeCounter = () => {
    const [bpm, setBpm] = useState(0);
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
            setTimeout(async () => {
                setIsRecording(true)
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
            }, 2000)

            setIsRecording(false)
            stopListening()
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

    return (
        <div>
            {isRecording && (<h1>BPM: {bpm}</h1>)}
            {/* <button onClick={() => {
                setIsRecording(!isRecording)
                if (isRecording) stopListening()
                else startListening()
            }}>Record</button> */}
            <button onClick={startListening} disabled={isRecording}>
                Start
            </button>
        </div>
    );
};

