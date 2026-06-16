(function () {
  var root = document.documentElement;
  var zoomStory = document.querySelector('.zoom-story');
  var likesPanel = document.querySelector('.likes-panel');
  var navLinks = document.querySelectorAll('[data-section-link]');
  var sectionIds = ['name-tag', 'route', 'rush', 'likes', 'dislikes', 'next-stop'];
  var ticking = false;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function smoothstep(edge0, edge1, value) {
    var x = clamp((value - edge0) / (edge1 - edge0), 0, 1);
    return x * x * (3 - 2 * x);
  }

  function sectionProgress(element) {
    if (!element) {
      return 0;
    }

    var rect = element.getBoundingClientRect();
    var scrollableDistance = Math.max(1, rect.height - window.innerHeight);
    return clamp((0 - rect.top) / scrollableDistance, 0, 1);
  }

  function setRootVariable(name, value) {
    root.style.setProperty(name, value);
  }

  function setActiveLink(sectionId) {
    for (var i = 0; i < navLinks.length; i += 1) {
      var link = navLinks[i];
      if (link.getAttribute('data-section-link') === sectionId) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    }
  }

  function getActiveSection(zoomProgress) {
    var middle = window.innerHeight * 0.45;
    var bestId = zoomProgress < 0.52 ? 'name-tag' : 'route';
    var bestDistance = Infinity;

    for (var i = 2; i < sectionIds.length; i += 1) {
      var section = document.getElementById(sectionIds[i]);

      if (!section) {
        continue;
      }

      var rect = section.getBoundingClientRect();
      var distance = Math.abs(rect.top - middle);

      if (rect.top <= middle && rect.bottom >= middle) {
        return sectionIds[i];
      }

      if (distance < bestDistance) {
        bestDistance = distance;
        bestId = sectionIds[i];
      }
    }

    if (zoomStory) {
      var zoomRect = zoomStory.getBoundingClientRect();
      if (zoomRect.top <= middle && zoomRect.bottom >= middle) {
        return zoomProgress < 0.52 ? 'name-tag' : 'route';
      }
    }

    return bestId;
  }

  function update() {
    var zoomProgress = sectionProgress(zoomStory);
    var revealProgress = smoothstep(0.05, 0.72, zoomProgress);
    var routeProgress = smoothstep(0.48, 0.82, zoomProgress);
    var tagScale = 1 - (revealProgress * 0.82);
    var tagX = revealProgress * -7;
    var tagY = revealProgress * 21;
    var personOpacity = smoothstep(0.12, 0.62, zoomProgress);
    var personLift = (1 - personOpacity) * 42;
    var likesProgress = sectionProgress(likesPanel);
    var shockOpacity = 1 - smoothstep(0.08, 0.34, likesProgress);
    var floorOpacity = smoothstep(0.18, 0.44, likesProgress);

    setRootVariable('--tag-scale', tagScale.toFixed(3));
    setRootVariable('--tag-x', tagX.toFixed(3) + 'vw');
    setRootVariable('--tag-y', tagY.toFixed(3) + 'vh');
    setRootVariable('--person-opacity', personOpacity.toFixed(3));
    setRootVariable('--person-lift', personLift.toFixed(3) + 'px');
    setRootVariable('--route-opacity', routeProgress.toFixed(3));
    setRootVariable('--shock-opacity', shockOpacity.toFixed(3));
    setRootVariable('--floor-opacity', floorOpacity.toFixed(3));
    setActiveLink(getActiveSection(zoomProgress));

    ticking = false;
  }

  function requestUpdate() {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(update);
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  update();
}());
