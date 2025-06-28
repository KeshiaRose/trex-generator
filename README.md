# Tableau TREX Generator

A quick way to generate manifest files for Tableau [dashboard extensions](https://help.tableau.com/current/pro/desktop/en-gb/dashboard_extensions.htm) created by [Keshia Rose](https://twitter.com/KroseKeshia). Read the [docs](https://tableau.github.io/extensions-api/docs/trex_getstarted.html) to learn how to build your own extension or try out this step-by-step [mini-project](https://github.com/tableau/datadev-hackathon/wiki/Update-a-date-filter-to-a-specific-range)!

## How to Use

Live version: https://trex-generator.sliceofkeesh.com

Simply enter your information into the form and click download to get your manifest file!

## Validation Rules

**Extension ID**: This sould be something unique to your extension and needs to use a reverse domain pattern without any special characters or spaces.

**URLs**: Both the extension URL and your organization/personal URL need to be on HTTPS. The only exception is if you are using localhost for your extension URL.

## Sharing Data

We love data so this tool collects the information submitted to an Airtable base so we can see what the community is working on! However, we only collect it if the share option is checked. Otherwise, we just save an empty record with timestamp and api version just to track usage. :)
