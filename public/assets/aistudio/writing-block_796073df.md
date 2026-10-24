# Product Requirements Document
## AI-Powered Gamified Open-Source Contribution Platform

**Version:** 1.2  
**Status:** MVP product requirements update  
**AI model:** Gemma  
**Primary integration:** GitHub

## 1. Product Vision

Create a gamified, AI-powered platform that helps beginner developers discover meaningful open-source contribution opportunities in active GitHub repositories.

The platform personalizes each user's experience through GitHub profile analysis, optional resume or portfolio uploads, and a short multiple-choice onboarding assessment.

Users receive suitable contribution missions, learn with a Gemma-powered AI mentor, and progress through real-world development challenges.

The platform prioritizes meaningful learning, contribution quality, and respect for repository maintainers.

## 2. Personalized User Onboarding

Onboarding should be interactive, engaging, and quick to complete.

Users should not need to write lengthy descriptions of their skills, experience, or interests.

### 2.1 Supported Profile Inputs

Users may provide:

- GitHub account connection.
- Resume upload in PDF or DOCX format.
- Portfolio website URL.
- GitHub profile URL.
- Manual skill selection.

Resume and portfolio submission must be optional. Users should be able to complete onboarding without uploading personal documents.

### 2.2 AI Profile Analysis

The system should extract relevant information from available profile inputs, including:

- Programming languages.
- Frameworks and technologies.
- Project experience.
- Areas of technical interest.
- Evidence of previous contributions.
- Potential learning goals.

Gemma may assist with interpreting extracted information.

The system must distinguish claimed skills from demonstrated skills and avoid treating resume content as verified proficiency.

Users must be able to review and correct their generated profiles.

### 2.3 Multiple-Choice Onboarding Assessment

The platform should ask a short series of choice-based questions to understand each user's experience and goals.

Questions should be adaptive, allowing the system to avoid unnecessary questions when sufficient information is already available.

#### Example Questions

**Question 1: What describes your programming experience?**

- Just getting started.
- I understand programming fundamentals.
- I've built some personal projects.
- I've worked on real-world projects.

**Question 2: Which technologies are you comfortable with?**

- Python.
- JavaScript / TypeScript.
- Java / C++.
- Other technologies.

Users should be able to select multiple answers where appropriate.

**Question 3: What type of contribution interests you?**

- Fixing bugs.
- Building features.
- Improving documentation.
- Writing tests.

**Question 4: How familiar are you with Git and GitHub?**

- I'm completely new.
- I know basic Git commands.
- I've used branches and pull requests.
- I've contributed to repositories before.

**Question 5: What is your main goal?**

- Make my first open-source contribution.
- Improve my programming skills.
- Build a stronger developer portfolio.
- Gain experience collaborating on real projects.

### 2.4 Optional Practical Assessment

The system may offer short technical multiple-choice questions to better estimate the user's current knowledge.

This assessment should be optional and should not prevent beginners from accessing the platform.

The assessment must not rely exclusively on self-reported confidence.

### 2.5 Onboarding Output

After onboarding, the platform generates a personalized developer profile containing:

- Identified skills.
- Experience estimate.
- Preferred technologies.
- Learning interests.
- Suggested starting difficulty.
- Recommended contribution missions.

Users can edit their profiles and preferences at any time.

## 3. Active Repository Discovery

### 3.1 Mandatory Repository Eligibility

The platform must prioritize actively maintained public GitHub repositories.

Repository eligibility should consider:

- Recent meaningful development or maintenance activity.
- Recent maintainer responses to issues or pull requests.
- Evidence that contributions are reviewed.
- Available contribution documentation.
- Repository accessibility and current status.
- Signs of abandonment or prolonged inactivity.

Repository stars and popularity must not be treated as sufficient evidence of active maintenance.

### 3.2 Repository Activity Evaluation

The system should evaluate repository health using available GitHub metadata.

Relevant signals may include:

- Recent commits.
- Recent merged pull requests.
- Maintainer response activity.
- Issue discussion activity.
- Release history where applicable.
- Contribution guidelines.

The platform should use a configurable activity evaluation policy rather than permanently defining activity through one fixed time threshold.

Repositories with insufficient evidence of active maintenance should be excluded from the default mission feed.

### 3.3 Repository Quality

The platform should favor repositories that demonstrate reasonable contributor onboarding practices.

This includes accessible documentation, understandable project structure, and evidence that external contributions are welcome.

## 4. Issue Eligibility and Availability

Only issues meeting the platform's eligibility requirements should appear as available missions.

### Mandatory Conditions

- Issue is open.
- Issue has no assignee.
- Issue belongs to an eligible active repository.
- Issue is not a pull request.
- Issue is relevant to the user's technical interests.
- Issue is not clearly duplicated or superseded.
- No clear evidence indicates someone is already implementing the issue.
- Repository contribution rules allow the intended contribution workflow.

### Availability Checks

The system should inspect:

- GitHub issue assignments.
- Issue labels.
- Recent comments.
- Linked pull requests.
- Maintainer instructions.
- Repository contribution policies.

