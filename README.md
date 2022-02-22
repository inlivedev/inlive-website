# Inlive Website
inlive static site for blog and documentation

## Setup
This is static site generated using Hugo. To run this locally, you can do these steps:
1. [Install Hugo](https://gohugo.io/getting-started/installing/).
2. Ensure the hugo is installed properly by using `hugo version` command.
3. Install all dependencies using `npm install`.
4. Run `npm run dev` to run tailwind in watch mode along with the hugo webserver which will enable auto reload when the code changes. The server is available on http://localhost:1313.
5. Run `npm run build` and it will generate all static files needed under `public` directory. The `public` directory contains all files that we will use to deploy the website.


## Adjusting Layout
We're using custom `inlive` Hugo theme. The theme is avaiable in `/themes/inlive` directory. Read more about [Hugo templating](https://gohugo.io/templates/) to modified the looks and layout.

## Adding Content
To add content, follow the [Hugo content management guideline](https://gohugo.io/content-management/). We have 2 sections of content, `blog` and `docs` follow to [guideline](https://gohugo.io/content-management/organization/) to add the specific content.
