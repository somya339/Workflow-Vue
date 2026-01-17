# Testing Setup Guide

This project uses Vitest for unit testing with Vue Test Utils for Vue component testing.

## Installation

The testing dependencies are already installed:
- `vitest` - Testing framework
- `@vue/test-utils` - Vue component testing utilities
- `jsdom` - DOM environment for Node.js
- `@vitest/ui` - Visual test runner interface

## Running Tests

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run tests with visual interface
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Structure

- Component tests: `src/components/__tests__/`
- Utility tests: `src/utils/__tests__/`
- Store tests: `src/stores/__tests__/`
- Service tests: `src/services/__tests__/`

## Writing Tests

### Component Tests

```typescript
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import MyComponent from "../MyComponent.vue";

describe("MyComponent", () => {
  it("renders properly", () => {
    const wrapper = mount(MyComponent);
    expect(wrapper.exists()).toBe(true);
  });

  it("handles user interactions", async () => {
    const wrapper = mount(MyComponent);
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("click");
  });
});
```

### Utility Tests

```typescript
import { describe, it, expect } from "vitest";
import { myUtility } from "../myUtility";

describe("myUtility", () => {
  it("returns expected result", () => {
    expect(myUtility("input")).toBe("expected output");
  });
});
```

## Configuration

- Test configuration: `vitest.config.ts`
- Global test setup: `src/test/setup.ts`
- TypeScript types are automatically configured

## Best Practices

1. Place tests next to the files they test or in `__tests__` directories
2. Use descriptive test names that explain what is being tested
3. Test user interactions, not implementation details
4. Mock external dependencies in the setup file
5. Keep tests focused and independent
