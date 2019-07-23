document.addEventListener('DOMContentLoaded', function(event) {
  const checkboxes = document.getElementsByTagName('input');
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener('click', clickHandler);
  }
});

function clickHandler() {
  this.checked
    ? (this.parentNode.className = 'checked')
    : (this.parentNode.className = '');
}
