require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fetch = require('isomorphic-fetch');

const app = express();
app.use(cors());

app.get('/github', async (request, response) => {
  const querystring = encodeURIComponent(
    `is:open is:pr review-requested:${process.env.GITHUB_USERNAME} archived:false`
  );

  const data = await (
    await fetch(
      `https://api.github.com/search/issues?q=${querystring}&type=pr`,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
        },
      }
    )
  ).json();

  response.status(200).json({
    total_count: data.total_count,
    items: data.items.map(item => ({
      url: item.html_url,
      title: item.title,
      author: {
        image_url: item.user.avatar_url,
        name: item.user.login,
      },
      comments: item.comments,
      created_at: item.created_at,
      updated_at: item.updated_at,
    })),
  });
});

app.get('/shortcut', async (request, response) => {
  const querystring = encodeURIComponent(
    `owner:${process.env.SHORTCUT_USERNAME} !is:done !is:archived`
  );

  const data = await (
    await fetch(
      `https://api.app.shortcut.com/api/v3/search/stories?query=${querystring}`,
      {
        headers: {
          'Shortcut-Token': process.env.SHORTCUT_TOKEN,
        },
      }
    )
  ).json();

  response.status(200).json({
    total_count: data.total,
    items: data.data.map(item => ({
      url: item.app_url,
      title: item.name,
      created_at: item.created_at,
      estimate: item.estimate,
      type: item.story_type,
    })),
  });
});

app.get('/reddit', async (request, response) => {
  const resp = await (
    await fetch(`https://www.reddit.com/r/programmerhumor/hot.json?count=1`)
  ).json();

  const post = resp.data.children[0]?.data ?? {};

  response.status(200).json({
    title: post.title,
    score: post.score,
    image_url: post.url,
  });
});

const PORT = 49666;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
