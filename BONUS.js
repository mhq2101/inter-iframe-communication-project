//gets all the tiles
var tiles = document.querySelectorAll('li.tile')
// theres a child span with the price within each tile. go through all of them see which is >= 100 and hide the tile
tiles.forEach(function(tile) {
  if (parseInt(tile.querySelector('span.price').innerHTML.slice(1)) >= 100) {
    tile.style.display = 'none'
  }
})