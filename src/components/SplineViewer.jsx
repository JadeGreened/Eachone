// src/components/SplineViewer.js
import React, { useEffect } from 'react';

const SplineViewer = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.10.19/build/spline-viewer.js';
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="w-full h-[600px] my-8">
      <spline-viewer
        url="https://prod.spline.design/fCNBQigJyc10VfHt/scene.splinecode"
        style={{ width: '100%', height: '100%' }}
      ></spline-viewer>
    </div>
  );
};

export default SplineViewer;
