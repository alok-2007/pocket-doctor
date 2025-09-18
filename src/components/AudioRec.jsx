import { useState, useRef } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import {motion} from "framer-motion";

const AudioRec = ({ onAudioURLChange, language }) => {
    const [recording, setRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.addEventListener("dataavailable", e => {
                audioChunksRef.current.push(e.data);
            });

            mediaRecorder.addEventListener("stop", () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(audioBlob);
                onAudioURLChange(url);
            });

            mediaRecorder.start();
            setRecording(true);
        } catch (err) {
            console.error("Microphone access error:", err);
            alert(language === "English" ? "Microphone access denied!" : "माइक्रोफोन तक पहुंच अस्वीकार");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    return (
        <div className="audio-recorder" style={{ position: "relative", width: "60px", height: "60px" }}>
            <button
                id="audio-btn"
                onClick={recording ? stopRecording : startRecording}
                style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: recording ? "#ff0000" : "#23b84b",
                    color: "white",
                    fontSize: "24px",
                    border: "none",
                    cursor: "pointer",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {recording ? <FaMicrophoneSlash /> : <FaMicrophone />}
            </button>

            {recording && (
                <motion.div
                    style={{
                        position: "absolute",
                        top: "-10px",
                        left: "-10px",
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        border: "2px solid red",
                    }}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0.3, 0.7] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
            )}
        </div>
    );
};

export default AudioRec;