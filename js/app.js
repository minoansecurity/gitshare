(function () {
  'use strict';

  var currentRepo = '';
  var repoData = null;
  var bgType = 'solid';
  var bgImageDataURL = null;
  var brandingDataURL = null; // null = use default

  // DOM refs
  var $ = function (id) { return document.getElementById(id); };
  var repoInput = $('repo-input');
  var generateBtn = $('generate-btn');
  var previewPanel = $('preview-panel');
  var placeholder = $('placeholder');
  var previewScaler = $('preview-scaler');
  var cardWrapper = $('card-wrapper');
  var card = $('card');
  var cardHeader = $('card-header');
  var cardAvatar = $('card-avatar');
  var cardName = $('card-name');
  var cardDesc = $('card-desc');
  var cardStats = $('card-stats');
  var settingsPanel = $('settings-panel');
  var formatSelect = $('format-select');
  var downloadBtn = $('download-btn');
  var dimensionSelect = $('dimension-select');
  var customDimsDiv = $('custom-dims');
  var customW = $('custom-w');
  var customH = $('custom-h');
  var hscaleSlider = $('hscale-slider');
  var hscaleValue = $('hscale-value');
  var radiusSlider = $('radius-slider');
  var radiusValue = $('radius-value');
  var colorBg = $('color-bg');
  var colorCard = $('color-card');
  var colorText = $('color-text');
  var gradColor1 = $('grad-color1');
  var gradColor2 = $('grad-color2');
  var gradAngle = $('grad-angle');
  var gradAngleValue = $('grad-angle-value');
  var gradMidpoint = $('grad-midpoint');
  var gradMidpointValue = $('grad-midpoint-value');
  var bgImageInput = $('bg-image-input');
  var bgImagePreview = $('bg-image-preview');
  var bgImageThumb = $('bg-image-thumb');
  var bgImageRemove = $('bg-image-remove');

  var bgTabs = document.querySelectorAll('.bg-tab');
  var bgOptionPanels = {
    solid: $('bg-solid-options'),
    gradient: $('bg-gradient-options'),
    image: $('bg-image-options')
  };
  var themeBtns = document.querySelectorAll('.theme-btn');

  var toggles = {
    avatar: $('show-avatar'),
    description: $('show-description'),
    stars: $('show-stars'),
    forks: $('show-forks'),
    language: $('show-language'),
    license: $('show-license'),
    issues: $('show-issues'),
    contributors: $('show-contributors')
  };

  var showBranding = $('show-branding');
  var cardBranding = $('card-branding');
  var brandingContent = $('branding-content');
  var brandingFile = $('branding-file');
  var brandingReset = $('branding-reset');

  var DEFAULT_BRANDING_SRC = 'assets/branding-default.png';
  var brandingScale = $('branding-scale');
  var brandingScaleValue = $('branding-scale-value');
  var brandingOpacity = $('branding-opacity');
  var brandingOpacityValue = $('branding-opacity-value');
  var brandingImg = $('branding-img');
  var brandingPos = 'top-right';
  var posBtns = document.querySelectorAll('.pos-btn');

  var langColors = {
    'Go': '#00ADD8', 'Python': '#3572A5', 'JavaScript': '#f1e05a',
    'TypeScript': '#3178c6', 'Rust': '#dea584', 'Java': '#b07219',
    'C': '#555555', 'C++': '#f34b7d', 'C#': '#178600', 'Ruby': '#701516',
    'PHP': '#4F5D95', 'Swift': '#F05138', 'Kotlin': '#A97BFF',
    'Dart': '#00B4AB', 'Shell': '#89e051', 'Lua': '#000080',
    'Zig': '#ec915c', 'Elixir': '#6e4a7e', 'Haskell': '#5e5086',
    'Scala': '#c22d40', 'R': '#198CE7', 'Vue': '#41b883',
    'HTML': '#e34c26', 'CSS': '#563d7c', 'Objective-C': '#438eff',
    'Perl': '#0298c3', 'Clojure': '#db5855', 'Erlang': '#B83998'
  };

  var dims = {
    'x-landscape': [1280, 720], 'fb-landscape': [1080, 566],
    'ig-landscape': [1080, 566], 'li-landscape': [1200, 627],
    'tiktok-landscape': [1920, 1080], 'x-square': [1080, 1080],
    'fb-square': [1080, 1080], 'ig-square': [1080, 1080],
    'li-square': [1200, 1200], 'tiktok-square': [640, 640],
    'x-vertical': [720, 1280], 'fb-vertical': [1080, 1359],
    'ig-vertical': [1080, 1350], 'li-vertical': [720, 900],
    'tiktok-vertical': [1080, 1920], 'ig-stories': [1080, 1920],
    'fb-stories': [1080, 1920], 'tiktok-stories': [1080, 1920]
  };

  // SVG paths for stat icons
  var icons = {
    star: 'M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z',
    fork: 'M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm-1.72 1.71a2.25 2.25 0 1 1 1.44 0v1.29a.75.75 0 0 0 .75.75h2.56a.75.75 0 0 0 .75-.75v-1.29a2.25 2.25 0 1 1 1.44 0v1.29A2.25 2.25 0 0 1 8.03 8.5H6.97v2.54a2.25 2.25 0 1 1-1.44 0V8.5h-.28A2.25 2.25 0 0 1 3 6.25V4.96ZM5 12.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.5-9.5a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z',
    license: 'M8.75.75V2h.985c.304 0 .603.08.867.231l1.29.736c.038.022.08.033.124.033h2.234a.75.75 0 0 1 0 1.5h-.427l2.111 4.692a.75.75 0 0 1-.154.838l-.53-.53.53.53-.001.002-.002.002-.006.006-.006.005-.01.01a.634.634 0 0 1-.033.029 1.78 1.78 0 0 1-.112.085 2.91 2.91 0 0 1-.395.233c-.37.167-.862.33-1.52.33-.657 0-1.15-.163-1.52-.33a2.91 2.91 0 0 1-.506-.318l-.01-.01a.634.634 0 0 1-.006-.005l-.006-.006-.002-.002v-.001l.53-.53-.53.53a.75.75 0 0 1-.154-.838L13.823 4.5h-.427a1.38 1.38 0 0 1-.62-.149l-1.29-.736a.375.375 0 0 0-.174-.046H8.75V13H13a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1 0-1.5h4.25V3.569h-.985a.375.375 0 0 0-.174.046l-1.29.736a1.38 1.38 0 0 1-.62.149h-.427L5.93 9.192a.75.75 0 0 1-.154.838l-.53-.53.53.53v.001l-.002.002-.006.006-.006.005-.01.01a.634.634 0 0 1-.033.029 1.78 1.78 0 0 1-.112.085 2.91 2.91 0 0 1-.395.233c-.37.167-.862.33-1.52.33-.657 0-1.15-.163-1.52-.33a2.91 2.91 0 0 1-.506-.318l-.01-.01a.634.634 0 0 1-.006-.005l-.006-.006-.002-.002-.001-.001.53-.53-.53.53a.75.75 0 0 1-.154-.838L3.677 4.5H3.25a.75.75 0 0 1 0-1.5h2.234c.044 0 .086-.011.124-.033l1.29-.736A1.38 1.38 0 0 1 7.765 2H8.75V.75a.75.75 0 0 1 1.5 0Z',
    issue: 'M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z',
    people: 'M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4.001 4.001 0 0 0-6.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a.75.75 0 1 0 0 1.5 1.5 1.5 0 0 1 .666 2.844.75.75 0 0 0-.416.672v.352a.75.75 0 0 0 .574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 1 0 1.434-.44 5.01 5.01 0 0 0-2.56-3.012A3 3 0 0 0 11 4Z'
  };

  function getDimension() {
    if (dimensionSelect.value === 'custom') {
      var w = Math.max(100, Math.min(4096, parseInt(customW.value) || 1200));
      var h = Math.max(100, Math.min(4096, parseInt(customH.value) || 630));
      return [w, h];
    }
    return dims[dimensionSelect.value] || [1200, 630];
  }

  function parseRepo(input) {
    var v = input.trim();
    if (!v) return '';
    v = v.replace(/^https?:\/\/(www\.)?github\.com\//, '').replace(/\/+$/, '').replace(/\.git$/, '');
    var parts = v.split('/');
    if (parts.length < 2) return v;
    var owner = parts[0].replace(/[^a-zA-Z0-9._-]/g, '');
    var repo = parts[1].replace(/[^a-zA-Z0-9._-]/g, '');
    return owner && repo ? owner + '/' + repo : '';
  }

  function fmt(n) {
    return n.toLocaleString();
  }

  function getBackgroundCSS() {
    if (bgType === 'gradient') {
      return 'linear-gradient(' + gradAngle.value + 'deg, ' + gradColor1.value + ', ' + gradColor2.value + ' ' + gradMidpoint.value + '%)';
    }
    if (bgType === 'image' && bgImageDataURL) {
      return 'url(' + bgImageDataURL + ')';
    }
    return colorBg.value;
  }

  function switchBgTab(name) {
    bgType = name;
    bgTabs.forEach(function (t) { t.classList.toggle('active', t.dataset.bgtype === name); });
    Object.keys(bgOptionPanels).forEach(function (k) {
      bgOptionPanels[k].style.display = k === name ? '' : 'none';
    });
    renderCard();
  }

  function setTheme(theme) {
    themeBtns.forEach(function (btn) { btn.classList.toggle('active', btn.dataset.theme === theme); });
    var presets = theme === 'dark'
      ? { bg: '#082010', card: '#f0ebe2', text: '#082010' }
      : { bg: '#f0ebe2', card: '#ffffff', text: '#082010' };
    colorBg.value = presets.bg;
    colorCard.value = presets.card;
    colorText.value = presets.text;
    renderCard();
  }

  // Rate limit display
  var rateLimitEl = $('rate-limit');

  var rateLimitTimer = null;

  function updateRateLimit(response) {
    var remaining = response.headers.get('X-RateLimit-Remaining');
    var limit = response.headers.get('X-RateLimit-Limit');
    var reset = response.headers.get('X-RateLimit-Reset');
    if (remaining === null) return;
    remaining = parseInt(remaining);
    limit = parseInt(limit);
    var resetAt = reset ? parseInt(reset) * 1000 : 0;
    var isWarn = remaining <= 10;

    if (rateLimitTimer) clearInterval(rateLimitTimer);

    function render() {
      var mins = resetAt ? Math.max(0, Math.ceil((resetAt - Date.now()) / 60000)) : 0;
      var resetText = mins > 0 ? ' · resets in ' + mins + 'min' : '';
      rateLimitEl.textContent = remaining + '/' + limit + ' requests remaining' + resetText + ' · GitHub limits your browser to ' + limit + '/hr';
      rateLimitEl.style.display = 'block';
      rateLimitEl.classList.toggle('warn', isWarn);
      if (mins <= 0 && rateLimitTimer) { clearInterval(rateLimitTimer); rateLimitTimer = null; }
    }

    render();
    if (resetAt) rateLimitTimer = setInterval(render, 60000);
  }

  function fetchContributors(repo) {
    fetch('https://api.github.com/repos/' + repo + '/contributors?per_page=1&anon=true', {
      headers: { 'Accept': 'application/vnd.github.v3+json' },
      cache: 'no-store',
      referrerPolicy: 'no-referrer'
    })
    .then(function (r) {
      updateRateLimit(r);
      if (!r.ok) return;
      var link = r.headers.get('Link') || '';
      var m = link.match(/page=(\d+)>;\s*rel="last"/);
      var count = m ? parseInt(m[1]) : 1;
      repoData.contributors = isFinite(count) && count > 0 ? count : 1;
      renderCard();
    })
    .catch(function () {});
  }

  // Fetch repo data
  function fetchRepoData(repo) {
    placeholder.textContent = 'Loading...';
    placeholder.style.display = '';
    previewScaler.style.display = 'none';

    if (!/^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/.test(repo)) {
      placeholder.textContent = 'Invalid repository format.';
      generateBtn.disabled = false;
      generateBtn.textContent = 'Generate';
      return;
    }

    fetch('https://api.github.com/repos/' + repo, {
      headers: { 'Accept': 'application/vnd.github.v3+json' },
      cache: 'no-store',
      referrerPolicy: 'no-referrer'
    })
    .then(function (r) {
      updateRateLimit(r);
      if (r.status === 404) throw new Error('Repository not found. GitShare.ch works with public GitHub repos only.');
      if (r.status === 403) {
        var reset = r.headers.get('X-RateLimit-Reset');
        var mins = reset ? Math.max(1, Math.ceil((parseInt(reset) * 1000 - Date.now()) / 60000)) : '?';
        throw new Error('GitHub API rate limit reached. Try again in ' + mins + ' minute' + (mins !== 1 ? 's' : '') + '.');
      }
      if (!r.ok) throw new Error('GitHub API error (status ' + r.status + ')');
      return r.json();
    })
    .then(function (d) {
      if (!d || typeof d !== 'object' || Array.isArray(d)) throw new Error('Unexpected API response');
      function str(v, maxLen) {
        var s = typeof v === 'string' ? v : '';
        return s.slice(0, maxLen || 200).replace(/[<>"'&]/g, '');
      }
      function num(v) { return typeof v === 'number' && isFinite(v) ? Math.max(0, Math.floor(v)) : 0; }
      function avatarUrl(v) {
        if (typeof v !== 'string') return '';
        try { var u = new URL(v); return u.origin === 'https://avatars.githubusercontent.com' ? u.href : ''; }
        catch (e) { return ''; }
      }

      repoData = {
        fullName: str(d.full_name, 100),
        stars: num(d.stargazers_count),
        forks: num(d.forks_count),
        language: str(d.language, 40),
        license: str(d.license ? d.license.spdx_id : '', 30),
        description: str(d.description, 300),
        avatarURL: avatarUrl(d.owner ? d.owner.avatar_url : ''),
        issues: num(d.open_issues_count),
        contributors: null
      };

      // Convert avatar to data URL so html2canvas never needs cross-origin fetch
      if (repoData.avatarURL) {
        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function () {
          var c = document.createElement('canvas');
          c.width = img.naturalWidth;
          c.height = img.naturalHeight;
          c.getContext('2d').drawImage(img, 0, 0);
          try { repoData.avatarURL = c.toDataURL('image/png'); } catch (e) { /* keep original URL */ }
          renderCard();
        };
        img.onerror = function () { renderCard(); };
        img.src = repoData.avatarURL;
      } else {
        renderCard();
      }

      if (toggles.contributors.checked) fetchContributors(repo);
    })
    .catch(function (err) {
      placeholder.textContent = err.message;
    })
    .finally(function () {
      generateBtn.disabled = false;
      generateBtn.textContent = 'Generate';
    });
  }

  // Build a stat element
  function makeStat(svgPath, text, color, svgSz, iconGap) {
    var el = document.createElement('div');
    el.className = 'stat';
    el.style.gap = iconGap + 'px';
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.style.cssText = 'width:' + svgSz + 'px;height:' + svgSz + 'px;fill:' + color + ';flex-shrink:0';
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', svgPath);
    svg.appendChild(path);
    var span = document.createElement('span');
    span.textContent = text;
    el.appendChild(svg);
    el.appendChild(span);
    return el;
  }

  // Render live DOM card
  function renderCard() {
    if (!repoData) return;

    var dim = getDimension();
    var scale = parseInt(hscaleSlider.value) / 100;
    var W = dim[0], H = dim[1];
    var cardBg = colorCard.value;
    var txtColor = colorText.value;

    // Derive border from card brightness
    var r = parseInt(cardBg.slice(1, 3), 16);
    var g = parseInt(cardBg.slice(3, 5), 16);
    var b = parseInt(cardBg.slice(5, 7), 16);
    var border = (r + g + b) / 3 < 128 ? '#30363d' : '#d0d7de';

    // Card width adapts to canvas proportions
    var baseW;
    if (W >= H) { baseW = Math.round(W * 0.55); }
    else if (W === H) { baseW = Math.round(W * 0.70); }
    else { baseW = Math.round(W * 0.80); }
    var maxH = Math.round(H * 0.75);
    if (baseW * 0.6 > maxH) baseW = Math.round(maxH / 0.6);
    if (baseW < 280) baseW = 280;

    var fontBase = baseW / 680;
    var s = scale * fontBase;
    var cw = Math.round(baseW * scale);
    var pad = Math.round(40 * s);
    var avatarSz = Math.round(56 * s);
    var nameSz = Math.round(24 * s);
    var statSz = Math.round(16 * s);
    var dotSz = Math.round(14 * s);
    var svgSz = Math.round(18 * s);
    var gap = Math.round(20 * s);
    var statGap = Math.round(28 * s);
    var iconGap = Math.round(8 * s);

    // Wrapper = exact output resolution
    cardWrapper.style.width = W + 'px';
    cardWrapper.style.height = H + 'px';
    var bgCSS = getBackgroundCSS();
    cardWrapper.style.background = bgCSS;
    cardWrapper.style.backgroundSize = (bgType === 'image' && bgImageDataURL) ? 'cover' : '';
    cardWrapper.style.backgroundPosition = (bgType === 'image' && bgImageDataURL) ? 'center' : '';

    // Card
    card.style.width = cw + 'px';
    card.style.padding = pad + 'px';
    card.style.background = cardBg;
    card.style.border = '1px solid ' + border;
    card.style.color = txtColor;
    card.style.borderRadius = Math.round(parseInt(radiusSlider.value) * s) + 'px';

    // Header
    cardHeader.style.gap = Math.round(10 * s) + 'px';
    cardHeader.style.marginBottom = gap + 'px';

    // Avatar
    if (toggles.avatar.checked && repoData.avatarURL) {
      cardAvatar.src = repoData.avatarURL;
      cardAvatar.style.display = '';
      cardAvatar.style.width = avatarSz + 'px';
      cardAvatar.style.height = avatarSz + 'px';
    } else {
      cardAvatar.style.display = 'none';
    }

    // Name
    cardName.textContent = repoData.fullName;
    cardName.style.fontSize = nameSz + 'px';
    cardName.style.color = txtColor;

    // Description
    if (toggles.description.checked && repoData.description) {
      cardDesc.textContent = repoData.description;
      cardDesc.style.display = '';
      cardDesc.style.fontSize = Math.round(16 * s) + 'px';
      cardDesc.style.color = txtColor;
      cardDesc.style.margin = '0 0 ' + gap + 'px 0';
      cardDesc.style.opacity = '0.8';
      cardDesc.style.lineHeight = '1.4';
      cardDesc.style.letterSpacing = '0.1px';
      cardDesc.style.wordWrap = 'break-word';
    } else {
      cardDesc.style.display = 'none';
      cardDesc.textContent = '';
    }

    // Stats
    cardStats.innerHTML = '';
    cardStats.style.gap = statGap + 'px';
    cardStats.style.fontSize = statSz + 'px';
    cardStats.style.color = txtColor;

    if (toggles.language.checked && repoData.language) {
      var ls = document.createElement('div');
      ls.className = 'stat';
      ls.style.gap = iconGap + 'px';
      var dotColor = langColors[repoData.language] || '#6a6d71';
      var dot = document.createElement('span');
      dot.style.cssText = 'width:' + dotSz + 'px;height:' + dotSz + 'px;background:' + dotColor + ';border-radius:50%;display:inline-block;flex-shrink:0';
      var langSpan = document.createElement('span');
      langSpan.textContent = repoData.language;
      ls.appendChild(dot);
      ls.appendChild(langSpan);
      cardStats.appendChild(ls);
    }
    function pl(n, word) { return fmt(n) + ' ' + word + (n === 1 ? '' : 's'); }
    if (toggles.stars.checked) cardStats.appendChild(makeStat(icons.star, pl(repoData.stars, 'star'), txtColor, svgSz, iconGap));
    if (toggles.forks.checked) cardStats.appendChild(makeStat(icons.fork, pl(repoData.forks, 'fork'), txtColor, svgSz, iconGap));
    if (toggles.license.checked && repoData.license) cardStats.appendChild(makeStat(icons.license, repoData.license, txtColor, svgSz, iconGap));
    if (toggles.issues.checked && repoData.issues > 0) cardStats.appendChild(makeStat(icons.issue, pl(repoData.issues, 'issue'), txtColor, svgSz, iconGap));
    if (toggles.contributors.checked && repoData.contributors) cardStats.appendChild(makeStat(icons.people, pl(repoData.contributors, 'contributor'), txtColor, svgSz, iconGap));

    // Branding — corner overlay
    if (showBranding.checked) {
      var bScale = parseInt(brandingScale.value) / 100;
      var bH = Math.round(W * bScale);
      var bPad = Math.round(W * 0.03);
      var bOp = parseInt(brandingOpacity.value) / 100;

      cardBranding.style.display = '';
      cardBranding.style.top = brandingPos.indexOf('top') >= 0 ? bPad + 'px' : 'auto';
      cardBranding.style.bottom = brandingPos.indexOf('bottom') >= 0 ? bPad + 'px' : 'auto';
      cardBranding.style.left = brandingPos.indexOf('left') >= 0 ? bPad + 'px' : 'auto';
      cardBranding.style.right = brandingPos.indexOf('right') >= 0 ? bPad + 'px' : 'auto';

      brandingImg.src = brandingDataURL || DEFAULT_BRANDING_SRC;
      brandingImg.style.height = bH + 'px';
      brandingImg.style.opacity = bOp;
    } else {
      cardBranding.style.display = 'none';
    }

    placeholder.style.display = 'none';
    previewScaler.style.display = 'flex';
    downloadBtn.disabled = false;
    fitWrapperToPanel(W, H);
  }

  function fitWrapperToPanel(W, H) {
    var rect = previewPanel.getBoundingClientRect();
    var s = Math.min((rect.width - 40) / W, (rect.height - 40) / H, 1);
    cardWrapper.style.transform = 'scale(' + s.toFixed(4) + ')';
    cardWrapper.style.transformOrigin = 'center center';
  }

  // Download via html2canvas
  var dlBtnHTML = downloadBtn.innerHTML;

  function doDownload() {
    if (!repoData) return;
    var dim = getDimension();
    var fmt = formatSelect.value;
    var basename = currentRepo.replace('/', '-').replace(/[<>:"/\\|?*\x00-\x1f]/g, '');
    var mimeTypes = { png: 'image/png', jpeg: 'image/jpeg', webp: 'image/webp' };
    var extensions = { png: '.png', jpeg: '.jpg', webp: '.webp' };
    var mime = mimeTypes[fmt] || 'image/png';
    var ext = extensions[fmt] || '.png';
    var filename = basename + ext;

    downloadBtn.classList.add('busy');
    downloadBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2.75 14A1.75 1.75 0 0 1 1 12.25v-2.5a.75.75 0 0 1 1.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 1.5 0v2.5A1.75 1.75 0 0 1 13.25 14Zm-0-.002H2.75h10.5ZM7.25 7.689V2a.75.75 0 0 1 1.5 0v5.689l1.97-1.969a.749.749 0 1 1 1.06 1.06l-3.25 3.25a.749.749 0 0 1-1.06 0L4.22 6.78a.749.749 0 1 1 1.06-1.06l1.97 1.969Z"/></svg> Generating...';

    var prevTransform = cardWrapper.style.transform;
    cardWrapper.style.transform = 'none';

    var timeout = setTimeout(function () {
      cardWrapper.style.transform = prevTransform;
      downloadBtn.classList.remove('busy');
      downloadBtn.innerHTML = dlBtnHTML;
      alert('Download timed out. Your browser may be blocking cross-origin images. Try disabling content blockers or use Chrome.');
    }, 5000);

    html2canvas(cardWrapper, {
      width: dim[0], height: dim[1], scale: 2,
      useCORS: true, allowTaint: false, backgroundColor: null, logging: false
    }).then(function (canvas) {
      return new Promise(function (resolve, reject) {
        canvas.toBlob(function (blob) {
          if (!blob) { reject(new Error('Failed to create image')); return; }
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
          setTimeout(function () { starModal.style.display = ''; }, 300);
          resolve();
        }, mime, 0.95);
      });
    }).catch(function (err) {
      alert('Download failed: ' + err.message);
    }).finally(function () {
      clearTimeout(timeout);
      cardWrapper.style.transform = prevTransform;
      downloadBtn.classList.remove('busy');
      downloadBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/></svg> Downloaded!';
      setTimeout(function () { downloadBtn.innerHTML = dlBtnHTML; }, 2500);
    });
  }

  // Slider helper
  function bindSlider(slider, display, suffix, cb) {
    slider.addEventListener('input', function () {
      display.textContent = slider.value + (suffix || '');
      if (cb) cb();
      renderCard();
    });
  }

  // ---- Support modal (on every download) ----
  var starModal = $('star-modal');
  $('star-modal-close').addEventListener('click', function () { starModal.style.display = 'none'; });
  $('star-modal-dismiss').addEventListener('click', function () { starModal.style.display = 'none'; });
  starModal.addEventListener('click', function (e) { if (e.target === starModal) starModal.style.display = 'none'; });

  // ---- Wire events ----

  // Generate
  generateBtn.addEventListener('click', function () {
    currentRepo = parseRepo(repoInput.value);
    if (!currentRepo) {
      placeholder.textContent = 'Enter a GitHub URL or owner/repo (e.g. apple/container)';
      placeholder.style.display = '';
      previewScaler.style.display = 'none';
      return;
    }
    generateBtn.disabled = true;
    generateBtn.textContent = 'Loading...';
    fetchRepoData(currentRepo);
  });

  repoInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') generateBtn.click();
  });

  // Color pickers
  [colorBg, colorCard, colorText, gradColor1, gradColor2].forEach(function (el) {
    el.addEventListener('input', renderCard);
  });

  // Sliders
  bindSlider(gradAngle, gradAngleValue, '\u00B0');
  bindSlider(gradMidpoint, gradMidpointValue, '%');
  bindSlider(hscaleSlider, hscaleValue, '%');
  bindSlider(radiusSlider, radiusValue, '');

  // Background tabs
  bgTabs.forEach(function (tab) {
    tab.addEventListener('click', function () { switchBgTab(tab.dataset.bgtype); });
  });

  // Theme
  themeBtns.forEach(function (btn) {
    btn.addEventListener('click', function () { setTheme(btn.dataset.theme); });
  });

  // Image upload — validate type and size
  var MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
  // Allowed raster image types only — no SVG (can contain scripts)
  var SAFE_MIME = /^image\/(png|jpeg|gif|webp|bmp)$/;
  var SAFE_EXT = /\.(png|jpe?g|gif|webp|bmp)$/i;
  var SAFE_DATA_PREFIX = /^data:image\/(png|jpeg|gif|webp|bmp);base64,/;

  bgImageInput.addEventListener('change', function () {
    var file = bgImageInput.files[0];
    if (!file) return;
    if (!SAFE_MIME.test(file.type) || !SAFE_EXT.test(file.name)) {
      alert('Only raster images allowed (PNG, JPEG, GIF, WebP, BMP). SVG is not supported.');
      bgImageInput.value = '';
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      alert('Image too large (max 10MB).');
      bgImageInput.value = '';
      return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
      var result = e.target.result;
      if (typeof result !== 'string' || !SAFE_DATA_PREFIX.test(result)) {
        alert('Invalid image data.');
        bgImageInput.value = '';
        return;
      }
      bgImageDataURL = result;
      bgImageThumb.src = bgImageDataURL;
      bgImagePreview.style.display = '';
      renderCard();
    };
    reader.readAsDataURL(file);
  });

  bgImageRemove.addEventListener('click', function () {
    bgImageDataURL = null;
    bgImageInput.value = '';
    bgImagePreview.style.display = 'none';
    renderCard();
  });

  // Branding
  showBranding.addEventListener('change', renderCard);
  brandingFile.addEventListener('change', function () {
    var file = brandingFile.files[0];
    if (!file) return;
    if (!SAFE_MIME.test(file.type) || !SAFE_EXT.test(file.name)) {
      alert('Only raster images allowed (PNG, JPEG, GIF, WebP, BMP).');
      brandingFile.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Logo too large (max 2MB).');
      brandingFile.value = '';
      return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
      var result = e.target.result;
      if (typeof result !== 'string' || !SAFE_DATA_PREFIX.test(result)) {
        alert('Invalid image data.');
        brandingFile.value = '';
        return;
      }
      brandingDataURL = result;
      renderCard();
    };
    reader.readAsDataURL(file);
  });
  brandingReset.addEventListener('click', function () {
    brandingDataURL = null;
    brandingFile.value = '';
    showBranding.checked = false;
    renderCard();
  });
  brandingScale.addEventListener('input', function () {
    brandingScaleValue.textContent = brandingScale.value;
    renderCard();
  });
  brandingOpacity.addEventListener('input', function () {
    brandingOpacityValue.textContent = brandingOpacity.value + '%';
    renderCard();
  });
  posBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      brandingPos = btn.dataset.pos;
      posBtns.forEach(function (b) { b.classList.toggle('active', b === btn); });
      renderCard();
    });
  });

  // Dimension / format
  dimensionSelect.addEventListener('change', function () {
    customDimsDiv.style.display = dimensionSelect.value === 'custom' ? '' : 'none';
    renderCard();
  });
  customW.addEventListener('change', renderCard);
  customH.addEventListener('change', renderCard);
  formatSelect.addEventListener('change', renderCard);

  // Element toggles
  Object.keys(toggles).forEach(function (k) {
    toggles[k].addEventListener('change', function () {
      if (k === 'contributors' && toggles.contributors.checked && repoData && repoData.contributors === null) {
        fetchContributors(currentRepo);
      }
      renderCard();
    });
  });

  // Download
  downloadBtn.addEventListener('click', doDownload);

  // Resize
  window.addEventListener('resize', function () {
    if (repoData) {
      var dim = getDimension();
      fitWrapperToPanel(dim[0], dim[1]);
    }
  });

  // Auto-generate on load — use placeholder value, then clear input
  if (!repoInput.value.trim() && repoInput.placeholder) {
    currentRepo = parseRepo(repoInput.placeholder);
    if (currentRepo) {
      generateBtn.disabled = true;
      generateBtn.textContent = 'Loading...';
      fetchRepoData(currentRepo);
    }
  } else if (repoInput.value.trim()) {
    generateBtn.click();
  }
  // After initial auto-generate, next clicks are manual
})();
