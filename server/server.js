require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fetch = require('isomorphic-fetch');

const app = express();
app.use(cors());

app.get('/github', async (request, response) => {
  const querystring = encodeURIComponent(
    `is:closed is:pr review-requested:${process.env.GITHUB_USERNAME} archived:false`
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

const PORT = 49666;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
