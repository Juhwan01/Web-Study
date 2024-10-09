import React, { useState, useEffect, useCallback } from 'react';

const Timer = () => {
  const [time, setTime] = useState(null);
  const [worker, setWorker] = useState(null);

  useEffect(() => {
    // 웹 워커 생성
    const newWorker = new Worker('./worker.js');
    setWorker(newWorker);

    // 컴포넌트가 언마운트될 때 워커 종료
    return () => {
      newWorker.terminate();
    };
  }, []);

  useEffect(() => {
    if (worker) {
      worker.onmessage = (e) => {
        setTime(e.data);
      };
    }
  }, [worker]);

  const startTimer = useCallback(() => {
    worker?.postMessage('start');
  }, [worker]);

  const stopTimer = useCallback(() => {
    worker?.postMessage('stop');
  }, [worker]);

  return (
    <div>
      <div>{time ? time.toString() : 'Timer not started'}</div>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
    </div>
  );
};

export default Timer;