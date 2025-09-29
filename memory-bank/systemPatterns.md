# System Patterns

## Architecture
- React-based Single Page Application (SPA)
- Component-driven development using shadcn/ui
- Client-side routing with React Router
- State management with React hooks

## Design Patterns
1. Component Patterns
   - Composable UI components
   - Container/Presenter pattern
   - Higher-order components for shared functionality

2. Routing Patterns
   - Protected routes for authenticated areas
   - Layout-based routing
   - Dynamic route parameters

3. State Management
   - Local state with useState
   - Context API for global state
   - Custom hooks for reusable logic

## Component Relationships
- Pages contain multiple UI components
- Shared components in ui/ directory
- Custom hooks separate business logic
- Layout components for consistent structure

## Data Flow
- Top-down props passing
- Context for global state
- Event handlers for user interactions
- Async operations for API calls