An unassigned issue is not automatically available for contribution.

When availability is ambiguous, the platform should withhold the issue from the default available-mission feed.

### Revalidation

Issue availability must be rechecked before a user begins a mission and again before PR preparation.

If an issue becomes assigned, closed, or otherwise unavailable, the user should be informed and offered alternatives.

The platform must not imply that selecting a mission reserves the issue on GitHub.

## 5. Personalized Mission Recommendation

The recommendation engine should match eligible issues against each user's profile.

Matching factors include:

- Programming skills.
- Preferred languages and frameworks.
- Experience level.
- Contribution interests.
- Learning objectives.
- Issue complexity.
- Repository health.
- Issue clarity and availability.

The system should explain why each mission was recommended.

Recommendations should adapt to user feedback, demonstrated progress, and changes in issue availability.

## 6. Gamified User Experience

The platform should transform contribution discovery into a mission-based learning experience.

### Developer Dashboard

Display personalized missions, current progress, learning achievements, and recommended next steps.

### Mission Explorer

Present eligible issues as interactive mission cards containing:

- Mission title.
- Repository identity.
- Relevant technologies.
- Difficulty estimate.
- Learning objectives.
- Availability status.
- Contribution expectations.
- Suggested experience rewards.

### Mission Journey

Each mission follows a guided progression:

1. Discover the mission.
2. Understand the issue.
3. Explore relevant code.
4. Plan the solution.
5. Implement changes.
6. Verify the contribution.
7. Prepare a pull request.
8. Learn from maintainer feedback.

### Progression and Rewards

Users can earn experience points and achievements for meaningful learning milestones and contribution outcomes.

The system must not encourage PR spam or reward submission volume without considering quality.

## 7. Gemma-Powered AI Mentor

Gemma should help users:

- Understand issue descriptions.
- Learn unfamiliar technical concepts.
- Explore relevant repository code.
- Develop implementation plans.
- Receive progressive hints.
- Debug problems.
- Review proposed changes.
- Prepare clear pull request descriptions.
- Understand maintainer feedback.

AI guidance must be grounded in available repository context.

Gemma must not claim that code has passed tests unless those tests were actually executed and their results are available.

## 8. UI/UX Requirements

The interface should be approachable for beginners while remaining useful to developers with practical experience.

### Onboarding Experience

- Short, interactive multiple-choice questions.
- Multi-select options where appropriate.
- Optional resume and portfolio upload.
- Clear progress indicators.
- Ability to skip nonessential questions.
- Reviewable AI-generated skill profile.

### Mission Experience

- Game-inspired mission cards.
- Clear difficulty indicators.
- Visual progress tracking.
- Contextual AI mentor.
- Guided checkpoints.
- Accessible repository links.
- Understandable contribution readiness feedback.

### Design Principles

- Minimize unnecessary typing.
- Keep interactions intuitive.
- Make recommendations explainable.
- Avoid overwhelming users with technical details.
- Provide helpful feedback during progression.
- Preserve access to original GitHub information.
- Ensure accessible, responsive interaction.

## 9. External Integrations

| Integration | Purpose |
|---|---|
| GitHub API | Repository discovery, issue retrieval, activity analysis, PR workflows |
| GitHub authentication | Account connection and authorized actions |
| Gemma inference | Profile interpretation, explanations, and AI mentoring |
| Resume document parser | Extract information from uploaded resumes |
| Portfolio content retrieval | Analyze publicly accessible portfolio content |
| PostgreSQL | User profiles, assessment responses, missions, and progress |

Portfolio retrieval must respect website access restrictions and should not assume every website can be parsed reliably.

## 10. Core MVP Requirements

The MVP should include:

1. GitHub authentication and user onboarding.
2. Optional resume and portfolio inputs.
3. Choice-based skill and interest assessment.
4. AI-assisted developer profile generation.
5. Active repository filtering.
6. Open, unassigned issue discovery with availability checks.
7. Personalized mission recommendations.
8. Gamified mission interface.
9. Gemma-powered issue explanations and guidance.
10. Basic progress tracking.

Advanced cloud coding environments, autonomous PR submission, and complex gamification systems remain outside the initial scope.

## 11. Success Metrics

The platform should measure:

- Onboarding completion rate.
- Accuracy of extracted skills.
- Relevance of recommended missions.
- Accuracy of repository activity classification.
- Accuracy of issue availability checks.
- Time required to find a suitable issue.
- Mission understanding and completion.
- Quality of resulting contributions.
- Maintainer feedback.
- Learning progress and user retention.

The system should compare these outcomes with existing open-source contribution workflows.

## 12. Definition of Success

The platform succeeds when beginners can quickly establish their technical profiles, discover relevant issues in actively maintained repositories, and complete meaningful contribution journeys with personalized guidance.

The experience should make open-source participation approachable and motivating without compromising contribution quality.

**Product promise:** Discover your skills, find your mission, learn by building, and become a real open-source contributor.