document.addEventListener('DOMContentLoaded', () => {
  mostrarListaGanadores();

  document.getElementById('btn-limpiar-ganadores').addEventListener('click', limpiarGanadores);
  document.getElementById('btn-volver-menu').addEventListener('click', volverMenu);
});

function mostrarListaGanadores() {
  const ganadores = JSON.parse(localStorage.getItem('ganadores')) || [];
  const ganadoresContainer = document.getElementById('ganadoresContainer');

  if (ganadores.length > 0) {
    ganadores.sort((a, b) => b.puntaje - a.puntaje); // Ordenar por puntaje descendente
    let tablaHTML = '<table><tr><th>Jugador</th><th>Puntaje</th><th>Fecha</th></tr>';
    ganadores.forEach(ganador => {
      tablaHTML += `<tr><td>${ganador.nombre}</td><td>${ganador.puntaje}</td><td>${ganador.fecha || 'N/A'}</td></tr>`;
    });
    tablaHTML += '</table>';
    ganadoresContainer.innerHTML = tablaHTML;
  } else {
    ganadoresContainer.innerHTML = '<p>No hay ganadores registrados aún.</p>';
  }
}

function limpiarGanadores() {
  if (confirm('¿Seguro que quieres borrar la lista de ganadores?')) {
    localStorage.removeItem('ganadores');
    mostrarListaGanadores();
  }
}

function volverMenu() {
  window.location.href = 'index.html';
}