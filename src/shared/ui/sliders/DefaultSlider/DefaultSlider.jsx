import { useState, useRef, useCallback, useEffect } from 'react';
import s from './DefaultSlider.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { selectSpeechVolume, setSpeechVolume } from '../../../../features/tts-chat/model/slice';

export const DefaultSlider = ({ width = '256px', selector, dispatcher }) => {
    const currentValue = useSelector(selector)

    const [position, setPosition] = useState(currentValue);
    const wrapperRef = useRef(null);
    const isDragging = useRef(false);

    const dispatch = useDispatch()

    const handleMouseDown = useCallback((e) => {
        isDragging.current = true;
        updatePosition(e);
        document.addEventListener('mouseup', handleMouseUp);
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (!isDragging.current) return;
        updatePosition(e);
    }, []);

    const handleMouseUp = useCallback(() => {
        isDragging.current = false;
        document.removeEventListener('mouseup', handleMouseUp);
    }, []);

    const updatePosition = useCallback((e) => {
        if (!wrapperRef.current) return;

        const rect = wrapperRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        let newPosition = (x / rect.width) * 100;

        newPosition = Math.round(Math.max(0, Math.min(100, newPosition)));
        setPosition(newPosition);
        dispatch(dispatcher(newPosition))
    }, []);

    // EFFECTS EFFECTS EFFECTS EFFECTS EFFECTS EFFECTS
    useEffect(() => {
        setPosition(currentValue);
    }, [currentValue]);

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, [handleMouseMove]);


    // STYLES STYLES STYLES STYLES STYLES STYLES STYLES
    const styles = {
        width: width ?? undefined,
        borderLeft: position <= 20 ? `${1}px solid rgba(255, 0, 0, ${(20-position)/20})` : ''
    };

    const sliderStyles = {
        right: `${100 - position}%`,
    };

    return (
        <div
            ref={wrapperRef}
            className={s.wrapper}
            style={styles}
            onMouseDown={handleMouseDown}
        >
            <span className={s.value}>{position}</span>
            <div className={s.slider} style={sliderStyles}>
                <div className={s.slider_circle} />
            </div>
        </div>
    );
};