# Agenda

- [1. Strategy Document (Workplan)](#1-strategy-document-workplan)
  - [1.1 Priority setting for developers](#11-priority-setting-for-developers)
- [2. Release plan](#2-release-plan)
- [3. Lux info from Franco and paper when it comes](#3-lux-info-from-franco-and-paper-when-it-comes)
- [4. New Zealand PSaaS feedback](#4-new-zealand-psaas-feedback)
- [5. Toolbox meeting between PSaaS and CIFFC](#5-toolbox-meeting-between-psaas-and-ciffc)
- [6. Liz RedApp Testing](#6-liz-redapp-testing)

## 1. Strategy Document (Workplan)

Document is here: https://github.com/BadgerOnABike/psaas_demo/blob/Developer/workflow_proposal.md

**Brad** comments and dialogue

Pre-release licensing structure has been demonstrated as necessary due to external projects leveraging PSaaS.

Section 9.1 is not likely to address issues faced by FireShed.

**Brad**: We are always contemplating changes to provide different services to our clients, any future changes should be on board and fit with us.We have done a lot to define what maybe to do and what maybe not to do.

**Franco**: Additional information on 10.1, I had done a lot on static site generation. I've found a way to use GitHub to automatically generate the website on our behalf.

### 1.1 Priority setting for developers

**Neal**:

One of the missing pieces for the workflow is the path forward for the next year. What are the priorities where are we going what are our objectives. This work planning needs to be done in parallel of this workflow document as it would help focus development efforts.

Desire to get the workplan in place for April. This will help keep us grounded but will also give us a better footing for acquiring funding. This document can also provide accountability.

At any given point we ebb and flow, the processes are tools for us to view our goals but they don't solve all our problems. We can address these issues in real time so please bring them forward as you encounter them. Another part of this is to begin to develop roles so we know the purpose of each member and they know their purpose in the group.

## 2. Release plan

Burn P3 and Prometheus have been playing nicely as of the March beta builds. The goal is to use that platform as a spring board to get an April release out to the public.

## 3. Lux info from Franco and paper when it comes

This group came to us looking to be helpful. They don't appear to have an aggressive timeline to the end that they would be banging on our desks for a completed product. They seems to have a good desire for where this work is to go.
## 4. New Zealand PSaaS feedback

2 versions for Linux, one for Ubuntu. One build using UTm and one was using false scaling and origin. We also had 128 and 64 bit versions to test. Out of all the exports currently Wayne prefers the 128 bit UTM outputs. The issue is, without the false scaling the 128 bit is purely software and doubles the processing time.

Most of the issues with jumping fuel breaks and non-fuels are largely sorted out, which is comforting for moving to V7.

V6 - entirely false scaling and false origin
V7 - false scale and origin only in FireEngine, transformations for every call in and out. All other data is in UTM.

## 5. Toolbox meeting between PSaaS and CIFFC

Legalities of the toolbox. "As the CFS begins the implementation in the CWFIF they may be the best bet for the housing of the toolbox." 

What is the teams perspective on the notion of a national toolbox.

**Franco**: Met with this IT group a few times, they have some powerful IT folks at the top now. They want to understand the history (rational etc) for things like the toolbox. told them they may be going in the wrong direction. A lot of discomfort from the IT group about the amount of work that has been dropped on their laps. 

**Brett**: I thought the CWFIF process would likely make spurred development very difficult as it would fall into their development cycle. Had a conversation with the CWFIF about building in some data dissemination process and they mentioned it may be difficult to perform rapid changes and confirmation to their process is difficult now as it's not solidified. Develop alongside and aware of the CWFIF without being inside the CWFIF as the SDLC within the CWFIF may limit the capacity of external partners to contribute.

## 6. Liz RedApp Testing

Tested build 1138.

Installing redapp 2021_02_04 successful
Was able to obtain forecast without issue
Confirmed with EC - outputs looked good
Global run was in 6 hour timesteps, we can get 3 hour now though.
Regional model isn't available but it would be a good addition.

Suggestions to make this more graphical than tabular. (Thoughts on Plotly?)