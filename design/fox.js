// Injecte la mascotte dans chaque <div class="foxbadge"></div> vide.
// Chargé par les slides ; Chrome l'exécute avant la capture.
document.querySelectorAll('.foxbadge').forEach(function (el) {
  if (el.children.length) return;
  el.innerHTML =
    '<svg viewBox="0 0 220 210" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M40 96 L27 20 Q29 9 39 15 L102 58 Z" fill="#E0762F"/>' +
    '<path d="M180 96 L193 20 Q191 9 181 15 L118 58 Z" fill="#E0762F"/>' +
    '<path d="M110 38 C168 38 188 80 188 114 C188 160 154 190 110 190 C66 190 32 160 32 114 C32 80 52 38 110 38 Z" fill="#FF9857"/>' +
    '<path d="M110 116 C144 116 166 136 166 156 C166 178 141 192 110 192 C79 192 54 178 54 156 C54 136 76 116 110 116 Z" fill="#FFF3E4"/>' +
    '<ellipse cx="80" cy="102" rx="11" ry="13" fill="#322D27"/>' +
    '<ellipse cx="140" cy="102" rx="11" ry="13" fill="#322D27"/>' +
    '<path d="M110 140 c13 0 20 6 20 13 c0 9 -10 15 -20 15 c-10 0 -20 -6 -20 -15 c0 -7 7 -13 20 -13 Z" fill="#322D27"/>' +
    '</svg>';
});
