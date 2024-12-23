import { useEffect } from "react";

const CustomCursor = () => {
  useEffect(() => {
    const cursor = document.createElement("div");
    cursor.classList.add("custom-cursor");
    document.body.appendChild(cursor);

    let lastX = null;
    let lastY = null;

    const moveCursor = (e) => {
      const { clientX: x, clientY: y } = e;

      // Update cursor position
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;

      if (lastX !== null && lastY !== null) {
        // Draw a line segment between last and current cursor position
        const trail = document.createElement("div");
        trail.classList.add("trail-line");

        // Calculate line length and angle
        const deltaX = x - lastX;
        const deltaY = y - lastY;
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

        // Apply styles with slight randomness to simulate chalk effect
        const trailWidth = distance + Math.random() * 0.5; // Slight random variation
        const trailOpacity = 0.8 + Math.random() * 0.2; // Random opacity for variation

        trail.style.width = `${trailWidth}px`;
        trail.style.left = `${lastX}px`;
        trail.style.top = `${lastY}px`;
        trail.style.transform = `rotate(${angle}deg)`;
        trail.style.opacity = trailOpacity;

        document.body.appendChild(trail);

        // Remove trail after animation
        setTimeout(() => {
          document.body.removeChild(trail);
        }, 500); // Match fadeOut duration
      }

      lastX = x;
      lastY = y;
    };

    document.addEventListener("mousemove", moveCursor);

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.body.removeChild(cursor);
    };
  }, []);

  return null; // No visible render needed
};

export default CustomCursor;
