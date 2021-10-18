const SERVER_URL = 'http://localhost:49666';

async function main() {
  const responses = await Promise.allSettled([
    fetch(SERVER_URL + '/github'),
    fetch(SERVER_URL + '/shortcut'),
  ]);
  
  const data = await Promise.allSettled(
    responses.map(response => response.value.json())
  );

  const promises = data.map(response => response.value);

  const [github, shortcut] = promises;

  generate_github_card(github);
  generate_shortcut_card(shortcut);
}

function generate_github_card(data) {
  document.getElementById('total_open_prs').innerHTML = data.total_count;

  const xml = new XMLHttpRequest();
  xml.open('GET', 'stubs/pull_request.html', false);
  xml.send();

  const stub = xml.responseText;

  const list = document.getElementById('open_prs_list');

  data.items.forEach(pr => {
    const row = document.createElement('li');
    let tempStub = stub;

    tempStub = tempStub.replace('{{TITLE}}', pr.title);
    tempStub = tempStub.replace('{{IMAGE_URL}}', pr.author.image_url);
    tempStub = tempStub.replace('{{AUTHOR}}', pr.author.name);
    tempStub = tempStub.replace('{{COMMENTS}}', pr.comments);
    tempStub = tempStub.replace('{{URL}}', pr.url);
    tempStub = tempStub.replace(
      '{{CREATED_AT}}',
      new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
      }).format(new Date(pr.created_at))
    );

    row.innerHTML = tempStub.trim();
    list.appendChild(row);
  });
}

function generate_shortcut_card(data) {
  document.getElementById('total_assigned_stories').innerHTML =
    data.total_count;

  const xml = new XMLHttpRequest();
  xml.open('GET', 'stubs/stories.html', false);
  xml.send();

  const stub = xml.responseText;

  const list = document.getElementById('shortcut_stories_list');

  data.items.forEach(pr => {
    const row = document.createElement('li');
    let tempStub = stub;

    tempStub = tempStub.replace('{{TITLE}}', pr.title);
    tempStub = tempStub.replace('{{TYPE}}', pr.type);
    tempStub = tempStub.replace('{{ESTIMATE}}', pr.estimate ?? 0);
    tempStub = tempStub.replace('{{URL}}', pr.url);
    tempStub = tempStub.replace(
      '{{CREATED_AT}}',
      new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
      }).format(new Date(pr.created_at))
    );

    row.innerHTML = tempStub.trim();
    list.appendChild(row);
  });
}

main();
