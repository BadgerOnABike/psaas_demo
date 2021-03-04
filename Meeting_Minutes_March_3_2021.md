# March 3 Agenda- 
- [1. NZ Meeting](#1-nz-meeting)
- [2. Builds up - Prometheus](#2-builds-up---prometheus)
- [3. SOP Updates / Workflow Plan](#3-sop-updates--workflow-plan)
  - [3.1. Priorities and workplan](#31-priorities-and-workplan)
- [4. Beta Release](#4-beta-release)
- [5. Burn-P3 Update - Version number interface PCOM](#5-burn-p3-update---version-number-interface-pcom)
- [6. Alberta Budgets and Year Ahead](#6-alberta-budgets-and-year-ahead)

## 1. NZ Meeting

1. Got caught up mostly
2. Brought up the idea of a test dataset, validation for fuel types first. Next spatial ignitions and weather
3. Teaser of the new SOPs with beta version and numbering, talked about the directional desires and new compilation structure

## 2. Builds up - Prometheus

- Builds can be found here: https://bit.ly/36qIL38

Uploaded a version late last week. Sorted out some version numbering on monday and got new versions of Prometheus and PSaaS up on Monday. We have issues with resolution and rounding errors in 7 so we have 3 versions up to test some potential paths forward. There is no Prometheus 7, so PSaaS users are the testers. Will be able to find tickets in RedMine soon.

Builds will be announced in the discord announcements channel. We may want to more invasive announcements in the future.

Burn-P3 new version is out, works with the most recent Prometheus release.

Burn-P3 can't be built until the beta is up for Prometheus. Perhaps we set up the Burn-P3 release to occur after the Prometheus beta release to ensure they are on the same version. The moratorium on developmental builds in week 3 to allow for the coordination of build numbers to ensure both operate on the newest beta version. For now we will try to get them going together, if we need a waiting period we can wait a few days.

## 3. SOP Updates / Workflow Plan

- Workflow plan can be found here: https://github.com/BadgerOnABike/psaas_demo/blob/Developer/workflow_proposal.md

Read the proposal, specifically Topics 2 and 7. Leave your notes or bring up any issues in the psaas-developers channel on discord, or you can drop it with Franco or I directly, we will likely put it in the psaas-developers channel but anonymize it for you. You may also just create an issue for us.

### 3.1. Priorities and workplan

- For the last 2.5 years we have had a workplan and we should have another in case external groups are curious what we are doing and where we are going.

Neal would like to get the group thinking about next steps and the workplan direction. Some items to consider:

1. Public release of PSaaS
2. Deprecate firegrowthmodel.ca and/or move to the next website
3. Mobile version of RedApp
4. Introducing levelset and cellular automata
5. Development of Abstraction API
6. GUI for PSaaS

## 4. Beta Release



## 5. Burn-P3 Update - Version number interface PCOM

Minor point here from Mac. Previous versioning fit well into a structure but the new structure does not fit into that as nicely. We will be comparing the version between Prometheus and Burn-P3 to ensure it is using a version that Burn-P3 should work with. 

Rob: Yes, I'm seeing that this was missed, we should discuss it in a work item. Version string is required for BP3 to see. The numeric version is also required alongside this string for comparison purposes.

- [ ] Brett to add in work item for numeric version comparison system.

## 6. Alberta Budgets and Year Ahead

Have surplus currently. Very little time to spend the budget that was allocated. We have some opportunities to use this money, some transfer is being set up to send money to CIFFC.

Coming year is a big question mark at this time. 