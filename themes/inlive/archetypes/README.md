## Docs Archetype

- date: The date associated with the page (By default is using current date with YYYY-MM-DD format)

- lastmod: The last modified date of the content (By default is using current date with YYYY-MM-DD format)

- name: Name of the page. This will be used in the breadcrumb. The value here is the same as menu name. (By default is using the file name)

- title: Title of the page. This is used for title, and meta title inside single and list docs layout. (By default is using the file name)

- description: Description of the page. This is used for meta description inside single and list docs layout. (By default is using the file name)

- slug: Page's slug. (By default is using the file name)

- weight: Page's weight. This is used to sort the order of the page in ascending order and is used for next and previous page features.
  - For level 1 page: The value is a multiple of 1000 (example: 1000, 2000, 3000).
  - For level 2 page: The value is a multiple of 1000 + page's weight number (example: 3001, 3002, 3003, 3004).

  Level 1 page is a page that is a direct children of docs directory (example: docs/introduction/index.md, docs/getting-started/index.md, docs/guides/_index.md).

  Level 2 page is a page that is a direct children of a level 1 page. (example: docs/guides/app-with-webrtc/index.md).

  The default value of weight is 0. The value is the same as menu's weight.

- docs_sidebar: Menu name for sidebar menu in the documentation page
    - identifier: Menu item identifier. This is used as a key and the value must be unique for each menu item entry. For nested menu, this is used to connect parent and child menus

    - name: The name or text label of the menu item. Menu name's value is the same as page's name value.

    - weight: Menu's weight. This is used to sort the order of the menu in ascending order. Menu's weight value is should be the same as page's weight. Please see the page's weight above. The default value is 0.

    - parent: Parent menu for nested menu. This applies to a level 2 page or a page that is not a direct children of docs directory. The value is the parent's menu identifier. If the menu is a level 1 page, the menu obviously doesn't have a parent.


## Blog Archetype
- date: The date associated with the blog page (By default is using current date with YYYY-MM-DD format)

- lastmod: The last modified date of the blog content (By default is using current date with YYYY-MM-DD format)

- title: Title of the blog page. This is used for title, and meta title tags.

- description: Description of the blog page. This is used for meta description.

- ogimage: Blog open graph image.

- slug: Blog page's slug.

- summary: A blog post summary. If this is empty, Hugo will automatically takes the first 70 words from the content.