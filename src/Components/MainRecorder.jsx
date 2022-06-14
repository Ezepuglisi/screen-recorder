import React, { useState } from 'react'
import { RecordRTCPromisesHandler } from 'recordrtc'
//import {AiFillSave, AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai"
import './style.css'
//import { Storage } from 'megajs'

const MainRecorder = () => {

    const [recorder, setRecorder] = useState(null)
    const [stream, setStream] = useState(null)
    const [videoBlob, setVideoBlob] = useState(null)
    const [status, setStatus] = useState('play')

    // const [posX, setPosX] = useState(null)
    // const [posY, setPosY] = useState(null)

    const startRecording = async (e) => {
        if (status === 'play') {
            const mediaDevices = navigator.mediaDevices
            const stream = await mediaDevices.getDisplayMedia({
                video: true,
                audio: true,
            })

            //@ts-ignore
            const recorder = new RecordRTCPromisesHandler(stream, {
                type: 'video',
            })

            recorder.startRecording()

            setStatus('pause')
            setRecorder(recorder)
            setStream(stream)
            setVideoBlob(null)

        } else if (status === 'pause') {
            //@ts-ignore
            recorder.pauseRecording()
            setStatus('resume')

        } else {
            //@ts-ignore
            recorder.resumeRecording()
            setStatus('pause')
        }

    }

    function guardarArchivo(e) {
        e.preventDefault()
        if (videoBlob) {
            const mp4File = new File([videoBlob], 'demo.mp4', { type: 'video/mp4' })
            console.log('Video', mp4File)
        }
    }

    const stopRecording = async () => {
        if (recorder) {
            await recorder.stopRecording()
            const blob = await recorder.getBlob()
            stream.stop()
            setVideoBlob(blob)
            setStream(null)
            setRecorder(null)
            setStatus('play')
        }
    }

    // const mouseMove = (e) =>{
    //     let x = e.pageX;
    //     let y = e.pageY;
    //     // cursor.style.left = x + 'px';
    //     // cursor.style.top = y + 'px';
    //     setPosX(x + 'px')
    //     setPosY(y + 'px')
    // }

    return (
        <div className='general'>
            <div className="grabar" id="grabar">
                {/* <button id="eject">Ejecutar Extension</button> */}
                <button onClick={startRecording} id="play" value="play">{status === 'play' || status === 'resume' ? 'PLAY' : 'PAUSE'}</button>
                <button disabled={status === 'play' ? true : false} onClick={stopRecording} id="pausa">DETENER</button>
            </div>
            <div className='container'>
                {!!videoBlob && (
                    <video controls src={window.URL.createObjectURL(videoBlob)} />
                )}
            </div>
            <div className="container" id="grabacion">
                {/* <label for="link">Ingresa tu carpeta de drive</label>
                <input type="text" /> */}
                <button onClick={guardarArchivo} type="submit" className="btn">Subir a la nube</button>
            </div>
            {/* <div style={{}:10px"}} onMouseMove={mouseMove} id="cursor"></div> */}
        </div>
    )
}

export default MainRecorder

