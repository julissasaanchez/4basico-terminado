// Lógica global para la Plataforma Matemática
const MathApp = {
  // Inicialización global
  init() {
    this.createBubbles();
    this.checkSession();
    this.updateHeaderScore();
    this.setupTTSButtons();
    this.bindClickSounds();
  },

  // Generar burbujas de fondo animadas de forma aleatoria
  createBubbles() {
    const container = document.createElement('div');
    container.className = 'bubbles-container';
    document.body.appendChild(container);

    const bubbleCount = 15;
    for (let i = 0; i < bubbleCount; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      
      const size = Math.random() * 80 + 30; // 30px a 110px
      const left = Math.random() * 100; // 0% a 100%
      const delay = Math.random() * 10;
      const duration = Math.random() * 10 + 10; // 10s a 20s
      
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${left}%`;
      bubble.style.animationDelay = `${delay}s`;
      bubble.style.animationDuration = `${duration}s`;
      
      container.appendChild(bubble);
    }
  },

  // Validación de Sesión y Datos
  checkSession() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Si estamos en index.html, no redirigir
    if (currentPage === 'index.html') {
      return;
    }

    const nombre = localStorage.getItem('mat_nombre');
    const avatar = localStorage.getItem('mat_avatar');

    // Si no existe sesión, redirigir a index.html
    if (!nombre || !avatar) {
      window.location.href = 'index.html';
    } else {
      // Mostrar información del perfil en la cabecera si los elementos existen
      const nameEl = document.getElementById('header-username-val');
      const avatarEl = document.getElementById('header-avatar-container');
      
      if (nameEl) nameEl.textContent = nombre;
      if (avatarEl && avatar) {
        avatarEl.innerHTML = this.getAvatarSVG(avatar);
      }
    }
  },

  // Retorna el código SVG correspondiente al avatar
  getAvatarSVG(avatarKey) {
    const avatars = {
      leoncito: `<svg viewBox="0 0 100 100" class="header-avatar-svg"><circle cx="50" cy="50" r="45" fill="#fcd34d"/><circle cx="50" cy="50" r="35" fill="#f59e0b"/><circle cx="35" cy="45" r="4" fill="#000"/><circle cx="65" cy="45" r="4" fill="#000"/><path d="M 45 60 Q 50 65 55 60" stroke="#000" stroke-width="3" fill="none"/><path d="M 35 30 A 8 8 0 0 1 47 38" stroke="#f59e0b" stroke-width="6" fill="none"/><path d="M 65 30 A 8 8 0 0 0 53 38" stroke="#f59e0b" stroke-width="6" fill="none"/></svg>`,
      osito: `<svg viewBox="0 0 100 100" class="header-avatar-svg"><circle cx="50" cy="50" r="40" fill="#b45309"/><circle cx="25" cy="25" r="12" fill="#78350f"/><circle cx="75" cy="25" r="12" fill="#78350f"/><circle cx="50" cy="53" r="30" fill="#d97706"/><circle cx="40" cy="48" r="4" fill="#000"/><circle cx="60" cy="48" r="4" fill="#000"/><ellipse cx="50" cy="58" rx="6" ry="4" fill="#000"/><path d="M 46 64 Q 50 67 54 64" stroke="#000" stroke-width="2" fill="none"/></svg>`,
      conejito: `<svg viewBox="0 0 100 100" class="header-avatar-svg"><ellipse cx="50" cy="65" rx="35" ry="25" fill="#f1f5f9"/><ellipse cx="30" cy="35" rx="10" ry="25" fill="#f1f5f9"/><ellipse cx="30" cy="35" rx="5" ry="18" fill="#fda4af"/><ellipse cx="70" cy="35" rx="10" ry="25" fill="#f1f5f9"/><ellipse cx="70" cy="35" rx="5" ry="18" fill="#fda4af"/><circle cx="40" cy="60" r="4" fill="#000"/><circle cx="60" cy="60" r="4" fill="#000"/><polygon points="47,67 53,67 50,71" fill="#fda4af"/><path d="M 45 74 Q 50 78 55 74" stroke="#475569" stroke-width="2" fill="none"/></svg>`,
      pandita: `<svg viewBox="0 0 100 100" class="header-avatar-svg"><circle cx="50" cy="55" r="38" fill="#fff" stroke="#1e293b" stroke-width="3"/><circle cx="25" cy="25" r="12" fill="#1e293b"/><circle cx="75" cy="25" r="12" fill="#1e293b"/><ellipse cx="38" cy="50" rx="7" ry="10" fill="#1e293b"/><ellipse cx="62" cy="50" rx="7" ry="10" fill="#1e293b"/><circle cx="38" cy="48" r="3" fill="#fff"/><circle cx="62" cy="48" r="3" fill="#fff"/><polygon points="48,60 52,60 50,63" fill="#1e293b"/><path d="M 46 66 Q 50 69 54 66" stroke="#1e293b" stroke-width="2" fill="none"/></svg>`,
      ranita: `<svg viewBox="0 0 100 100" class="header-avatar-svg"><ellipse cx="50" cy="58" rx="42" ry="32" fill="#4ade80"/><circle cx="32" cy="32" r="12" fill="#4ade80"/><circle cx="68" cy="32" r="12" fill="#4ade80"/><circle cx="32" cy="32" r="6" fill="#fff"/><circle cx="68" cy="32" r="6" fill="#fff"/><circle cx="32" cy="32" r="3" fill="#000"/><circle cx="68" cy="32" r="3" fill="#000"/><ellipse cx="50" cy="65" rx="20" ry="12" fill="#166534"/><ellipse cx="22" cy="60" rx="6" ry="4" fill="#f87171"/><ellipse cx="78" cy="60" rx="6" ry="4" fill="#f87171"/></svg>`,
      zorrito: `<svg viewBox="0 0 100 100" class="header-avatar-svg"><polygon points="50,25 20,65 80,65" fill="#f97316"/><polygon points="50,25 35,50 65,50" fill="#ea580c"/><polygon points="20,65 50,65 30,85" fill="#fff"/><polygon points="80,65 50,65 70,85" fill="#fff"/><polygon points="30,85 50,65 70,85" fill="#f97316"/><circle cx="38" cy="65" r="4" fill="#000"/><circle cx="62" cy="65" r="4" fill="#000"/><ellipse cx="50" cy="80" rx="6" ry="5" fill="#000"/><path d="M 45 50 Q 50 45 55 50" stroke="#f97316" stroke-width="3" fill="none"/></svg>`
    };
    return avatars[avatarKey] || '';
  },

  // Obtener puntaje actual
  getScore() {
    const score = localStorage.getItem('mat_score');
    return score ? parseInt(score, 10) : 0;
  },

  // Añadir puntos al puntaje global
  addScore(points) {
    const current = this.getScore();
    const newScore = current + points;
    localStorage.setItem('mat_score', newScore);
    this.updateHeaderScore();
    
    // Animación pequeña al elemento de puntaje
    const scoreEl = document.getElementById('header-score-box');
    if (scoreEl) {
      scoreEl.classList.remove('score-glow');
      void scoreEl.offsetWidth; // trigger reflow
      scoreEl.classList.add('score-glow');
    }
  },

  // Actualizar la vista del puntaje
  updateHeaderScore() {
    const scoreValEl = document.getElementById('header-score-val');
    if (scoreValEl) {
      scoreValEl.textContent = this.getScore();
    }
  },

  // Configurar botones de reproducción de voz
  setupTTSButtons() {
    // Buscar todos los elementos con la clase "tts-text"
    const textElements = document.querySelectorAll('.tts-text');
    textElements.forEach((el, index) => {
      // Verificar si ya tiene un botón de parlante adjunto
      if (el.nextElementSibling && el.nextElementSibling.classList.contains('tts-button')) {
        return;
      }
      
      // Crear botón de altavoz
      const btn = document.createElement('button');
      btn.className = 'tts-button';
      btn.type = 'button';
      btn.innerHTML = '🔊';
      btn.title = 'Escuchar texto';
      btn.setAttribute('aria-label', 'Escuchar texto');
      
      // Insertar el botón inmediatamente después del texto o alineado
      el.parentNode.insertBefore(btn, el.nextSibling);

      // Evento de reproducción
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        MathAudio.playClick();
        MathAudio.speak(el.innerText || el.textContent, btn);
      });
      
      // Auto-reproducción de la primera instrucción principal (tts-auto) tras interacción
      if (el.classList.contains('tts-auto') && index === 0) {
        setTimeout(() => {
          // Intentamos reproducir automáticamente
          MathAudio.speak(el.innerText || el.textContent, btn);
        }, 800);
      }
    });
  },

  // Vincular sonidos de clic a todos los botones y links interactivos
  bindClickSounds() {
    const clickables = document.querySelectorAll('button, a, .avatar-option, .number-bubble, .coin-item, .drag-item');
    clickables.forEach(el => {
      if (el.tagName === 'BUTTON' || el.tagName === 'A' || el.classList.contains('avatar-option')) {
        el.addEventListener('click', () => {
          if (!el.classList.contains('tts-button')) {
            MathAudio.playClick();
          }
        });
      }
    });
  },

  // Sistema de Confeti Canvas
  lanzarConfeti() {
    let canvas = document.getElementById('confetti-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'confetti-canvas';
      document.body.appendChild(canvas);
    }
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Ajustar en resize
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    const colors = ['#ff7e40', '#ffc83b', '#3cd070', '#3ab7f8', '#b55fe6', '#f43f5e'];
    const particles = [];
    const particleCount = 120;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 6 + 4,
        d: Math.random() * canvas.height,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 5,
        tiltAngleIncremental: Math.random() * 0.07 + 0.02,
        tiltAngle: 0
      });
    }

    let animationId;
    let startTime = Date.now();

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, index) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle - index / 3) * 15;

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();

        // Reposicionar partículas si caen abajo
        if (p.y > canvas.height) {
          p.x = Math.random() * canvas.width;
          p.y = -20;
          p.tilt = Math.random() * 10 - 5;
        }
      });

      // Detener después de 4 segundos
      if (Date.now() - startTime < 4000) {
        animationId = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationId);
        if (canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }
    }

    draw();
  },

  // Cerrar sesión y limpiar localStorage
  cerrarSesion() {
    localStorage.removeItem('mat_nombre');
    localStorage.removeItem('mat_avatar');
    localStorage.removeItem('mat_score');
    window.location.href = 'index.html';
  },

  // Reiniciar puntaje y volver a jugar
  reiniciarProgreso(redirigirA = 'basico4.html') {
    localStorage.setItem('mat_score', 0);
    window.location.href = redirigirA;
  }
};

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  MathApp.init();
});
