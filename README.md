# NewTab Chrome Extension: Vitals Dashboard

This repo contains the code (front- and back-end) necessary to override the `newtab` page in Chromium browsers.

Currently, the dashboard displays the following data:

- [x] Open Pull Requests assigned to you
- [ ] Upcoming Calendar Events (Outlook)
- [ ] Assigned Shortcut Stories
- [ ] New Relic Health Check
- [ ] Current On-Call
- [ ] BugSnag: Trending Bug (1/3/7 days)
- [ ] Open Intercom Conversations
- [ ] Top Post from `r/programmerhumor`
- [ ] Harness apps awaiting deploy

## Setup

At a glance, these are the things you'll need to do to get the extension running locally:

1. update .env file with valid values
2. run server manually or with Automator app
3. install chrome extension

---

### Environment Variables

To add your own environment variables, run `cp server/.env.example server/.env`. This will create the boilerplate file for you to start adding correct values to.

#### Github Token

To generate your github personal access token, navigate to `settings > developer settings > personal access tokens`, and create a new token with the following permissions:

- notifications
- read:org
- read:repo_hook
- read:user
- repo
- user:email

### Run Server on Login

TODO: Add documentation to start up server with Automator on Mac

### Install Chrome Extension

Note: If you haven't already, run `npm run build` script in the `extension` folder to generate the minified files.

To install the chrome extension, open `chrome://extensions`, then enable `Developer Mode` at the top-right part of the page.

Clicking the `Load Unpacked` button will open up the file explorer. Navigate to this repo on your drive, and select the entire `extension/public` folder.

Once the extension has been loaded, open a new tab. Everything has been set up correctly, you should see the new dashboard, and after a few moments, it will be populated with your personal vitals!

![Installing Chrome Extension](./extension_guide.png)

## Local Testing

To run the vitals dashboard without installing the chrome extension or running the node server on boot, follow the instructions below.

Both the frontend and backend need to be running for the application to work.

### Frontend

1. Navigate to the `extension` folder, and run `npm install`
2. Run `npm start`. runs `live-server` against the public directory, and will open a new browser tab that has hot-reloading enabled.

Note: If you want to update styles, you'll need to open another terminal tab at this same path and run `npm run css:watch`

### Backend

1. Navigate to the `server` folder and run `npm install`
2. Verify that you have a `.env` file, and it has correct values in it (instructions above, if needed)
3. Run `npm start`

## Roadmap

- [ ] allow for dashboard customizations (eg: `GITHUB_ENABLED`, `GITHUB_POSITION` variables)
- [ ] add dark mode
- [ ] host server for mobile version
- [ ] show loading states for cards fetching data
- [ ] show empty states when no data is available