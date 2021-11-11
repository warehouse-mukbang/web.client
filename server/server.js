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
    media_url: !post.is_video ? post.url : post.media.reddit_video.fallback_url,
    is_video: post.is_video,
  });
});

app.get('/pagerduty', async (request, response) => {
  const today_start = new Date();
  const today_end = new Date();
  const start_date = new Date(today_start.setDate(today_start.getDate() - 14));
  const end_date = new Date(today_end.setDate(today_end.getDate() + 14));

  const resp = await (
    await fetch(
      `https://api.pagerduty.com/schedules/${process.env.PAGERDUTY_SCHEDULE}?time_zone=UTC&since=${start_date}&until=${end_date}`,
      {
        headers: {
          Authorization: `Token token=${process.env.PAGERDUTY_TOKEN}`,
        },
      }
    )
  ).json();

  const scheduled_users =
    resp.schedule.final_schedule.rendered_schedule_entries;

  const current = scheduled_users.findIndex(
    user =>
      new Date(user.start) <= new Date() && new Date(user.end) >= new Date()
  );

  response.status(200).json({
    current: scheduled_users[current],
    next: scheduled_users[current + 1],
  });
});

app.get('/bugsnag', async (request, response) => {
  const bugs = await (
    await fetch(
      `https://api.bugsnag.com/projects/${process.env.BUGSNAG_PROJECT_ID}/errors?filters[error.status]=new&filters[event.since]=1d&filters[app.release_stage]=production&sort=events`,
      {
        headers: {
          Authorization: `token ${process.env.BUGSNAG_TOKEN}`,
        },
      }
    )
  ).json();

  response.status(200).json({
    bugs: bugs.map(bug => ({
      message: bug.message,
      events: bug.events,
      class: bug.error_class,
      severity: bug.severity,
      path: bug.context,
      url: `https://app.bugsnag.com/${process.env.BUGSNAG_ORGANIZATION_NAME}/${process.env.BUGSNAG_PROJECT_NAME}/errors/${bug.id}`,
    })),
  });
});

const PORT = 49666;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
