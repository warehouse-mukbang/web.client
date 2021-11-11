const SERVER_URL = 'http://localhost:49666';

async function main() {
  const responses = await Promise.allSettled([
    fetch(SERVER_URL + '/github'),
    fetch(SERVER_URL + '/shortcut'),
    fetch(SERVER_URL + '/reddit'),
    fetch(SERVER_URL + '/pagerduty'),
    fetch(SERVER_URL + '/bugsnag'),
  ]);

  const data = await Promise.allSettled(
    responses.map(response => response.value.json())
  );

  const promises = data.map(response => response.value);

  const [github, shortcut, reddit, pagerduty, bugsnag] = promises;

  generate_github_card(github);
  generate_shortcut_card(shortcut);
  generate_reddit_card(reddit);
  generate_pagerduty_card(pagerduty);
  generate_bugsnag_card(bugsnag);
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

function generate_reddit_card(data) {
  const xml = new XMLHttpRequest();
  xml.open('GET', 'stubs/reddit.html', false);
  xml.send();

  let stub = xml.responseText;

  const container = document.getElementById('reddit_top_post_container');

  stub = stub.replace('{{TITLE}}', data.title);

  if (!data.is_video) {
    stub = stub.replace('{{IMAGE_URL}}', data.media_url);
  } else {
    stub = stub.replace('{{VIDEO_URL}}', data.media_url);
  }

  container.innerHTML = stub;
  document
    .getElementById(data.is_video ? 'reddit-image' : 'reddit-video')
    .remove();
}

function generate_pagerduty_card(data) {
  const xml = new XMLHttpRequest();
  xml.open('GET', 'stubs/pagerduty.html', false);
  xml.send();

  let current_stub = xml.responseText;
  let next_stub = xml.responseText;

  const current_container = document.getElementById('pagerduty_oncall_current');
  const next_container = document.getElementById('pagerduty_oncall_next');

  current_stub = current_stub.replace('{{NAME}}', data.current.user.summary);
  next_stub = next_stub.replace('{{NAME}}', data.next.user.summary);

  current_stub = current_stub.replace(
    '{{END_DATE}}',
    new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
    }).format(new Date(data.current.end))
  );
  next_stub = next_stub.replace(
    '{{END_DATE}}',
    new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
    }).format(new Date(data.next.end))
  );

  current_container.innerHTML = current_stub;
  next_container.innerHTML = next_stub;
}

function generate_bugsnag_card(data) {
  document.getElementById('bugsnag_introduced_today').innerHTML =
    data.bugs.length;

  const xml = new XMLHttpRequest();
  xml.open('GET', 'stubs/bugsnag.html', false);
  xml.send();

  const stub = xml.responseText;

  const list = document.getElementById('bugsnag_introduced_list');

  data.bugs.forEach(bug => {
    const row = document.createElement('li');
    row.classList.add('max-w-full');
    let tempStub = stub;

    tempStub = tempStub.replace('{{URL}}', bug.url);
    tempStub = tempStub.replace('{{CLASS}}', bug.class);
    tempStub = tempStub.replace('{{MESSAGE}}', bug.message);
    tempStub = tempStub.replace('{{PATH}}', bug.path);
    tempStub = tempStub.replace('{{EVENTS}}', bug.events);

    row.innerHTML = tempStub.trim();
    list.appendChild(row);
  });
}

main();
