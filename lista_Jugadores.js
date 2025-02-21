document.addEventListener('DOMContentLoaded', () => {
  mostrarListaJugadores();

  document.getElementById('btn-limpiar-jugadores').addEventListener('click', limpiarJugadores);
  document.getElementById('btn-volver-menu').addEventListener('click', volverMenu);
});

function mostrarListaJugadores() {
  const jugadores = JSON.parse(localStorage.getItem('jugadores')) || [];
  const listaJugadoresContainer = document.getElementById('listaJugadoresContainer');

  if (jugadores.length > 0) {
    let tablaHTML = '<table><tr><th>Jugador</th><th>Editar Nombre</th></tr>';
    jugadores.forEach(jugador => {
      tablaHTML += `<tr><td>${jugador}</td><td><button onclick="editarNombre('${jugador}')">Editar</button></td></tr>`;
    });
    tablaHTML += '</table>';
    listaJugadoresContainer.innerHTML = tablaHTML;
  } else {
    listaJugadoresContainer.innerHTML = '<p>No hay jugadores registrados aún.</p>';
  }
}

function editarNombre(jugador) {
  const nuevoNombre = prompt(`Ingrese el nuevo nombre para ${jugador}:`, jugador);
  if (nuevoNombre !== null && nuevoNombre.trim() !== '') {
    const jugadores = JSON.parse(localStorage.getItem('jugadores')) || [];
    if (jugadores.includes(nuevoNombre.trim()) && nuevoNombre.trim() !== jugador) {
      alert('Ese nombre ya está en uso.');
      return;
    }
    const index = jugadores.indexOf(jugador);
    if (index !== -1) {
      jugadores[index] = nuevoNombre.trim();
      localStorage.setItem('jugadores', JSON.stringify(jugadores));
      mostrarListaJugadores();
    }
  }
}

function limpiarJugadores() {
  if (confirm('¿Seguro que quieres borrar la lista de jugadores?')) {
    localStorage.removeItem('jugadores');
    mostrarListaJugadores();
  }
}

function volverMenu() {
  window.location.href = 'index.html';
}