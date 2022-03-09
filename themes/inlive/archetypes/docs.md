---
# Refer to the themes/inlive/archetypes/README.md
date: {{ now.Format "2006-01-02" }}
lastmod: {{ now.Format "2006-01-02" }}
name: {{ .Name | humanize | title }}
title: {{ .Name | humanize | title }}
description: {{ .Name | humanize | title }}
slug: {{ .Name }}
weight: 0 # Please set the weight
menu:
  docs_sidebar:
    identifier: {{ .Name | humanize | title }}
    name: {{ .Name | humanize | title }}
    weight: 0 #Please set the weight
    parent: #No parent menu
---
