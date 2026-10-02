(function () {
  var root = document.documentElement;
  try { var t = localStorage.getItem('theme'); if (t) root.setAttribute('data-theme', t); } catch (e) {}
  var tb = document.getElementById('themeBtn');
  if (tb) tb.onclick = function () {
    var cur = root.getAttribute('data-theme') ||
      (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var nx = cur === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', nx);
    try { localStorage.setItem('theme', nx); } catch (e) {}
  };
  var mb = document.getElementById('menuBtn');
  if (mb) mb.onclick = function () { document.body.classList.toggle('side-open'); };
  document.querySelectorAll('.side a').forEach(function (a) {
    a.addEventListener('click', function () { document.body.classList.remove('side-open'); });
  });
  // search filter
  var q = document.getElementById('q');
  if (q) q.addEventListener('input', function () {
    var v = q.value.trim().toLowerCase();
    document.querySelectorAll('.side .tree li').forEach(function (li) {
      var hit = !v || li.textContent.toLowerCase().indexOf(v) > -1;
      li.classList.toggle('hide', !hit);
      if (v && hit) { var d = li.querySelector('details'); if (d) d.open = true; }
    });
  });
  // active section highlight
  var page = location.pathname.split('/').pop() || 'index.html';
  var links = Array.prototype.slice.call(document.querySelectorAll('.side a[href^="' + page + '#"]'));
  var map = {};
  links.forEach(function (a) { var id = decodeURIComponent(a.getAttribute('href').split('#')[1]); (map[id] = map[id] || []).push(a); });
  var heads = Array.prototype.slice.call(document.querySelectorAll('.doc h2[id],.doc h3[id],.doc h4[id]'));
  if ('IntersectionObserver' in window && heads.length) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (a) { a.classList.remove('active'); });
          (map[e.target.id] || []).forEach(function (a) {
            a.classList.add('active');
            var d = a.closest('details'); while (d) { d.open = true; d = d.parentElement && d.parentElement.closest('details'); }
          });
        }
      });
    }, { rootMargin: '-70px 0px -70% 0px' });
    heads.forEach(function (h) { io.observe(h); });
  }
})();
