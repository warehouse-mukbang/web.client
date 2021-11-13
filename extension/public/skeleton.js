const iframe = document.createElement('iframe');
iframe.src = 'http://localhost:3005';
iframe.id = 'page_content';

iframe.addEventListener('load', () => {
  const skeleton = document.getElementById('skeleton');

  skeleton.style = 'opacity: 0; position: absolute;';

  setTimeout(() => {
    skeleton.remove();
  }, 200);
});

document.body.appendChild(iframe);
