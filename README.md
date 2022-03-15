# Inlive Website
inlive static site for blog and documentation

## Setup
This is static site generated using Hugo. To run this locally, you can do these steps:
1. [Install Hugo](https://gohugo.io/getting-started/installing/).
2. Ensure the hugo is installed properly by using `hugo version` command.
3. Install all dependencies using `npm install`.
4. Run `hugo server --gc` to run hugo server and enable auto reload when the code changes. Preferably using `--gc` flag for every time you run the development server to clean unused cache files. The server is available on http://localhost:1313
5. You can test the deployment by calling `hugo` (preferably using `--gc` and `--minify` flags) and it will generate all static files needed under `public` directory. The `public` directory contains all files that we will use to deploy the website.


## Adjusting Layout
We're using custom `inlive` Hugo theme. The theme is avaiable in `/themes/inlive` directory. Read more about [Hugo templating](https://gohugo.io/templates/) to modified the looks and layout.

## Creating a New Content
All content is inside the `content` folder stored in the Markdown file. By default, everything inside the `content` folder will become a page's route automatically. Currently, we have 2 sections of content, `blog` and `docs`. To know more about `content` folder, you can see [Hugo content management guideline](https://gohugo.io/content-management/).

### Create a content manually
You can create a content manually by creating regular markdown `.md` file inside the `content` folder. This is the simplest way of creating a content in Hugo. After the content is created you may want to add the front matter and markdown syntax inside it.

### Create a content using Hugo command
We can create a new content using a Hugo `new` command. The `new` command will create a content inside the `content` folder. Please refer to [this page](https://gohugo.io/commands/hugo_new/) about the `new` command.

### Create a new documentation content
This is a step by step for creating a new documentation content inside the `docs` folder.

1. Create a content using Hugo command. We encourage you to use this approach because we already have default front matter setup using [Hugo archetypes](https://gohugo.io/content-management/archetypes/).

    ```
    hugo new docs/getting-started/index.md
    ```
    We encourage you to create a directory-based content to make it easier to maintain. Every content has its own directory and the actual content is inside `index.md` file. This will create a `/docs/getting-started/` route and will use a `single.html` layout from `layout/docs`.

    You may notice there is a `_index.md` file inside our project (except in the root content directory). This is a content section which will generate a page based on `list.html` inside `layouts/docs`. This will create a page that lists all documentation content inside its directory. This is useful when we want to group some contents together. To know more about content section please refer to the documentation about [content sections](https://gohugo.io/content-management/sections/).

    Currently, we only support until two level directories content started from docs directory. So, please refrain to create a content that has more than two level directories. For example: (docs/tutorial/livestream/webrtc/index.md).

2. After the content is created, this will generate a front matter with the default configuration that is already defined on `themes/inlive/archetypes/docs.md`. There are already pre-defined values but you need to change it yourself to adjust with the actual content. The most important thing is to set the weight value inside the front matter. The weight value will determine the order of the page and the order of the menu in the sidebar. Please read the README provided inside `themes/inlive/archetypes` folder to understand more.

3. The last step is to ensure if the page is properly configured. You may check if the page link is already visible inside the sidebar menu on the left side, if the order of the page (when accessing from next and previous link) is the same as the order of the sidebar menu, and ensure if the page is actually a level 1 page (parent page) or a level 2 page (child page).