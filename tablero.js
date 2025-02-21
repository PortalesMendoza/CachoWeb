const puntajes = {
  "B": [0, 1, 2, 3, 4, 5], "D": [0, 2, 4, 6, 8, 10], "T": [0, 3, 6, 9, 12, 15],
  "E": [0, 20, 25], "F": [0, 30, 35], "P": [0, 40, 45], "C": [0, 4, 8, 12, 16, 20],
  "Q": [0, 5, 10, 15, 20, 25, 30], "S": [0, 6, 12, 18, 24, 30], "G": [0, 50, 55]
};

let turnoActualIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  const cantidadJugadores = parseInt(localStorage.getItem('cantidadJugadores'));
  const jugadores = JSON.parse(localStorage.getItem('jugadores')) || [];
  const primerJugador = localStorage.getItem('primerJugador');

  if (!cantidadJugadores || jugadores.length === 0) {
    alert('No hay datos de partida. Por favor, inicia una nueva partida.');
    window.location.href = 'nueva_partida.html';
    return;
  }

  turnoActualIndex = jugadores.indexOf(primerJugador);
  if (turnoActualIndex === -1) turnoActualIndex = 0;

  generarTableros(cantidadJugadores, jugadores);
  calcularPuntajes();

  document.getElementById('btn-volver-menu').addEventListener('click', volverMenu);
  document.getElementById('btn-cerrar-modal').addEventListener('click', closeModal);
  document.querySelector('#modal .close').addEventListener('click', closeModal);
  document.getElementById('btn-confirmar-primer-turno').addEventListener('click', confirmarPrimerTurno);
});

function generarTableros(cantidadJugadores, jugadores) {
  const tablerosContainer = document.getElementById('tablerosContainer');
  let tablerosHTML = '';
  for (let i = 0; i < cantidadJugadores; i++) {
    const esTurno = i === turnoActualIndex ? ' (Turno actual)' : '';
    tablerosHTML += `
      <div class="tablero" id="tablero-${i + 1}">
        <h2>Jugador ${i + 1}: ${jugadores[i]}${esTurno}</h2>
        <table>
          <tr>
            <td data-posicion="B" onclick="showModal(${i + 1}, 'B')"></td>
            <td data-posicion="E" onclick="showModal(${i + 1}, 'E')"></td>
            <td data-posicion="C" onclick="showModal(${i + 1}, 'C')"></td>
          </tr>
          <tr>
            <td data-posicion="D" onclick="showModal(${i + 1}, 'D')"></td>
            <td data-posicion="F" onclick="showModal(${i + 1}, 'F')"></td>
            <td data-posicion="Q" onclick="showModal(${i + 1}, 'Q')"></td>
          </tr>
          <tr>
            <td data-posicion="T" onclick="showModal(${i + 1}, 'T')"></td>
            <td data-posicion="P" onclick="showModal(${i + 1}, 'P')"></td>
            <td data-posicion="S" onclick="showModal(${i + 1}, 'S')"></td>
          </tr>
          <tr>
            <td></td>
            <td data-posicion="G" onclick="showModal(${i + 1}, 'G')"></td>
            <td></td>
          </tr>
        </table>
      </div>`;
  }
  tablerosContainer.innerHTML = tablerosHTML;
  restaurarPuntajes(cantidadJugadores);
}

function restaurarPuntajes(cantidadJugadores) {
  for (let i = 0; i < cantidadJugadores; i++) {
    const tablero = document.getElementById(`tablero-${i + 1}`);
    const celdas = tablero.querySelectorAll('td[data-posicion]');
    celdas.forEach(celda => {
      const posicion = celda.getAttribute('data-posicion');
      const puntajeGuardado = localStorage.getItem(`tablero-${i + 1}-${posicion}`);
      if (puntajeGuardado !== null) {
        celda.textContent = puntajeGuardado;
      }
    });
  }
}

