function isInViewPort(el: HTMLElement | null) {
  if (!el) {
    return false;
  }

  const viewPortWidth =
    window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

  const viewPortHeight =
    window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

  const rect = el.getBoundingClientRect();

  if (rect) {
    const { top, bottom, left, right } = rect;

    return bottom > 0 && top <= viewPortHeight && left <= viewPortWidth && right > 0;
  }

  return false;
}

export default isInViewPort;
