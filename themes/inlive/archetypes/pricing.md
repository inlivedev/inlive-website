---
title: "{{ .Name | title }}"
description: {{ .Name | humanize | title }}
date: {{ .Date }}
lastmod: {{ now.Format "2006-01-02" }}
draft: false
type: pricing
layout: pricing
---