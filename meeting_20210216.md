# Agenda

- [1. SOPS](#1-sops)
  - [Do Nots](#do-nots)
  - [Do's](#dos)
- [2. APIs](#2-apis)
  - [Python and R Future APIS](#python-and-r-future-apis)
- [3. Next Gen CFFDRS and PSaaS](#3-next-gen-cffdrs-and-psaas)
- [4. 1153/54](#4-115354)
- [5. 1173](#5-1173)
- [6. Java survey](#6-java-survey)
- [7. SOPs and Project Management](#7-sops-and-project-management)
- [8. Vague Tickets](#8-vague-tickets)
- [9. How do I get a ticket in?](#9-how-do-i-get-a-ticket-in)

## 1. SOPS

### Do Nots

1. Do not build a build request that has not been commissioned. Any and all builds must be triggered by a build request.
2. Do not create a dev build request in the last week of the month. (Reduce undue stress)
3. Do not fix bugs that do not have an issue/ticket.
4. Do not add features that do not have features.
5. Don't use related issues to connect things in RedMine (can be used for issues that are related, but not tied back to build requests)
6. Only 1 open build request open at a time.

### Do's

- [ ] Add in the do's

## 2. APIs

We have been discussing which APIs to keep and which APIs to leave. We have discussed dropping the PHP API. Should we continue supporting .net the way we support JS and JAVA? Synchronizing all the efforts in JS and JAVA is a lot of work.
Are we still using .net API?
Are there plans of anyone to use it?
Deprecation to .net API had consensus.

We will move forward with js and java APIs.

### Python and R Future APIS

These are likely the 2 most opportune APIs that will need development in time.

## 3. Next Gen CFFDRS and PSaaS

Jordan - Few years out, but we are looking to integrate when it is available. Less of it being a replacement and more of it being an enhancement where data is rich. New / different ways to calculate indices and span time. Looking to add more adjustable functionality to CFFDRS, looks more like another system getting bolted on rather than a new system. How do we bolt on in when it is ready?
Neal - Unlikely that there will be a stoppage of development however we may stop some development streams, the rest of the system will still get worked on. Would be great to get some prototypical input for next gen CFFDRS as much of the development has been internal.
Jordan - Yea we can get together and work to push ahead.
Neal - Sounds good, previous opportunities with CanFire, it was suggested its not next gen. Who can we look to as the leader for this so we can move ahead?
Jordan - I need to look into who is the trusted source and I'll get back to you.

The new system is based on a data richness requirement.

## 4. 1153/54

How we call JAVA
[Issue 1153](https://ppm.redapp.org/issues/1153)

How we call GDAL
[Issue 1154](https://ppm.redapp.org/issues/1153)

Rob looking for feedback from Mac. Bigger challenge is how we call GDAL, GDAL requires serialization. Mac now has a work items for Mac button. Mac has also seen no issues with GDAl 3.2.0.

Moving to GDAL 3.2.0 Issue is [Issue 1140](https://ppm.redapp.org/issues/1140)

## 5. 1173

[Issue 1173](https://ppm.redapp.org/issues/1173)

Build numbering looks weird, no longer Prometheus 6.2.6 and a date?

Franco - This issue is an effort to sort out the build that he got done and is now chasing up. We want to move towards the CalVer style versioning with Dev increments at the end [2021.02]{CalVer}[.02]{Dev Build Number}.

- [ ] [TODO] - Mention how PSaaS will be numbered into the future (PSaaS 6_CalVer) and in psaas 7 (CalVer)

## 6. Java survey

Where your agency headed? Staying in Oracle or moving on? Where are you going, where are you now, let us know by next meeting. [RedMine Issue redmine1131.](https://ppm.redapp.org/issues/1131)

## 7. SOPs and Project Management

Per [issue 1142](https://ppm.redapp.org/issues/1142) are we going to deprecate or extend and document? When to deprecate?
Modular and extensible coding will allow us to deprecate within modules without removing the actual method to perform an action.

Franco - Extensible coding is to ensure backwards compatibility. Now is really the only time we can clean house.

- [ ] [TODO] - remove the old coding method for FMC and move to the new defaults.

## 8. Vague Tickets

These lead to open ended large tickets. We need to button that up.

## 9. How do I get a ticket in?

Neal is looking for the method for him to get tickets in for Prometheus.
Franco - you are the lead for Prometheus, otherwise if you have any issues drop myself or Brett a line and we can get things sorted out.
