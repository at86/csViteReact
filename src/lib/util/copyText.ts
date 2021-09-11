function copyText(text: string | number, container: HTMLElement = document.body) {
  return new Promise((resolve, reject) => {
    const input = document.createElement('textarea');

    input.setAttribute('readonly', 'readonly');

    container.appendChild(input);

    input.value = `${text}`;

    input.focus();

    input.select();

    const result = document.execCommand('copy');

    container.removeChild(input);

    return result ? resolve(text) : reject();
  });
}

export default copyText;
