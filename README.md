# Nicolas Website

This is my personal website, build with Vue.js, Flowbite and Tailwind CSS.

Check it out at https://nicolasneudeck.com/

## Project Setup

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them. For example:

- [Node.js](https://nodejs.org/en/) (version 18.8.2 or above)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation

A step-by-step series of examples that tell you how to get a development environment running.

First, clone the repository to your local machine:

```bash
git clone git@github.com:heushreck/nicolas-website.git
```

Navigate to the project directory:

```bash
cd nicolas-website
```

Install the project dependencies:

```bash
npm install
```

### Running the Development Server

To run the local development server and start the VitePress app, use:

```bash
npm run docs:dev
```

This command will start a local development server. Open [http://localhost:5173/](http://localhost:5173/) to view it in the browser. The page will reload if you make edits.

### Building for Production

To build the static files for production, run:

```bash
npm run docs:build
```

This command will generate a `docs/.vitepress/dist` directory with all the static files ready for deployment.

### Previewing the Build Locally

After building, you might want to preview the site as it will appear once deployed. To do this, run:

```bash
npm run docs:preview
```

This command serves the static files from the `docs/.vitepress/dist` directory on a local server for you to preview.

## Deployment

To deploy the built site, you can use Firebase. Make sure you have the Firebase CLI installed and configured. Then run:

```bash
firebase deploy
```

This command will deploy your site to Firebase Hosting.

## Images:

image3: https://i.postimg.cc/DyXkCHm0/genai-powered-excel-add-in-03.webp