import { createMachine } from "xstate";

export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBU4BcAEBbAhgYwAsBLAOzADoAxIgJ1kwGU0c0wBiMgDzQG0AGALqJQABwD2sImiJiSwkJ0QBGAOx9yANj4BOAEzalAVgAsSpQGZD2gDQgAnol3nyhlcd1KAHCsMBff7YkYhBw8qj02PjEZPLiktKy8ooIALTmGuS6fO66hhbm2ibanrYOqYaG5O6unkq5ASDhmLiEpBTUdIzMrLESUjJySArKSuQqhSpunhpaxoZ8uqWOui5uHt5+vrZNka1k5AxgeLIQGEwsYL3xA0mO2hkqWm7mWW58bksIuiuu7l4+-n8QA */
    id: "Test machine",
    initial: "First State",
    states: {
      "First State": {
        on: {
          next: {
            target: "Second State",
          },
        },
      },
      "Second State": {},
    },
    schema: { events: {} as { type: "next" } },
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {},
  },
  {
    actions: {},
    services: {},
    guards: {},
    delays: {},
  },
);