function showModal(tableroIndex, posicion) {
  const cuadro = document.querySelector(`#tablero-${tableroIndex} td[data-posicion="${posicion}"]`);
  if (cuadro.textContent !== '') return;
  const modal = document.getElementById('modal');
  const puntajesDisponibles = puntajes[posicion];
  document.getElementById('posicionTitulo').textContent = `Selecciona el puntaje para ${getNombreCompleto(posicion)}`;
  document.getElementById('puntajesDisponibles').innerHTML = puntajesDisponibles
    .map(p => `<div class="puntaje-disponible" onclick="elegirPuntajeModal(${tableroIndex}, '${posicion}', ${p})">${p}</div>`).join('');
  modal.style.display = 'block';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

function getNombreCompleto(posicion) {
  const nombres = { "B": "BALA", "D": "DUQUE", "T": "TREN", "E": "ESCALA", "F": "FULL", "P": "POKER", "C": "CUADRA", "Q": "QUINA", "S": "SENA", "G": "GRANDE" };
  return nombres[posicion];
}

function elegirPuntajeModal(tableroIndex, posicion, puntaje) {
  closeModal();
  const tablero = document.getElementById(`tablero-${tableroIndex}`);
  const cuadro = tablero.querySelector(`td[data-posicion="${posicion}"]`);
  cuadro.textContent = puntaje;
  localStorage.setItem(`tablero-${tableroIndex}-${posicion}`, puntaje);

  if (posicion === "G" && puntaje === 55) {
    const jugadores = JSON.parse(localStorage.getItem('jugadores'));
    const ganador = { nombre: jugadores[tableroIndex - 1], puntaje, fecha: new Date().toLocaleDateString() };
    guardarGanador(ganador);
    document.getElementById('ganadorContainer').innerHTML = `
      <p>¡Felicidades, ${ganador.nombre}! Ganaste con Tuti (55 puntos).</p>
      <button onclick="nuevaPartida()">Nueva partida</button>
      <button onclick="finalizarPartida()">Finalizar partida</button>
      <button onclick="volverAJugar()">Volver a jugar</button>`;
  } else {
    actualizarTablero(tableroIndex);
    rotarTurno();
  }
}

function rotarTurno() {
  const cantidadJugadores = parseInt(localStorage.getItem('cantidadJugadores'));
  const jugadores = JSON.parse(localStorage.getItem('jugadores'));
  turnoActualIndex = (turnoActualIndex + 1) % cantidadJugadores;

  for (let i = 0; i < cantidadJugadores; i++) {
    const tablero = document.getElementById(`tablero-${i + 1}`);
    const h2 = tablero.querySelector('h2');
    const esTurno = i === turnoActualIndex ? ' (Turno actual)' : '';
    h2.textContent = `Jugador ${i + 1}: ${jugadores[i]}${esTurno}`;
  }
}

function calcularPuntajes() {
  const cantidadJugadores = localStorage.getItem('cantidadJugadores');
  for (let i = 0; i < cantidadJugadores; i++) {
    actualizarTablero(i + 1);
  }
}

function actualizarTablero(tableroIndex) {
  const tablero = document.getElementById(`tablero-${tableroIndex}`);
  const puntajesJugador = tablero.querySelectorAll('td[data-posicion]');
  let puntajeTotal = Array.from(puntajesJugador).reduce((sum, cuadro) => sum + (parseInt(cuadro.textContent) || 0), 0);
  const puntajeTotalElement = tablero.querySelector('p');
  if (puntajeTotalElement) puntajeTotalElement.remove();
  tablero.insertAdjacentHTML('beforeend', `<p>Puntaje total: ${puntajeTotal}</p>`);

  const posicionesCompletas = Array.from(puntajesJugador).every(cuadro => cuadro.textContent !== '');
  if (posicionesCompletas) {
    mostrarGanadorAlFinalizar();
  }
}

function mostrarGanadorAlFinalizar() {
  const cantidadJugadores = parseInt(localStorage.getItem('cantidadJugadores'));
  const jugadores = JSON.parse(localStorage.getItem('jugadores'));
  let maxPuntaje = -1;
  let ganadorIndex = -1;

  for (let i = 0; i < cantidadJugadores; i++) {
    const tablero = document.getElementById(`tablero-${i + 1}`);
    const puntajesJugador = tablero.querySelectorAll('td[data-posicion]');
    const puntajeTotal = Array.from(puntajesJugador).reduce((sum, cuadro) => sum + (parseInt(cuadro.textContent) || 0), 0);
    if (puntajeTotal > maxPuntaje) {
      maxPuntaje = puntajeTotal;
      ganadorIndex = i;
    }
  }

  if (ganadorIndex !== -1) {
    const ganador = { nombre: jugadores[ganadorIndex], puntaje: maxPuntaje, fecha: new Date().toLocaleDateString() };
    document.getElementById('ganadorContainer').innerHTML = `
      <p>¡Felicidades, ${ganador.nombre}! Ganaste con un puntaje de ${ganador.puntaje} puntos.</p>
      <button onclick="nuevaPartida()">Nueva partida</button>
      <button onclick="finalizarPartida()">Finalizar partida</button>
      <button onclick="volverAJugar()">Volver a jugar</button>`;
  }
}

function guardarGanador(ganador) {
  const listaGanadores = JSON.parse(localStorage.getItem('ganadores')) || [];
  listaGanadores.push(ganador);
  localStorage.setItem('ganadores', JSON.stringify(listaGanadores));
}

function volverMenu() {
  window.location.href = 'index.html';
}

function nuevaPartida() {
  const cantidadJugadores = parseInt(localStorage.getItem('cantidadJugadores'));
  const jugadores = JSON.parse(localStorage.getItem('jugadores'));
  let maxPuntaje = -1;
  let ganadorIndex = -1;

  for (let i = 0; i < cantidadJugadores; i++) {
    const tablero = document.getElementById(`tablero-${i + 1}`);
    const puntajesJugador = tablero.querySelectorAll('td[data-posicion]');
    const puntajeTotal = Array.from(puntajesJugador).reduce((sum, cuadro) => sum + (parseInt(cuadro.textContent) || 0), 0);
    if (puntajeTotal > maxPuntaje) {
      maxPuntaje = puntajeTotal;
      ganadorIndex = i;
    }
  }

  if (ganadorIndex !== -1) {
    const ganador = { nombre: jugadores[ganadorIndex], puntaje: maxPuntaje, fecha: new Date().toLocaleDateString() };
    guardarGanador(ganador);
  }

  limpiarPuntajesLocalStorage();
  window.location.href = 'nueva_partida.html';
}

function finalizarPartida() {
  const cantidadJugadores = parseInt(localStorage.getItem('cantidadJugadores'));
  const jugadores = JSON.parse(localStorage.getItem('jugadores'));
  let maxPuntaje = -1;
  let ganadorIndex = -1;

  for (let i = 0; i < cantidadJugadores; i++) {
    const tablero = document.getElementById(`tablero-${i + 1}`);
    const puntajesJugador = tablero.querySelectorAll('td[data-posicion]');
    const puntajeTotal = Array.from(puntajesJugador).reduce((sum, cuadro) => sum + (parseInt(cuadro.textContent) || 0), 0);
    if (puntajeTotal > maxPuntaje) {
      maxPuntaje = puntajeTotal;
      ganadorIndex = i;
    }
  }

  if (ganadorIndex !== -1) {
    const ganador = { nombre: jugadores[ganadorIndex], puntaje: maxPuntaje, fecha: new Date().toLocaleDateString() };
    guardarGanador(ganador);
  }

  limpiarPuntajesLocalStorage();
  localStorage.removeItem('cantidadJugadores');
  localStorage.removeItem('jugadores');
  localStorage.removeItem('primerJugador');
  window.location.href = 'index.html';
}

function volverAJugar() {
  const cantidadJugadores = parseInt(localStorage.getItem('cantidadJugadores'));
  const jugadores = JSON.parse(localStorage.getItem('jugadores'));
  let maxPuntaje = -1;
  let ganadorIndex = -1;

  for (let i = 0; i < cantidadJugadores; i++) {
    const tablero = document.getElementById(`tablero-${i + 1}`);
    const puntajesJugador = tablero.querySelectorAll('td[data-posicion]');
    const puntajeTotal = Array.from(puntajesJugador).reduce((sum, cuadro) => sum + (parseInt(cuadro.textContent) || 0), 0);
    if (puntajeTotal > maxPuntaje) {
      maxPuntaje = puntajeTotal;
      ganadorIndex = i;
    }
  }

  if (ganadorIndex !== -1) {
    const ganador = { nombre: jugadores[ganadorIndex], puntaje: maxPuntaje, fecha: new Date().toLocaleDateString() };
    guardarGanador(ganador);
  }

  limpiarPuntajesLocalStorage();

  const modalPrimerTurno = document.getElementById('modal-primer-turno');
  const selectPrimerJugador = document.getElementById('nuevoPrimerJugador');
  selectPrimerJugador.innerHTML = jugadores.map((jugador, index) => `<option value="${index}">${jugador}</option>`).join('');
  modalPrimerTurno.style.display = 'block';
}

function closePrimerTurnoModal() {
  document.getElementById('modal-primer-turno').style.display = 'none';
}

function confirmarPrimerTurno() {
  const nuevoPrimerJugadorIndex = parseInt(document.getElementById('nuevoPrimerJugador').value);
  const jugadores = JSON.parse(localStorage.getItem('jugadores'));
  localStorage.setItem('primerJugador', jugadores[nuevoPrimerJugadorIndex]);
  turnoActualIndex = nuevoPrimerJugadorIndex;

  closePrimerTurnoModal();
  generarTableros(jugadores.length, jugadores);
  calcularPuntajes();
  document.getElementById('ganadorContainer').innerHTML = '';
}

function limpiarPuntajesLocalStorage() {
  const cantidadJugadores = parseInt(localStorage.getItem('cantidadJugadores'));
  for (let i = 0; i < cantidadJugadores; i++) {
    for (let pos of Object.keys(puntajes)) {
      localStorage.removeItem(`tablero-${i + 1}-${pos}`);
    }
  }
}