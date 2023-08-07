## Docs Archetype

- date: The date associated with the page (By default is using current date with YYYY-MM-DD format)

- lastmod: The last modified date of the content (By default is using current date with YYYY-MM-DD format)

- name: Name of the page. The value here will be used for side menu identifier. (By default is using the file name)

- title: Title of the page. This is used for title, and meta title inside single and list docs layout. (By default is using the file name)

- description: Description of the page. This is used for meta description inside single and list docs layout. (By default is using the file name)

- ogImage: The relative og image URL.

- slug: Page's slug. (By default is using the file name)

- docs_sidebar: Menu name for sidebar menu in the documentation page
    - identifier: Menu item identifier. This is used as a key and the value must be unique for each menu item entry. For nested menu, this is used to connect parent and child menus

    - name: The text label of the menu item.

    - weight: Menu's weight. This is used to sort the order of the menu.

    - parent: The value is the parent's menu identifier. If the menu is a level 1 page, the menu obviously doesn't have a parent.


## Blog Archetype
- date: The date associated with the blog page (By default is using current date with YYYY-MM-DD format)

- lastmod: The last modified date of the blog content (By default is using current date with YYYY-MM-DD format)

- title: Title of the blog page. This is used for title, and meta title tags.

- description: Description of the blog page. This is used for meta description.

- ogimage: Blog open graph image.

- slug: Blog page's slug.

- summary: A blog post summary. If this is empty, Hugo will automatically takes the first 70 words from the content.