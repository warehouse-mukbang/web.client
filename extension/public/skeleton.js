const iframe = document.createElement('iframe');
iframe.src = 'http://localhost:49666';
iframe.id = 'page_content';

iframe.addEventListener('load', () => {
  const skeleton = document.getElementById('skeleton');

  skeleton.style = 'opacity: 0;';

  setTimeout(() => {
    skeleton.remove();
  }, 400);
});

document.body.appendChild(iframe);
