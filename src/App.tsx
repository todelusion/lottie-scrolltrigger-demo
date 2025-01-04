import { useRef } from "react";
import useLottieScrollTrigger from "./hooks/useLottieScrollTrigger";
// 請記得導入您的 Lottie JSON 檔案
import animationData from "./assets/lottie/react-lottie.json";

function App() {
  // 建立容器參考，用於放置 Lottie 動畫
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  // 使用 useLottieScrollTrigger 鉤子來控制 Lottie 動畫
  useLottieScrollTrigger({
    container: containerRef, // Lottie 動畫的容器
    trigger: triggerRef,
    animationData, // Lottie 動畫數據
    speedFactor: 0.5, // 動畫播放速度倍數
    scrollTrigger: {
      pin: true,
      start: "top top",
      end: "+=2000", // 當觸發器的底部到達視窗中心時結束
      scrub: true, // 實現平滑的滾動動畫效果
    },
  });

  return (
    <main className="min-h-screen">
      {/* Lottie 動畫容器 */}
      <div ref={triggerRef}>
        <div className="absolute w-full h-screen">
          <div
            ref={containerRef}
            className="w-full max-w-2xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </div>
      </div>
      <div className="min-h-screen" />
    </main>
  );
}

export default App;
