document.addEventListener('DOMContentLoaded', () => {
  const cantidadJugadoresInput = document.getElementById('cantidadJugadores');
  cantidadJugadoresInput.addEventListener('change', generarCajasJugadores);
  document.getElementById('jugadoresInput').addEventListener('input', generarSelectPrimerJugador);
  document.getElementById('btn-volver-menu').addEventListener('click', volverMenu);
  generarCajasJugadores();
});

function guardarDatos() {
  const cantidadJugadores = parseInt(document.getElementById('cantidadJugadores').value);
  const jugadores = [];
  const nombresUsados = new Set();

  for (let i = 1; i <= cantidadJugadores; i++) {
    const jugadorNombre = document.getElementById(`jugador${i}`).value.trim();
    if (!jugadorNombre || nombresUsados.has(jugadorNombre)) {
      alert(`Error en el nombre del jugador ${i}: no puede estar vacío o ser repetido.`);
      return false;
    }
    nombresUsados.add(jugadorNombre);
    jugadores.push(jugadorNombre);
  }

  const primerJugadorIndex = parseInt(document.getElementById('primerJugador').value);
  const primerJugador = jugadores[primerJugadorIndex];

  if (confirm(`Iniciar partida con ${cantidadJugadores} jugadores. Primer turno: ${primerJugador}. ¿Correcto?`)) {
    localStorage.setItem('cantidadJugadores', cantidadJugadores);
    localStorage.setItem('jugadores', JSON.stringify(jugadores));
    localStorage.setItem('primerJugador', primerJugador);
    window.location.href = 'tablero.html';
  }
  return false;
}

function volverMenu() {
  window.location.href = 'index.html';
}

function generarCajasJugadores() {
  const cantidadJugadores = parseInt(document.getElementById('cantidadJugadores').value) || 1;
  const jugadoresInput = document.getElementById('jugadoresInput');
  let inputHTML = '';
  for (let i = 1; i <= cantidadJugadores; i++) {
    inputHTML += `<label for="jugador${i}">Nombre jugador ${i}:</label>`;
    inputHTML += `<input type="text" id="jugador${i}" maxlength="20" placeholder="Nombre jugador ${i}" required>`;
  }
  jugadoresInput.innerHTML = inputHTML;
  generarSelectPrimerJugador();
}

function generarSelectPrimerJugador() {
  const cantidadJugadores = parseInt(document.getElementById('cantidadJugadores').value) || 1;
  const selectHTML = document.getElementById('primerJugador');
  let selectOptions = '';
  for (let i = 1; i <= cantidadJugadores; i++) {
    const nombre = document.getElementById(`jugador${i}`)?.value.trim() || `Jugador ${i}`;
    selectOptions += `<option value="${i - 1}">${nombre}</option>`;
  }
  selectHTML.innerHTML = selectOptions;
}