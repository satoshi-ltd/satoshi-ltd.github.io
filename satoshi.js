// Satoshi Ltd. — minimal vanilla JS (book-call modal + hero matrix bg + mobile nav)

// Mobile nav toggle — inject $ menu button, expand/collapse links panel
(function () {
  'use strict';

  var nav = document.querySelector('.sat-nav');
  if (!nav) return;
  var links = nav.querySelector('.sat-nav__links');
  if (!links) return;

  var btn = document.createElement('button');
  btn.className = 'sat-nav__toggle';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Toggle menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<span class="prompt">$</span><span data-slot="label">menu</span><span class="chev" aria-hidden="true">▾</span>';

  var ip = nav.querySelector('.sat-nav__ip');
  if (ip) nav.insertBefore(btn, ip);
  else nav.appendChild(btn);

  var labelEl = btn.querySelector('[data-slot="label"]');

  function setOpen(open) {
    nav.classList.toggle('sat-nav--open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    labelEl.textContent = open ? 'close' : 'menu';
  }

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    setOpen(!nav.classList.contains('sat-nav--open'));
  });

  links.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('click', function (e) {
    if (!nav.classList.contains('sat-nav--open')) return;
    if (nav.contains(e.target)) return;
    setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('sat-nav--open')) setOpen(false);
  });
})();

// Hero matrix rain — subtle hex characters, paused off-screen, respects reduced-motion
(function () {
  'use strict';

  var canvas = document.querySelector('.sat-hero-bg');
  if (!canvas || !canvas.getContext) return;

  var mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq && mq.matches) return;

  var ctx = canvas.getContext('2d');
  var CHARS = '0123456789ABCDEF·  ';
  var FONT_SIZE = 14;
  var columns = [];
  var w = 0, h = 0;
  var raf = 0;

  function resize() {
    var rect = canvas.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.max(1, Math.floor(rect.width));
    h = Math.max(1, Math.floor(rect.height));
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = FONT_SIZE + 'px ui-monospace, "SF Mono", Menlo, monospace';
    ctx.textBaseline = 'top';

    var numCols = Math.ceil(w / FONT_SIZE);
    columns.length = numCols;
    for (var i = 0; i < numCols; i++) {
      if (columns[i] == null) {
        columns[i] = (Math.random() * -h / FONT_SIZE) | 0;
      }
    }

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, w, h);
  }

  function step() {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.06)';
    ctx.fillRect(0, 0, w, h);

    for (var i = 0; i < columns.length; i++) {
      var y = columns[i] * FONT_SIZE;
      if (y > -FONT_SIZE && y < h) {
        var ch = CHARS.charAt((Math.random() * CHARS.length) | 0);
        var isHead = Math.random() > 0.92;
        ctx.fillStyle = isHead ? 'rgba(255, 196, 49, 0.55)' : 'rgba(255, 196, 49, 0.22)';
        ctx.fillText(ch, i * FONT_SIZE, y);
      }
      columns[i]++;
      if (y > h && Math.random() > 0.975) {
        columns[i] = -((Math.random() * 20) | 0);
      }
    }

    raf = requestAnimationFrame(step);
  }

  function start() { if (!raf) raf = requestAnimationFrame(step); }
  function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

  resize();
  var resizeTimer = 0;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 120);
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.isIntersecting ? start() : stop(); });
    }).observe(canvas);
  } else {
    start();
  }
})();

