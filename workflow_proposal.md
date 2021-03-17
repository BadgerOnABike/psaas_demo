# PSaaS 2021 Administration Roadmap

---

- [1. Preamble](#1-preamble)
- [2. Repo Branch Structure](#2-repo-branch-structure)
  - [2.1. Quick read on development workflows](#21-quick-read-on-development-workflows)
  - [2.2. Where we want to be in the short term](#22-where-we-want-to-be-in-the-short-term)
  - [2.3. Where we want to be in the long term](#23-where-we-want-to-be-in-the-long-term)
- [3. New Release Schedule](#3-new-release-schedule)
- [4. Bug fixes](#4-bug-fixes)
- [5. New Features](#5-new-features)
- [6. New Version Number Format](#6-new-version-number-format)
- [7. Dev builds built by testers](#7-dev-builds-built-by-testers)
  - [Dev builds for Version 6](#dev-builds-for-version-6)
- [8. Redmine Migration to Git Hub](#8-redmine-migration-to-git-hub)
  - [8.1. Migrating Historical Redmine Data to Github](#81-migrating-historical-redmine-data-to-github)
- [9. Licencing](#9-licencing)
  - [9.1. Pre-release licencing](#91-pre-release-licencing)
  - [9.2. Open source licenses](#92-open-source-licenses)
- [10. New Website as a management tool](#10-new-website-as-a-management-tool)
  - [10.1. Moving forward: Github](#101-moving-forward-github)
- [11. Two workflows - Simple and Advanced](#11-two-workflows---simple-and-advanced)
  - [11.1. Simple Workflow - using website](#111-simple-workflow---using-website)
  - [11.2. Advanced Workflow using Github](#112-advanced-workflow-using-github)
- [12. Community Engagement](#12-community-engagement)

---

## 1. Preamble

Recently we (Franco and Brett) have had some eye opening developer experiences that we want to bring back to the project team. Franco has been working very closely with HSS on a project for NWT, this experience helped him to clearly see some of the conflicts between project expectations and how that is thwarted by developer needs and tools. Brett has also had similar experiences and as a result, we have envisioned a new approach to managing this project that we think will solve some of our more confounding issues and some of our legacy hangovers that are causing trouble. The intent of this document is forward focusing, while it may impact some of the processes that are currently in operation it will not affect all processes. For example, while some components in Prometheus version 6 should be exposed through this method, development testing with tester based building is not anticipated, while in version 7, this is expected.

Here are the major points to consider.

If you have feed back comment on Issue #19 here https://github.com/BadgerOnABike/psaas_demo/issues/19 or bring up an issue during a call.

## 2. Repo Branch Structure

Our recent experiences clearly show how beneficial it is to have a more robust branch structure, eg. master branch and a developer branch. These have clear use cases and can clear up much confusion. Typically the Project Team never sees the complex branching models used by developers, and so we want the whole team to become situationally aware of the branching structures that will be exposed to the Project Team. This is not about forcing developers to use more or less branches, but rather , a simplified but robust branching structure that will be used when the Project Team utilizes a project repo that has been shared to the team. Initially we want to see Team repositories (Those exposed to the project team) have a master and developer branch. The master channel should be used for Releases (not dev builds), while the developer branch would be used for testing fixes & new features. A further discussion remains to be had if we have a master branch for stable full releases, a beta branch for monthlies and a dev branch. Full stables may be a 6 month release schedule and will be more thoroughly advertised than Beta would be. This ensures the overall user experience is as positive as possible while our Beta community continues to cut the bleeding edge and our developer community is able to source the newest bugs as fast as possible.

Branch management also allows for a logging of progress and work as all commits are tagged and we have a timeline that we can trace back through easily and graphically if needed.

Moving forward we will be testing out this concept by exposing the PSaaS Javascript API repository and the PSaaS Builder repository with this branch structure to the project team.

### 2.1. Quick read on development workflows

[Successful Git Branching Model](https://nvie.com/posts/a-successful-git-branching-model/)

### 2.2. Where we want to be in the short term

![Simple](https://nvie.com/img/main-branches@2x.png)

### 2.3. Where we want to be in the long term

![Not Simple](https://nvie.com/img/git-model@2x.png)

## 3. New Release Schedule

Part of the challenges facing the project team stem from a reversal of priorities, currently, this is driven by version numbers, driven by builds, driven by code implementation success by the developer. This approach while doable is neither ideal, nor optimal and lends to the unpredictability of this project. You cant forecast a budget, you cant plan for a release. yet this could very easily be fixed by a new approach. This new approach is currently an experiment and some variables may require tuning for maximum effectiveness, but in principle it is a s follows:

On the first of each month, the developer will be obligated to provide a Beta Release to the dev team. A release is a tagged compiled build meant to be used by a larger target audience, releases would be done on the master branch and would include the need for full binary distribution. Any and all completed and tested fixes/features in the developer branch would be merged into the master branch prior to each monthly release. If there are no changes, this release will still proceed providing us with regular predictable builds that will be known to be stable.

## 4. Bug fixes

When a bug is reported, it will be fixed immediately in the developer branch. When that bug is then marked as Fixed in Dev branch, it can be tested by BUILDING the project from the developer branch. If it cannot be built this likely represents a problem with the build instructions for that component or project, see [dev builds](#dev-builds) below. Individual Fixed Bugs & Completed Features being immediately pushed to the developer branch ensure testers are able to assess the state of the build after each individual bug fix / new feature rather than after an accumulation of bug fixes. As these commits are also snapshots (save states) in time we can now identify where things have gone off the rails if issues re-emerge down the line.

## 5. New Features

When a new features is requested, a development branch is instantiated for work on that feature, then tested by requester/testers by building the application from the developer branch. When the new feature works as expected it gets merged to the master branch and appears in the next schedule release. If the feature does not pass testing, it stays in the developer branch until it passes at which point it will be merged back into the master for the next beta release.

## 6. New Version Number Format

We have a versioning system (A legacy adoption) that does not help in any way other than to differentiate between 6(windows only) and 7 (linux capable). I want to get rid of it instead adopting a more modern scheme typically used for projects that have a lot of moving parts, I chose to emulate the release cycle used in linux distributions keyed off of time rather than developer success. The proposed version number would be like YYYY.MM.DevBuild Number. on release day (1st of the month), the release would be eg. 2021.04.00. For these initial releases we would simply drop the .00, this would be an immediate indicator that an individual is working on a stable beta rather than a dev build.

Any dev build for testing in between releases would increment the end counter, so 26 fixes/features later near the end of feb would be a version 2021.04.26. These dev builds **are not** to be handed out to members of the broader community as they are for testing purposes only and all successful fixes would be released to the community on the month. See [release schedule](#release-schedule).

Additional option for numbering: [https://calver.org/](https://calver.org/) *Thank you Rob Kruus for this suggestion*

Currently manager cares about Version 6 versus Version 7. As such we suggest adding an "edition" for the manager to check. This is not something that would be a part of the installer, rather it would be within the program for manager to check in order to define it's capabilities.

## 7. Dev builds built by testers

We have been pursuing an end target of source code being ready for the public by rushing to make code public-ready, this is not the best approach as it puts unrealistic pressure on our developers to prematurely make code public before it is ready for public consumption, instead we should be encouraging developers to provide buildable projects (Step by step accurate build instructions so that team members can build the dev version themselves. a failure to build would then indicate a problem with build documentation etc. however if Neal, Franco or Brett can build the dev version and test the bugfix/new feature, we have eliminated a huge temporal hurdle waiting for HSS/Mac to build a dev build while they are supposed to be coding bug fixes etc. Further this makes our code far more ready for prime-time well in advance of needing it to be ready for the public or other developers.

### Dev builds for Version 6

Due to the current inability for testers to generate development builds for themselves some interim logic is required.

This is a work in progress, we are attempting to get the flexibility of GitHub from a geriatric tank mechanic.

As it stands.

A critical rule for development now and into the future.
**Work will only be performed on items that are in a build request**

Workflow:
Generate Issue > attach to dev build request > test > pass > attach to release build request



1. A build request contains items to be worked on.
2. A build will not be built until it is assigned a version number.
3. 

## 8. Redmine Migration to Git Hub

### 8.1. Migrating Historical Redmine Data to Github

There are several open projects out there to facilitate migration from redmine to github, however, most of them will require either a learning curve, or modification to adapt them to use an old version of redmine, so it would seem that a more realistic and cost effective approach would be to harness the power of the Davinci bot that lives in the PSAAS Discord server. This bot already has access to redmine via its REST API and to GitHub through its official API project. Considering that we want a very specific subset of redmine data from each issue or sub issue to be migrated to github, this makes more sense that to hammer a a square peg into a round hole. Brett and I can work together to define the business logic to migrate the issues the way we need them far easier using this mechanism. Another approach we could consider is a hybrid approach, manage issues in Redmine until they are closed, when everything is closed, export everything for posterity and stick with github.

![Davinci](./proposalAssets/davinci_screen_shot.png)

## 9. Licencing

### 9.1. Pre-release licencing

We should have a pre-release licence for all software prior to release. This will help in two areas:

1. Pressure to support software before it is complete.
2. Programmatic dependencies before target is stable.

Other projects use similar licencing to protect the project prior to release, EG:

[Microsoft Pre-release License](https://docs.microsoft.com/en-us/skype-sdk/trusted-application-api/sdk/license)

### 9.2. Open source licenses

## 10. New Website as a management tool

New semi automated website leverages github and other functionality to be used as a simple management endpoint.

### 10.1. Moving forward: Github

While we can leverage Davinci & other tools to migrate old issues, moving forward, It would make so much more sense to simply used the available features built into github, such as Organizations & PRojects to manage things. Obviously this would require updated Github based workflows to be spelled out.

## 11. Two workflows - Simple and Advanced

### 11.1. Simple Workflow - using website

Users can come here to look up simple things, like current bug list, known issues, and outstanding feature requests, etc.
This would be a simple read-only(mostly) experience, with limited bug entry and feature requesting.

### 11.2. Advanced Workflow using Github

For more advanced functionality such as actively collaborating with a developer, communicating bugs and fixes and tests, and project management, the user would simply log into github and work there.

## 12. Community Engagement

The current websites for the project and it's sub-projects are old school websites that need manual maintenance and updating, and the only real online community we have created is the REDapp Community which we did by using the [Drupal 7](https://www.drupal.org/docs/understanding-drupal/drupal-9-release-date-and-what-it-means/what-happens-to-drupal-7-now-that) platform. Drupal 7 is now at end of life and is no longer a sustainable approach to manage a community.  We are experimenting with semi-automated websites that can leverage automated community engagement.

Two layers of community engagement exist that we have yet to fully take advantage of are:

1. Github - a lot of our user base that we don't know about uses GitHub. Consider the number of tools that folks use that the authors/Creators have no idea we use. Additionally, we use many of these tools well beyond what they were intended for.
   - Missing community - These are the people that aren't fire modellers, will never be fire modellers, but need a thing to spread stuff across space. We've unintentionally excluded these people and that won't change... (we will not intend to serve them). If we're on GitHub though, we have the opportunity to serve the unintended and then they may serve the intended. Word of mouth is one hell of a vector of transmission, the number of people I've turned onto the image recognition tools or audio translation tools or web dev tools
   - Website automation and integration - Git hub has a great API to allow us to grab important project information directly from the source to be published auto-magically to an automated website without the need for a webmaster to constantly push updates to the site from project materials.
  
2. Discord - A semi-automated  website has the opportunity to redirect curious folks to our discord server.
   - This has become a very common method of communication within a large number of communities. Further, discord is in the process of pivoting to better suit the business users, we are positioned nicely to leverage the potential incoming business userbase.
   - Discord also has a number of integration structures that allow us to make every stop a one stop shop. Meaning the website, discord server and github page all display roughly the same information. GitHub of course will have more as it's meant for a higher level userbase, but that is not the rule. As an example, a number of video games provide software such as bots to operate functions on behalf of users. Many of these users are experiencing GitHub for the first time through this process and have questions that can be answered in realtime with a connected discord. By providing instructions in the GitHub and a discord server users have the option of solving their own problems or asking for help.
   - Our current website serves the purpose of serving the tool, but does very little to engage the user. A combination of website, github and discord provide an automated method of engagement that a larger proportion of users will likely take advantage of. Not to mention it provides 2 methods to interact with the dev team in real time. This also provides a method to limit the burden of individual developers/developer community members responding to issues the community has, simultaneously saving our inboxes.
