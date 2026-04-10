export const loadSvgSprite = (svgContent) => {
    const text = svgContent.replace(/fill="white"/g, 'fill="currentColor"');
    const container = document.createElement('div');
    container.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;';
    container.setAttribute('aria-hidden', 'true');
    container.innerHTML = text;
    document.body.insertAdjacentElement('afterbegin', container);
};
