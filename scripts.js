document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-nueva-partida').addEventListener('click', () => {
    window.location.href = 'nueva_partida.html';
  });
  document.getElementById('btn-lista-ganadores').addEventListener('click', () => {
    window.location.href = 'lista_Ganadores.html';
  });
  document.getElementById('btn-lista-jugadores').addEventListener('click', () => {
    window.location.href = 'lista_Jugadores.html';
  });
  document.getElementById('btn-tablero').addEventListener('click', () => {
    window.location.href = 'tablero.html';
  });
});