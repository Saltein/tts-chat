import { useState, useRef, useCallback, useEffect } from 'react';
import s from './DefaultSlider.module.scss';
import { useDispatch, useSelector } from 'react-redux';

export const DefaultSlider = ({ width = '256px', height = '48px', selector, dispatcher, isCoefficient = false, postfix = '' }) => {
    const currentValue = useSelector(selector);

    const [position, setPosition] = useState(currentValue);
    const wrapperRef = useRef(null);
    const isDragging = useRef(false);

    const dispatch = useDispatch();

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

        let newPosition;
        if (isCoefficient) {
            // Ограничение до 0-1 и округление до сотых
            newPosition = Math.min(1, Math.max(0, x / rect.width));
            newPosition = Math.round(newPosition * 100) / 100;
        } else {
            newPosition = Math.min(100, Math.max(0, (x / rect.width) * 100));
            newPosition = Math.round(newPosition);
        }

        setPosition(newPosition);
        dispatch(dispatcher(newPosition));
    }, [dispatcher, isCoefficient, dispatch]);

    // Синхронизация с внешним значением
    useEffect(() => {
        setPosition(currentValue);
    }, [currentValue]);

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, [handleMouseMove]);

    let criticalValue = isCoefficient ? 0.2 : 20

    // Стили
    const styles = {
        width,
        height,
        borderLeft: position <= criticalValue ? `${1}px solid rgba(255, 0, 0, ${(criticalValue - position) / criticalValue})` : ''
    };

    const sliderStyles = {
        right: `${isCoefficient ? (1 - position) * 100 : 100 - position}%`,
    };

    return (
        <div
            ref={wrapperRef}
            className={s.wrapper}
            style={styles}
            onMouseDown={handleMouseDown}
        >
            <span className={s.value} style={{fontSize: height}}>{position + postfix}</span>
            <div className={s.slider} style={sliderStyles}>
                <div className={s.slider_circle} style={{height}} />
            </div>
        </div>
    );
};
