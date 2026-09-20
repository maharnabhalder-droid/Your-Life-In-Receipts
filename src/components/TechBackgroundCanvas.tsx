import React, { useEffect, useRef } from 'react';
import { useTheme } from '../theme/ThemeContext';

export const TechBackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse tracking for interactive thermal cursor glow
    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('resize', handleResize);

    // Telemetry text glyphs & barcode stubs
    const glyphs = [
      '🧾 2 AM_SESSION',
      '₹8,552.65',
      'BEATLES_DISCOGRAPHY',
      'GEO:19.07°N,72.87°E',
      'ID_8841',
      'OCT_27_PLANNER',
      '94%_THREAD_MATCH',
      'NOCTURNAL_PEAK',
      'HBR_SUBSCRIPTION',
      'THE_KILLERS_2020',
      'MUTUAL_FUND_SIP',
      '||| | |||| | |||',
      'PAID_RECEIPT',
      'CATARACT_MEDICINE',
      'MUMBAI_SUBURBAN',
    ];

    // Create 50 floating particle nodes
    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4 - 0.1,
      size: Math.random() * 2.5 + 1,
      glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
      isGlyph: Math.random() < 0.45,
      opacity: Math.random() * 0.45 + 0.15,
    }));

    // Create vertical binary matrix streams
    const matrixColumns = Array.from({ length: Math.floor(width / 80) }, (_, i) => ({
      x: i * 80 + 20,
      y: Math.random() * height,
      speed: Math.random() * 0.8 + 0.3,
      chars: ['0', '1', '🧾', '★', '₹', '•', '|||'],
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = theme === 'dark';
      // Colors: Hot Amber & Violet for Dark Mode; Ink Blue & Vintage Teal for Light Mode
      const primaryRgb = isDark ? '245, 158, 11' : '37, 99, 235';
      const secondaryRgb = isDark ? '139, 92, 246' : '13, 148, 136';
      const accentRgb = isDark ? '239, 68, 68' : '219, 39, 119';

      // Ease mouse coordinates
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const time = Date.now() * 0.0006;

      // 1. Interactive Cursor Radial Halo
      const cursorGradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        10,
        mouse.x,
        mouse.y,
        180
      );
      cursorGradient.addColorStop(0, `rgba(${primaryRgb}, ${isDark ? 0.08 : 0.05})`);
      cursorGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = cursorGradient;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 180, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw Moving Thermal Grid & Wave Contours
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.025)' : 'rgba(0, 0, 0, 0.025)';
      ctx.lineWidth = 1;

      // Grid lines
      const gridSize = 50;
      const gridOffset = (time * 15) % gridSize;
      for (let x = gridOffset; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Animated Glowing Sine Wave
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${secondaryRgb}, ${isDark ? 0.12 : 0.08})`;
      ctx.lineWidth = 1.5;
      for (let x = 0; x < width; x += 10) {
        const y = height * 0.85 + Math.sin(x * 0.005 + time) * 35 + Math.cos(x * 0.002 + time * 0.5) * 15;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 3. Render Falling Binary Matrix Stream Columns
      matrixColumns.forEach((col) => {
        col.y += col.speed;
        if (col.y > height) col.y = -40;

        ctx.font = '9px "JetBrains Mono Variable", monospace';
        ctx.fillStyle = `rgba(${secondaryRgb}, ${isDark ? 0.15 : 0.08})`;
        const char = col.chars[Math.floor((col.y + time * 100) % col.chars.length)];
        ctx.fillText(char, col.x, col.y);
      });

      // 4. Draw Connecting Tech Threads Between Near Nodes
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.14;
            ctx.strokeStyle = `rgba(${primaryRgb}, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // 5. Render Drifting Telemetry Glyphs & Thermal Dots
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -60) p.x = width + 60;
        if (p.x > width + 60) p.x = -60;
        if (p.y < -60) p.y = height + 60;
        if (p.y > height + 60) p.y = -60;

        const colorRgb = i % 3 === 0 ? primaryRgb : i % 3 === 1 ? secondaryRgb : accentRgb;

        if (p.isGlyph) {
          ctx.font = '10px "JetBrains Mono Variable", monospace';
          ctx.fillStyle = `rgba(${colorRgb}, ${p.opacity * (isDark ? 0.4 : 0.28)})`;
          ctx.fillText(p.glyph, p.x, p.y);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${colorRgb}, ${p.opacity * (isDark ? 0.55 : 0.38)})`;
          ctx.fill();
        }
      });

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-90 transition-opacity duration-500"
    />
  );
};
