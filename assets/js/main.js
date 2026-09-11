/* ==========================================================================
   GENIXGREEN — App Download Site · interactions
   所有占位符渲染 / 交互都在这里，配合 config.js 使用
   ========================================================================== */
(function () {
  'use strict';

  var CFG = window.GG_CONFIG || {};
  var links = CFG.links || {};
  var app = CFG.app || {};
  var company = CFG.company || {};
  var flags = CFG.features || {};

  /* ---------- helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  function get(obj, path) {
    return path.split('.').reduce(function (o, k) { return (o == null ? undefined : o[k]); }, obj);
  }
  function isPlaceholder(url) {
    return !url || url === '#' || /^REPLACE/i.test(url);
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var toastEl = $('#toast'), toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2200);
  }

  /* ---------- 1. 文本注入 ---------- */
  var SCOPE = { app: app, company: company };
  $$('[data-gg]').forEach(function (el) {
    var v = get(SCOPE, el.getAttribute('data-gg'));
    if (v != null && v !== '') el.textContent = v;
  });

  /* ---------- 2. 邮箱 / 电话 ---------- */
  $$('[data-gg-mail]').forEach(function (el) {
    var v = get(SCOPE, el.getAttribute('data-gg-mail'));
    if (!v) return;
    el.textContent = v;
    el.href = 'mailto:' + v;
  });
  $$('[data-gg-tel]').forEach(function (el) {
    var v = get(SCOPE, el.getAttribute('data-gg-tel'));
    if (!v) return;
    el.textContent = v;
    el.href = 'tel:' + v.replace(/[^\d+]/g, '');
  });

  /* ---------- 3. 链接注入 + 空链接降级 ---------- */
  $$('[data-gg-href]').forEach(function (el) {
    var url = get(links, el.getAttribute('data-gg-href'));
    if (isPlaceholder(url)) {
      el.setAttribute('aria-disabled', 'true');
      el.removeAttribute('href');
      el.addEventListener('click', function (e) {
        e.preventDefault();
        toast('Download link coming soon');
      });
    } else {
      el.href = url;
      el.setAttribute('aria-disabled', 'false');
      if (!el.hasAttribute('target') && /^https?:/i.test(url)) el.setAttribute('target', '_blank');
    }
  });

  /* ---------- 4. 二维码 ---------- */
  $$('[data-gg-src]').forEach(function (img) {
    var v = get(CFG, img.getAttribute('data-gg-src'));
    if (v) img.src = v;
  });

  /* ---------- 5. 数据条 ---------- */
  var statsGrid = $('#statsGrid');
  if (statsGrid) {
    if (CFG.stats && CFG.stats.length) {
      statsGrid.innerHTML = CFG.stats.map(function (s) {
        return '<div class="stat"><b>' + esc(s.value) + '</b><small>' + esc(s.label) + '</small></div>';
      }).join('');
    } else {
      var sec = $('#statsSection');
      if (sec) sec.remove();
    }
  }

  /* ---------- 6. 应用截图画廊 ---------- */
  var track = $('#screensTrack');
  if (track && CFG.screens && CFG.screens.length) {
    track.innerHTML = CFG.screens.map(function (s, i) {
      return '<figure class="shot">' +
        '<div class="shot__frame"><img src="' + esc(s.src) + '" alt="' + esc(s.title) + ' — GENIXGREEN app screenshot" ' +
        'width="460" loading="' + (i < 3 ? 'eager' : 'lazy') + '" decoding="async"></div>' +
        '<h4>' + esc(s.title) + '</h4>' +
        '<p>' + esc(s.caption) + '</p>' +
        '</figure>';
    }).join('');
  }

  /* ---------- 7. 逆变器协议 ---------- */
  var chips = $('#protocolChips');
  if (chips && CFG.protocols && CFG.protocols.length) {
    chips.innerHTML = CFG.protocols.map(function (p) {
      return '<li>' + esc(p) + '</li>';
    }).join('');
  }
  var faqP = $('#faqProtocols');
  if (faqP && CFG.protocols && CFG.protocols.length) {
    faqP.textContent = CFG.protocols.slice(0, 5).join(', ') + ' and more';
  }

  /* ---------- 8. 自动识别系统，高亮对应按钮 ---------- */
  if (flags.autoDetectOS !== false) {
    var ua = navigator.userAgent || '';
    var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    var isAndroid = /Android/i.test(ua);
    var bA = $('#btnAndroid'), bI = $('#btnIOS');
    if (isIOS && bI) {
      bI.classList.add('btn--pulse');
      if (bA) { bA.classList.remove('btn--dark'); bA.classList.add('btn--ghost'); }
    } else if (isAndroid && bA) {
      bA.classList.add('btn--pulse');
      if (bI) { bI.classList.remove('btn--primary'); bI.classList.add('btn--ghost'); }
    }
  }

  /* ---------- 9. 复制链接 ---------- */
  $$('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var url = get(links, btn.getAttribute('data-copy'));
      if (isPlaceholder(url)) { toast('Link not available yet'); return; }
      function done() { toast('Link copied to clipboard'); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done).catch(fallback);
      } else { fallback(); }
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = url;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:absolute;left:-9999px';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); } catch (e) { toast('Copy failed'); }
        document.body.removeChild(ta);
      }
    });
  });

  /* ---------- 10. 导航：滚动渐变实色 / 移动端面板 ---------- */
  var nav = $('#nav');
  var navToggle = $('#navToggle');

  function closeMenu() {
    if (!nav) return;
    nav.classList.remove('is-open');
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
    }
  }

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle('is-stuck', y > 12);
    var bar = $('#stickyBar');
    if (bar && flags.showStickyBar !== false) bar.classList.toggle('is-on', y > 520);
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { onScroll(); ticking = false; });
  }, { passive: true });
  onScroll();

  if (navToggle && nav) {
    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }

  var navLinks = $('#navLinks');
  if (navLinks) {
    navLinks.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeMenu();
    });
  }

  document.addEventListener('click', function (e) {
    if (nav && nav.classList.contains('is-open') && !nav.contains(e.target)) closeMenu();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 860) closeMenu();
  });

  /* ---------- 11. 滚动进场动画 ---------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- 12. 微信内提示 ---------- */
  if (flags.showWechatHint !== false) {
    var wx = $('#wxHint');
    if (wx && /MicroMessenger/i.test(navigator.userAgent)) {
      setTimeout(function () { wx.classList.add('is-on'); }, 900);
    }
    var wxClose = $('#wxClose');
    if (wxClose) wxClose.addEventListener('click', function () { wx.classList.remove('is-on'); });
    if (wx) wx.addEventListener('click', function (e) { if (e.target === wx) wx.classList.remove('is-on'); });
  }

  /* ---------- 13. 年份 ---------- */
  var y = $('#year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- 14. 开发期提示 ---------- */
  if (window.console && console.info) {
    var todo = [];
    ['androidApk', 'iosStore'].forEach(function (k) {
      if (isPlaceholder(links[k])) todo.push('links.' + k);
    });
    if (todo.length) console.info('[GENIXGREEN] 待填占位符 → assets/js/config.js:', todo.join(', '));
  }
})();
