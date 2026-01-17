# Workflow Builder

A visual workflow builder built with Vue 3 that lets you create and execute data transformation pipelines. Think of it as a simplified version of n8n or Node-RED - drag nodes, connect them, configure them, and watch your data flow through.

## What It Does

This application lets you build workflows visually by dragging and dropping nodes onto a canvas. You can:

- **Start** with initial data (JSON payload)
- **Transform** data using various operations (uppercase, lowercase, append text, multiply numbers)
- **End** with the final result

The workflow executes step by step, showing you exactly what happens at each stage.

## Features

### Core Functionality
- **Visual Node Editor**: Drag nodes from the palette onto the canvas
- **Node Connections**: Connect nodes by dragging from one handle to another
- **Node Configuration**: Click any node to configure it in the right panel
- **Workflow Execution**: Run your workflow and see step-by-step results
- **Execution Logs**: View detailed logs showing input/output at each step

### Node Types

1. **Start Node** (Green)
   - Begins your workflow
   - Configure with a JSON payload (e.g., `{"message": "hello"}`)

2. **Transform Node** (Blue)
   - Transforms data as it flows through
   - Operations available:
     - **Uppercase**: Converts text to UPPERCASE
     - **Lowercase**: Converts text to lowercase
     - **Append**: Adds text to the end of strings
     - **Multiply**: Multiplies numbers (works only with numeric values)

3. **End Node** (Red)
   - Completes your workflow
   - Displays the final result

### Bonus Features
- **Undo/Redo**: Press `Ctrl+Z` (or `Cmd+Z` on Mac) to undo, `Ctrl+Y` to redo
- **Auto-save**: Your workflow automatically saves to browser storage
- **Export/Import**: Save your workflow as JSON and load it later
- **Keyboard Shortcuts**:
  - `Delete` or `Backspace`: Remove selected node
  - `Escape`: Deselect node
  - `Ctrl+Z` / `Cmd+Z`: Undo
  - `Ctrl+Y` / `Cmd+Y`: Redo

## Getting Started

### Prerequisites

You'll need Node.js installed on your computer. If you don't have it, download it from [nodejs.org](https://nodejs.org/).

### Installation

1. Clone or download this repository
2. Open a terminal in the project folder
3. Install dependencies:

```bash
npm install
```

### Running the Application

Start the development server:

```bash
npm run dev
```

The application will open in your browser at `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` folder.

## How to Use

### Creating a Workflow

1. **Add Nodes**: Drag nodes from the left palette onto the canvas
2. **Connect Nodes**: Click and drag from a node's right handle to another node's left handle
3. **Configure Nodes**: Click a node to open the configuration panel on the right
4. **Run Workflow**: Click the "Run Workflow" button in the top toolbar
5. **View Results**: Check the execution log at the bottom to see what happened

### Example Workflow

Here's a simple example:

1. Add a **Start** node with payload: `{"text": "hello", "count": 5}`
2. Add a **Transform** node set to "uppercase"
3. Connect Start → Transform
4. Add another **Transform** node set to "multiply" with multiplier `2`
5. Connect Transform → Transform
6. Add an **End** node
7. Connect Transform → End
8. Run the workflow

Result: `{"text": "HELLO", "count": 10}`

### Tips

- You can connect multiple transform nodes in series to chain operations
- Each transform node can only have one input (except End nodes)
- Start nodes can only have outputs, End nodes can only have inputs
- The workflow executes from Start to End following the connections

## Project Structure

```
src/
├── components/
│   ├── nodes/          # Node type components (Start, Transform, End)
│   ├── ui/             # Reusable UI components (Button, Input, Panel)
│   └── workflow/       # Main workflow components (Canvas, Palette, Config, Logs)
├── stores/             # Pinia stores (workflow state, history)
├── services/           # Business logic (workflow engine, storage, node factory)
├── composables/        # Vue composables (keyboard shortcuts, autosave, history)
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Technologies Used

- **Vue 3** - Frontend framework
- **TypeScript** - Type safety
- **Pinia** - State management
- **Vue Flow** - Canvas and node rendering
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## Error Handling

The application includes helpful error messages:

- **String Multiplication**: If you try to multiply strings, you'll get a clear error message
- **Missing Values**: Operations that require values will tell you what's missing
- **Invalid JSON**: Start node payloads are validated
- **Circular Dependencies**: The system detects and prevents infinite loops
- **Missing Nodes**: Clear errors if required nodes (Start/End) are missing

## Browser Support

Works best in modern browsers (Chrome, Firefox, Safari, Edge). Uses localStorage for auto-save, so make sure your browser supports it.

## License

This project is private and for demonstration purposes.

---