# Delivery Policy

Every milestone should be delivered as a reproducible package with:

1. A task list
2. The exact files to create or modify
3. The complete contents of each file
4. Verification commands
5. Expected output
6. A git commit message
7. Rollback instructions

This keeps implementation reproducible, debuggable, and easier to review as the project grows.

## Strict Execution Mode (All Milestones)

The following rules are mandatory for every milestone:

1. Verify first before creating or modifying files.
2. Do not regenerate existing scaffolds or boilerplate that are already valid.
3. Implement one component at a time, in sequence.
4. After each component:
	- compile successfully,
	- pass build verification,
	- commit before starting the next component.
5. No parallel implementation tracks inside a milestone.
6. Keep each commit scoped to a single component whenever possible.
7. End each milestone with a green build and clean git status.

## Rule #9: No Checklist Coding

Do not implement features only because they appear in a roadmap or checklist.

A feature is implemented only if at least one of the following is true:

1. It delivers user value.
2. It supports an upcoming feature.
3. It reduces technical risk.
4. It satisfies a verified requirement.

If none of these conditions apply, leave the codebase unchanged.
