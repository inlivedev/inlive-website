**Docs Archetype**

- date: The date associated with the page (By default is using current date with YYYY-MM-DD format)

- lastmod: The last modified date of the content (By default is using current date with YYYY-MM-DD format)

- name: Name of the page. This will be used in the breadcrumb. "Name" here is same as menu name. (By default is using the file name)

- title: Title of the page. This is used for title tag, meta title tag and heading level 1 inside single and list docs layout. (By default is using the file name)

- description: Description of the page. This is used for meta description, and paragraph leading below heading level 1 inside single and list docs layout. (By default is using the file name)

- slug: Page's slug. (By default is using the file name)

- weight: Page's weight. This is used to sort the order of the page and is used for next and previous page features. The value is a multiple of 1000 for section page (_index.md) (example 2000) and increment by 1 for single page inside the section (example 2001, 2002). (By default the value is 0). The value is the same as menu's weight.

- docs_sidebar: Menu's name for sidebar menu in the documentation page
    - identifier: Menu item identifier. This is used as a key and the value must be unique for each menu item entry. For nested menu, this is used to connect parent and child menus

    - name: The name or label of the menu item. Menu name is same as page's name.

    - weight: Menu's weight. This is used to sort the order of the menu. The value is a multiple of 1000 for section page (_index.md) (example 2000) and increment by 1 for single page inside the section (example 2001, 2002). (By default the value is 0). The value is the same as page's weight.

    - parent: Parent menu for nested menu. This applies to single page which is not section page (_index.md). The value is the name of current directory where the menu resides. For example menu that has identifier installation has parent which identifier is getting-started. For section page (_index.md), the value is empty because section page is supposed to be a parent menu.
