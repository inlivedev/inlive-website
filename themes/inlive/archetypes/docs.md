---
# Refer to the themes/inlive/archetypes/README.md
date: {{ now.Format "2006-01-02" }}
lastmod: {{ now.Format "2006-01-02" }}
name: {{ .Name }}
title: {{ .Name | humanize | title }}
description: {{ .Name | humanize | title }}
ogimage: # Relative og image URL
slug: {{ .Name }}
menu:
  docs_sidebar:
    identifier: {{ .Name }}
    name: {{ .Name | humanize | title }}
    weight: 0 #Please set the weight
    parent: #Please remove this if this menu doesn't have parent menu
---
