import "./PatientContext.css"
import { createContext, useContext, useState, useRef } from "react"
import { LanguageContext } from "./LanguageContext"
import { PatientContext } from "./PatientContext"
import {FaImage} from "react-icons/fa"
import AudioRec from "./AudioRec";

export const ProblemContext = createContext();

export const ProblemProvider = ({children}) => {
    const {language, changeLanguage} = useContext(LanguageContext);
    const {age, isMale} = useContext(PatientContext);

    const [problem, setProblem] = useState("")
    const [images, setImages] = useState([])
    const [imgFile, setImgFile] = useState(null)
    const [notification, setNotification] = useState("");
    const [previews, setPreviews] = useState([])
    const [submit, setSubmit] = useState(false)
    const imageRef = useRef()
    const [isImg, setIsImg] = useState(false)
    const [imgCount, setImgCount] = useState(0);
    const [problemAudioURL, setProblemAudioURL] = useState(null);

    const handleFileChange = (e) => {
        setNotification("");
        if (imgCount >= 3) {
            setNotification(language === "English" ? "You can upload maximum 3 images" : "आप अधिकतम 3 छवियां अपलोड कर सकते हैं")
            return
        }
        const file = e.target.files[0];
        if (file.size > 10 * 1024 * 1024) {
            setNotification(language === "English" ? "File size should be less than 10MB" : "फ़ाइल का आकार 10MB से कम होना चाहिए")
            return
        }

        if (file) {
            setImgFile(file)
            setImages(images => [...images, file]);
            setIsImg(true)
            setNotification("")
            setImgCount(imgCount + 1);
            const Url = URL.createObjectURL(file);
            setPreviews(previews => [...previews, Url]);
        } else {
            setIsImg(false)
            setImgCount(0);
            setImages([])
            setPreviews([])
            setNotification(language === "English" ? "Please upload an image" : "कृपया एक छवि चुनें")
        }
    }

    const removePreviewImg = (e) => {
        const index = parseInt(e.target.value);
        const newPreviews = previews.filter((_, i) => i !== index);
        const newImages = images.filter((_, i) => i !== index);
        setPreviews(newPreviews);
        setImages(newImages);
        setImgCount(imgCount - 1);
        setNotification("");
        if (newPreviews.length === 0) {
            setIsImg(false)
        }
    }

    const handleSubmit = () => {
        if (images.length <= 0 && problem.trim() === "") {
            setNotification(language === "English" ? "Please Specify your Problem Or Upload picture If you have problem which is visible." : "कृपया अपनी समस्या बताएं या यदि आपको कोई समस्या दिखाई दे रही है तो उसका चित्र अपलोड करें|")
            return
        } else {
            setSubmit(true)
        }

    }
    
    if (!submit) {
        return (
            <div className="problem">
                {notification && (
                    <div className="notification">{notification}</div>
                )}
                <div className="language-swtich">
                    <button id="lang-switch-btn" onClick={() => changeLanguage(language === "English" ? "Hindi": "English")}>{language === "English" ? "भाषा हिंदी में बदलें": "Continue in English"}</button>
                </div>
                <div className="header">
                    <h1>{language === "English" ? "Pocket Doctor": "पॉकेट डॉक्टर"}</h1>
                </div>
                <div className="patient-data">
                    {language === "English"
                        ? (
                            <>
                                <span>{`Gender: ${isMale ? "Male": "Female"}`}</span>
                                <span>{`Age: ${age}`}</span>
                            </>
                        ): (
                            <>  
                                <span>{`लिंग: ${isMale ? "पुरुष": "महिला"}`}</span>
                                <span>{`आयु: ${age}`}</span>
                            </>
                        )

                    }
                </div>
                <h2>{language === "English" ? "Tell Your Problems." : "अपनी समस्याएं बताएं."}</h2>
                <textarea
                    placeholder={language === "English" ? "Describe your problems here..." : "अपनी समस्याओं का वर्णन करें..."}
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    rows="4"
                />
                <div>{language === "English"? "OR": "या"}</div>
                <div>{language === "English" ? "upload any physical injuries or Diseases": "किसी भी शारीरिक चोट या बीमारी को अपलोड करें|"}</div>
                <input type="file" id="problem-img" capture="environment" ref={imageRef} accept="image/jpg, image/jpeg, image/png" onChange={handleFileChange} />
                <div style={{display: "flex", alignItems: "center", gap: "10px", justifyContent: "center", }}>
                    <button id="problem-ref-btn" onClick={() => imageRef.current.click()}><FaImage /></button>
                    <AudioRec onAudioURLChange={setProblemAudioURL} language={language} />
                </div>

                {problemAudioURL && <audio className="audio-player" controls src={problemAudioURL} />}
                {isImg && previews.length > 0 && (
                    <div className="preview-img-div">
                        {previews.map((src, index) => (
                            <div key={index} className="preview-img-container">
                                <img key={index} src={src} alt={`Preview ${index + 1}`} className="preview-img" />
                                <button className="remove-img-btn" onClick={removePreviewImg} value={index}>X</button>
                            </div>
                            
                        ))}
                    </div>
                )}
                <button className={`submit-btn ${!problem && images.length <= 0 ? "blur": ""}`} disabled={!problem && images.length <= 0 ? true: false} onClick={handleSubmit}>
                    {language === "English" ? "Submit" : "सबमिट करें"}
                </button>
            </div>
        )
    }
    return (
        <ProblemContext.Provider value={{ problemAudioURL, problem, images }}>
            {children}
        </ProblemContext.Provider>
    )
}
    