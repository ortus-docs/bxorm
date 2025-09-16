# Boxlang ORM Gitbook - AI Agent Instructions

This is a markdown documentation wiki hosted via GitBook at https://bxorm.ortusbooks.com for the purpose of instructing developers on the use of Boxlang ORM, an open-source Object-Relational Mapping (ORM) framework for the open-source Boxlang programming language.

All documentation is written in markdown and organized in a hierarchical structure for easy navigation. Each section contains multiple articles covering specific topics related to Boxlang ORM.

## Structure

* Structure - the general structure should remain thus:
    * Intro and Getting Started
    * Modeling entities
    * Interacting with the ORM
    * Advanced topics
    * Reference
* New pages - all new pages should be added to `SUMMARY.md`
* Hyperlinks - automatically checked on each commit via CI using [markdown-link-check](.github/workflows/link-checker.yml)
* Images - all images should be stored in the same folder as the markdown file that references them
* Diagrams - Use MermaidJS syntax for diagramming, use [mermaidchart.com](https://www.mermaidchart.com/) OR the MermaidChart VS Code plugin to render them. Diagram source code should be stored as `.mermaid` files in the same folder as the markdown file that references them.
* Use gitbook hints to refer to other sections of the documentation.