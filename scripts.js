let spans;
let systemEntered = false;

function start() {
    init();
    update();
}

const myPlaylists = [
    { name: "⚡️", id: "3p08bohQu5adH7nzsZ9acv" },
    { name: "danielito", id: "6nhi8SEgbCLTMnNqkF92E3" },
    { name: "mix spanish", id: "67dSQxc9WpYYiLljHZDyfR" },
    { name: "mix 2016", id: "78TWH4kgrhIaLcphZTEXSJ" }
];

//INICIO:
function enterSystem() {
    if(systemEntered) return;
    systemEntered = true;

    const login = document.getElementById('login-screen');
    login.classList.add('slide-up')

    setTimeout(() => {
        login.style.display = 'none';
        document.getElementById('desktop').style.display = 'block';
        initMosaic(); 
    }, 300);
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        enterSystem();
    }
});

//FONDO:
function initMosaic(){
    const container = document.getElementById('container');
    const cols = 40;
    const total = 300;

    for(let i = 0; i < total; i++) {
        const span = document.createElement('span');
        const row = Math.floor(i / cols);
        const col = i % cols;
        
        span.dataset.index = i;
        span.dataset.row = row;
        span.dataset.col = col;
        
        container.appendChild(span);
    }
    spans = document.querySelectorAll('span');

    container.addEventListener('mouseover', (e) => {
        if (e.target.tagName === 'SPAN') {
            const r = parseInt(e.target.dataset.row);
            const c = parseInt(e.target.dataset.col);
            
            e.target.classList.add('active');

            spans.forEach(s => {
                const sr = parseInt(s.dataset.row);
                const sc = parseInt(s.dataset.col);
                
                const distRow = Math.abs(sr - r);
                const distCol = Math.abs(sc - c);

                if ((distRow === 1 && distCol === 0) || (distRow === 0 && distCol === 1)) {
                    s.classList.add('near');
                }
            });
        }
    });

    container.addEventListener('mouseout', (e) => {
        if (e.target.tagName === 'SPAN') {
            e.target.classList.remove('active');
            spans.forEach(s => s.classList.remove('near'));
        }
    });
}

//TOP BAR
function updateDateTime() {
    const now = new Date();
    
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const dayString = now.toLocaleDateString('en-US', options);
    
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: 'false' 
    });

    document.getElementById('day').textContent = dayString;
    document.getElementById('time').textContent = timeString;
}

setInterval(updateDateTime, 1000);

updateDateTime();

async function showWeather() {
    const ventana = document.getElementById('window-clima');
    ventana.style.display = 'block';
    ventana.style.zIndex = "9999";

    const content = document.getElementById('weather-content');
    content.innerHTML = "<p>Detectando ubicación...</p>";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const apiKey = '39e5d453e46c0ba96d06e7b4dd258f25'; 
            
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;

            try {
                const response = await fetch(url);
                const data = await response.json();

                const iconCode = data.weather[0].icon;
                const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
                
                content.innerHTML = `
                    <h3>${data.name}</h3>
                    <img src="${iconUrl}" alt="clima" class="weather-icon">
                    <p>Temp: ${Math.round(data.main.temp)}°C</p>
                    <p>Estado: ${data.weather[0].description}</p>
                `;
            } catch (error) {
                console.error(error);
                content.innerHTML = "<p>Error al procesar datos.</p>";
            }
        }, (error) => {
            content.innerHTML = "<p>Permiso de ubicación denegado.</p>";
        });
    } else {
        content.innerHTML = "<p>Geolocalización no soportada.</p>";
    }
}

//STICKERS
interact('.sticker')
  .draggable({
    listeners: {
      move (event) {
        const target = event.target;
        target.classList.add('dragging'); 
        
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
        target.style.transform = `translate(${x}px, ${y}px)`;
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      },
      end (event) {
        setTimeout(() => event.target.classList.remove('dragging'), 100);
      }
    }
  })

  .on('tap', (event) => {
    if (event.currentTarget.classList.contains('dragging')) {
      event.preventDefault();
    }
  });

document.addEventListener('DOMContentLoaded', () => {
    
    document.querySelectorAll('.sticker').forEach(sticker => {
        sticker.addEventListener('click', (e) => {
            if (sticker.classList.contains('dragging')) return;

            const targetId = sticker.getAttribute('data-target');
            console.log("Intentando abrir:", targetId); 
            
            const ventana = document.getElementById(targetId);
            
            if (ventana) {
                ventana.style.display = 'block';
                ventana.style.zIndex = "9999"; 
            } else {
                console.error("No se encontró la ventana con ID:", targetId);
            }
        });
    });

});


//VENTANAS
function minimizeWindow(windowId) {
    const ventana = document.getElementById(windowId);
    ventana.style.display = 'none'; 
}

function openWindow(windowId) {
    const ventana = document.getElementById(windowId);
    ventana.style.display = 'block';
    ventana.style.zIndex = '1000';


    const icon = document.querySelector(`.app[data-target="${windowId}"]`);
    if (icon) icon.classList.add('app-active');
    
    if (windowId === 'window-spotify') {
        const content = ventana.querySelector('.content');
        const iframe = content.querySelector('iframe');

        if (!iframe) {
            myPlaylists.forEach(playlist => {
                const embedHtml = `
                    <iframe style="border-radius:12px; width:90%; height:400px; margin: 10px;" 
                            src="https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=generator" 
                            frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                            loading="lazy">
                    </iframe>
                `;
                content.insertAdjacentHTML('beforeend', embedHtml);
            });
        }
    }

    if (windowId === 'window-paint') {
        createCanvas();
    }

}

function toggleApp(windowId) {
    const ventana = document.getElementById(windowId);
    const icon = document.querySelector(`.app[data-target="${windowId}"]`);
    
    if (ventana.style.display === 'block') {
        minimizeWindow(windowId);
    } else {
        openWindow(windowId);
    }
}

window.closeWindow = function(id) {
    const ventana = document.getElementById(id);
    if (!ventana) return;

    ventana.style.display = 'none';

    if (id === 'window-spotify') {
        const iframe = ventana.querySelector('iframe');
        if (iframe) iframe.src = "";
    }

    const icon = document.querySelector(`.app[data-target="${id}"]`);
    if (icon) icon.classList.remove('app-active');
};

interact('.local-window .title-bar').draggable({
    listeners: {
        move(event) {
            const target = event.target.parentElement;

            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            target.style.transform = `translate(${x}px, ${y}px)`;

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        }
    }
});

//BOTTOM BAR
document.querySelectorAll('#bottom-bar .app').forEach(app => {
    app.addEventListener('click', () => {
        const targetId = app.getAttribute('data-target');
        toggleApp(targetId);
    });
});

//pixel art 
function createCanvas() {
    const canvas = document.getElementById('pixel-canvas');
    const colorPicker = document.getElementById('colorPicker');
    
    // Crear 400 píxeles (20x20)
    for (let i = 0; i < 720; i++) {
        const pixel = document.createElement('span');
        
        // Pintar al hacer click o arrastrar
        pixel.addEventListener('mousedown', () => pixel.style.backgroundColor = colorPicker.value);
        pixel.addEventListener('mouseover', (e) => {
            if (e.buttons === 1) pixel.style.backgroundColor = colorPicker.value;
        });
        
        canvas.appendChild(pixel);
    }
}

function clearCanvas() {
    document.querySelectorAll('#pixel-canvas span').forEach(p => p.style.backgroundColor = 'white');
}

createCanvas();