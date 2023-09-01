import React, { useState, useEffect } from 'react';
import './Audioplayer.css';

function Audioplayer(props) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [percentage, setPercentage] = useState('0%');
    const [duration, setDuration] = useState(0);
    const [audioPla, setAudioplayer] = useState({});
    const audioRef = React.createRef();

    const togglePlayPause = async () => {
        const audio = await audioRef.current;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    let changeProgress =  async(event) => {
            if (isPlaying) {
                setAudioplayer(event.target);
                setDuration(event.target.duration);
                let progressPercent = await (event.target.currentTime / event.target.duration) * 90;
                // event.target.style.width = `${progressPercent}% !important`;
                setPercentage(`${progressPercent}%`);
            }
    };

    let skipTo = async (newPercentage) => {
        const newTime = await (newPercentage / 90) * duration;
        audioPla.currentTime = newTime;
    }


    return (
        <div>
            <div className="audio-player">
                <audio ref={audioRef} onTimeUpdate={changeProgress}>
                    <source src={props.url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
                <div className="audio-controls">
                    <button onClick={togglePlayPause}>
                        <i className={isPlaying ? 'bx bx-pause' : 'bx bx-play'}></i>
                    </button>
                </div>
                <div className="progress-bar">
                    <div className="progress" style={{ width: `${percentage}` }}></div>
                    <input
                        type="range"
                        min="0"
                        max="90"
                        value='0'
                        onChange={(e) => skipTo(Number(e.target.value))}
                        step="0.01"
                        className="progress-input"
                    />
                </div>
            </div>
        </div>
    );
}

export default Audioplayer;