(function () {
  'use strict';

  var EMAIL = 'hello@satoshi-ltd.com';

  function h(tag, attrs, children) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'class') el.className = attrs[k];
        else if (k === 'text') el.textContent = attrs[k];
        else if (k === 'html') el.innerHTML = attrs[k];
        else el.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) {
      if (c == null) return;
      el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return el;
  }

  function buildMailto(form) {
    var subject = 'Book a call — ' + (form.name || 'new brief') + (form.company ? ' / ' + form.company : '');
    var body = [
      '// new engagement request',
      '',
      'Name      : ' + form.name,
      'Email     : ' + form.email,
      'Company   : ' + (form.company || '—'),
      'Role      : ' + (form.role || '—'),
      'Engagement: ' + form.engagement,
      'Timeline  : ' + form.timeline,
      '',
      '--- brief ---',
      form.brief,
      '',
      '--- end ---',
      'Sent from satoshi-ltd.com'
    ].join('\n');
    return 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  function buildClipboard(form) {
    return [
      'To: ' + EMAIL,
      'Subject: Book a call — ' + (form.name || 'new brief'),
      '',
      'Name      : ' + form.name,
      'Email     : ' + form.email,
      'Company   : ' + (form.company || '—'),
      'Role      : ' + (form.role || '—'),
      'Engagement: ' + form.engagement,
      'Timeline  : ' + form.timeline,
      '',
      '--- brief ---',
      form.brief
    ].join('\n');
  }

  function renderModal() {
    var modal = h('div', { class: 'sat-modal', id: 'sat-book-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'sat-book-title', hidden: '' });
    modal.innerHTML =
      '<div class="sat-modal__dialog">' +
        '<div class="sat-modal__chrome">' +
          '<div class="sat-modal__title"><span class="pulse"></span><span>~/SATOSHI/BOOK_A_CALL.SH</span></div>' +
          '<button class="sat-modal__close" type="button" aria-label="Close">×</button>' +
        '</div>' +
        '<div data-view="form">' +
          '<form class="sat-form" novalidate>' +
            '<div class="sat-form__k">// new engagement request</div>' +
            '<h2 class="sat-form__t" id="sat-book-title">Tell us about your brief<span class="accent">.</span></h2>' +
            '<p class="sat-form__sub">This form is fully client-side. On send, your mail client opens with the message pre-filled — no server, no tracking, no storage.</p>' +
            '<div class="sat-form__grid">' +
              '<div><label>NAME *</label><input name="name" required placeholder="Jane Satoshi" /></div>' +
              '<div><label>EMAIL *</label><input name="email" type="email" required placeholder="jane@company.com" /></div>' +
              '<div><label>COMPANY</label><input name="company" placeholder="Acme Co." /></div>' +
              '<div><label>ROLE</label><input name="role" placeholder="CTO / Founder / Security" /></div>' +
              '<div><label>ENGAGEMENT</label>' +
                '<select name="engagement">' +
                  '<option>Discovery</option><option>Delivery</option><option>Retainer</option>' +
                  '<option>Security audit</option><option>Not sure yet</option>' +
                '</select></div>' +
              '<div><label>TIMELINE</label>' +
                '<select name="timeline">' +
                  '<option>This quarter</option><option>Next quarter</option>' +
                  '<option>Within 6 months</option><option>Exploring / no rush</option>' +
                '</select></div>' +
            '</div>' +
            '<div class="sat-form__full">' +
              '<label>BRIEF *</label>' +
              '<textarea name="brief" rows="5" required placeholder="What are you building? Who&rsquo;s the adversary? What&rsquo;s the threat model? Constraints?"></textarea>' +
            '</div>' +
            '<div class="sat-form__note">' +
              '<span class="accent">$</span>' +
              '<span>On send, your mail client opens with this brief addressed to <span class="fg">' + EMAIL + '</span>. Nothing leaves your device until you click Send in your mail app.</span>' +
            '</div>' +
            '<div class="sat-form__actions">' +
              '<button type="button" class="sat-btn" data-action="cancel">--cancel</button>' +
              '<button type="button" class="sat-btn" data-action="copy">--copy-brief<span class="sat-btn__ok" data-slot="copy-ok" hidden>copied</span></button>' +
              '<button type="submit" class="sat-btn sat-btn--primary" data-action="send">./send_via_mail ▸</button>' +
            '</div>' +
          '</form>' +
        '</div>' +
        '<div class="sat-modal__sent" data-view="sent" hidden>' +
          '<div class="ok">[ OK · HANDED OFF TO MAIL CLIENT ]</div>' +
          '<h3>Your brief is on its way<span class="accent">.</span></h3>' +
          '<p>We opened your mail client with a pre-filled message to <span class="accent">' + EMAIL + '</span>. Didn&rsquo;t see it? Copy the brief to clipboard and send it from wherever you prefer.</p>' +
          '<div class="sat-modal__sent-actions">' +
            '<a class="sat-btn sat-btn--primary" data-action="retry" href="#">./retry_mail_client ▸</a>' +
            '<button type="button" class="sat-btn" data-action="copy">--copy-to-clipboard<span class="sat-btn__ok" data-slot="copy-ok" hidden>copied</span></button>' +
            '<button type="button" class="sat-btn" data-action="cancel">--close</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    return modal;
  }

  function wire(modal) {
    var dialog = modal.querySelector('.sat-modal__dialog');
    var form = modal.querySelector('form');
    var sendBtn = modal.querySelector('[data-action="send"]');
    var viewForm = modal.querySelector('[data-view="form"]');
    var viewSent = modal.querySelector('[data-view="sent"]');
    var retryLink = modal.querySelector('[data-action="retry"]');

    function readForm() {
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = String(v).trim(); });
      return data;
    }

    function canSend() {
      var d = readForm();
      return !!(d.name && d.email && d.brief);
    }

    function updateSend() { sendBtn.disabled = !canSend(); }

    function show(view) {
      viewForm.hidden = view !== 'form';
      viewSent.hidden = view !== 'sent';
    }

    function open() {
      show('form');
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      updateSend();
      setTimeout(function () {
        var first = form.querySelector('input[name="name"]');
        if (first) first.focus();
      }, 20);
    }

    function close() {
      modal.hidden = true;
      document.body.style.overflow = '';
    }

    form.addEventListener('input', updateSend);
    function openMailto(mailto) {
      // Use a programmatic anchor click — works in Arc/Brave where
      // window.location.href with a mailto: just opens a blank tab.
      var a = document.createElement('a');
      a.href = mailto;
      a.rel = 'noopener';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!canSend()) return;
      var data = readForm();
      var mailto = buildMailto(data);
      retryLink.href = mailto;
      openMailto(mailto);
      show('sent');
    });

    modal.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action]');
      if (!btn) {
        if (e.target === modal) close();
        return;
      }
      var action = btn.getAttribute('data-action');
      if (action === 'cancel') close();
      if (action === 'copy') {
        var text = buildClipboard(readForm());
        var ok = btn.querySelector('[data-slot="copy-ok"]');
        var done = function () {
          if (!ok) return;
          ok.hidden = false;
          setTimeout(function () { ok.hidden = true; }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, done);
        } else {
          var ta = document.createElement('textarea');
          ta.value = text; ta.style.position = 'fixed'; ta.style.top = '-1000px';
          document.body.appendChild(ta); ta.select();
          try { document.execCommand('copy'); } catch (_) {}
          document.body.removeChild(ta);
          done();
        }
      }
    });

    modal.querySelector('.sat-modal__close').addEventListener('click', close);

    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) close();
    });

    window.openBookCall = open;
    window.addEventListener('satoshi:book-call', open);
  }

  function init() {
    if (document.getElementById('sat-book-modal')) return;
    var modal = renderModal();
    document.body.appendChild(modal);
    wire(modal);

    document.querySelectorAll('[data-sat-book]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        window.openBookCall();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
