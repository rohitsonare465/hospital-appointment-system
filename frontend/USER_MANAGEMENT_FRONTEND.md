# User Management Feature - Frontend Documentation

## Overview
The User Management feature provides a comprehensive interface to view and manage all users (doctors and patients) in the Hospital Appointment System. It includes role-based tabs, search functionality, pagination, and responsive design.

## Components

### UserManagement Component
**Location:** `src/components/UserManagement.js`

The main component that provides the user management interface.

#### Features:
- **Tabbed Interface**: Separate tabs for All Users, Doctors, and Patients
- **Search Functionality**: Real-time search across multiple fields
- **Pagination**: Efficient pagination with page controls
- **Statistics Dashboard**: Overview cards showing user counts
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Proper error states and user feedback
- **Loading States**: Visual feedback during API calls

#### Props:
This is a standalone component with no required props.

#### State Management:
- `users`: Array of current users displayed
- `stats`: User statistics object
- `loading`: Loading state for main content
- `error`: Error message string
- `currentTab`: Currently active tab (0: All, 1: Doctors, 2: Patients)
- `searchTerm`: Current search query
- `roleFilter`: Role filter for All Users tab
- `currentPage`: Current pagination page
- `pagination`: Pagination metadata

## Services

### User Service
**Location:** `src/services/user.service.js`

Handles all API communication for user management.

#### Functions:

##### `getAllUsers(params)`
Fetches all users with optional filtering and pagination.
```javascript
const response = await getAllUsers({
  role: 'doctor',
  search: 'cardiology',
  page: 1,
  limit: 10
});
```

##### `getAllDoctors(params)`
Fetches all doctors with optional searching and pagination.
```javascript
const response = await getAllDoctors({
  search: 'John',
  page: 1,
  limit: 8
});
```

##### `getAllPatients(params)`
Fetches all patients with optional searching and pagination.
```javascript
const response = await getAllPatients({
  search: 'Smith',
  page: 2,
  limit: 8
});
```

##### `getUserStats()`
Fetches user statistics for dashboard display.
```javascript
const stats = await getUserStats();
// Returns: { totalUsers, totalDoctors, totalPatients, newUsers }
```

##### `getUserById(id)`
Fetches detailed information about a specific user.
```javascript
const user = await getUserById('60f7b1b3b3b3b3b3b3b3b3b3');
```

## UI Components Used

### Material-UI Components:
- `Container`: Main layout container
- `Paper`: Card-like containers with elevation
- `Typography`: Text display with various variants
- `Box`: Flexible container for layouts
- `Button`: Action buttons
- `Card` & `CardContent`: Statistics cards
- `Grid`: Responsive grid layout
- `Table` components: Data display table
- `TextField`: Search input with icons
- `Select` & `FormControl`: Dropdown filters
- `Chip`: Role badges
- `Pagination`: Page navigation
- `Alert`: Error message display
- `CircularProgress`: Loading indicators
- `Avatar`: User profile pictures/initials
- `Tabs` & `Tab`: Tabbed interface
- `IconButton`: Action buttons with icons
- `Tooltip`: Hover information

### Icons Used:
- `Search`: Search functionality
- `Person`: General user representation
- `LocalHospital`: Doctor representation
- `PersonOutline`: Patient representation
- `Refresh`: Data refresh action
- `Visibility`: View user details

## Routing

### Route Configuration
The UserManagement component is accessible via the `/users` route:

```javascript
<Route path="/users" element={<UserManagement />} />
```

### Navigation
Users can navigate to the User Management page from:
- Dashboard quick actions
- Direct URL access (requires authentication)

## Styling

### Theme Integration
The component uses Material-UI's theme system for consistent styling:
- Primary colors for doctor-related elements
- Secondary colors for patient-related elements
- Consistent spacing and typography

### Responsive Design
- Mobile-first approach
- Responsive grid layout
- Adaptive table display
- Touch-friendly interface elements

## Data Flow

1. **Component Mount**: Loads initial user data and statistics
2. **Tab Selection**: Filters data based on selected tab
3. **Search Input**: Triggers API call with search parameters
4. **Pagination**: Updates data based on page selection
5. **Refresh Action**: Reloads all data from API

## Error Handling

### API Errors
- Network errors display user-friendly messages
- Authentication errors redirect to login
- Server errors show generic error message

### User Feedback
- Loading states during API calls
- Success/error alerts for actions
- Empty state messaging when no data

## Performance Optimizations

- **Debounced Search**: Prevents excessive API calls
- **Pagination**: Reduces data load and improves performance
- **Conditional Rendering**: Only renders necessary components
- **Memoization**: Prevents unnecessary re-renders

## Accessibility

- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels
- **Focus Management**: Logical tab order
- **Color Contrast**: Meets WCAG guidelines

## Testing

### Test Files
- **Unit Tests**: `src/components/__tests__/UserManagement.test.js`
- **Integration Tests**: Covered in backend API tests

### Test Coverage
- Component rendering
- User interactions (tabs, search, pagination)
- API integration
- Error handling
- Loading states
- Empty states

## Usage Example

```javascript
import React from 'react';
import UserManagement from './components/UserManagement';

function App() {
  return (
    <div className="App">
      <UserManagement />
    </div>
  );
}
```

## Future Enhancements

1. **User Details Modal**: Detailed view in a modal
2. **User Actions**: Edit/delete user functionality  
3. **Export Functionality**: Export user lists to CSV/PDF
4. **Advanced Filters**: More filtering options
5. **Bulk Actions**: Select and act on multiple users
6. **Real-time Updates**: WebSocket integration for live data
7. **User Profile Images**: Avatar image upload/display
