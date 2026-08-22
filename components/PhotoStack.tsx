"use client";

import Image from "next/image";
import { useRef, useState } from "react";

const cards = [
  { src: "/img/google-dsa-site.png", alt: "Google DSA project", label: "Google DSA" },
  { src: "/img/http-server.png", alt: "HTTP server project", label: "HTTP server" },
  { src: "/img/log-monitor.png", alt: "Log monitoring project", label: "LogMonitor" },
  { src: "/img/yash-avatar.jpg", alt: "Photo of Yash", label: "Yash" },
];

export function PhotoStack() {
  const [order, setOrder] = useState(cards.map((_, index) => index));
  const [dragX, setDragX] = useState(0);
  const startX = useRef<number | null>(null);
  const moveFrontCard = () => {
    setOrder((current) => [current[current.length - 1], ...current.slice(0, -1)]);
    setDragX(0);
  };

  return (
    <div className="photo-stack-shell">
      <div className="photo-stack" aria-label="Swipe through Yash and selected work">
        {order.map((cardIndex, position) => {
          const card = cards[cardIndex];
          const depth = order.length - 1 - position;
          const isFront = depth === 0;
          const rotation = isFront ? dragX / 12 : depth % 2 === 0 ? -5 : 6;
          const style = { transform: `translate(${isFront ? dragX : depth * -2}px, ${depth * 3}px) rotate(${rotation}deg) scale(${1 - depth * 0.035})`, zIndex: position + 1, opacity: Math.max(0.55, 1 - depth * 0.12) };

          if (!isFront) {
            return (
              <div key={card.src} className="photo-card" style={style} aria-hidden="true">
                <Image src={card.src} alt="" fill sizes="175px" loading="eager" draggable={false} />
                {card.label !== "Yash" && <span>{card.label}</span>}
              </div>
            );
          }

          return (
            <button
              type="button"
              key={card.src}
              className="photo-card front-card"
              style={style}
              aria-label={`Move ${card.label} card to the back`}
              onPointerDown={(event) => { startX.current = event.clientX; event.currentTarget.setPointerCapture(event.pointerId); }}
              onPointerMove={(event) => { if (startX.current !== null) setDragX(event.clientX - startX.current); }}
              onPointerUp={() => { if (Math.abs(dragX) > 45) moveFrontCard(); else setDragX(0); startX.current = null; }}
              onPointerCancel={() => { setDragX(0); startX.current = null; }}
              onClick={Math.abs(dragX) < 5 ? moveFrontCard : undefined}
            >
              <Image src={card.src} alt={card.alt} fill sizes="175px" loading="eager" draggable={false} />
              {card.label !== "Yash" && <span>{card.label}</span>}
            </button>
          );
        })}
      </div>
      <p>drag or tap the card</p>
    </div>
  );
}
