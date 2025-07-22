import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import UserManagement from '../UserManagement';
import * as userService from '../../services/user.service';

// Mock the user service
jest.mock('../../services/user.service');

const theme = createTheme();

const MockedUserManagement = () => (
    <ThemeProvider theme={theme}>
        <BrowserRouter>
            <UserManagement />
        </BrowserRouter>
    </ThemeProvider>
);

const mockUsers = [
    {
        _id: '1',
        name: 'Dr. John Doe',
        email: 'john.doe@hospital.com',
        role: 'doctor',
        specialization: 'Cardiology',
        phoneNumber: '1234567890',
        createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
        _id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@email.com',
        role: 'patient',
        phoneNumber: '1234567891',
        createdAt: '2024-01-02T00:00:00.000Z'
    }
];

const mockStats = {
    totalUsers: 2,
    totalDoctors: 1,
    totalPatients: 1,
    newUsers: 2
};

const mockPagination = {
    currentPage: 1,
    totalPages: 1,
    totalUsers: 2,
    hasNextPage: false,
    hasPrevPage: false
};

describe('UserManagement Component', () => {
    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
        
        // Mock successful API responses
        userService.getAllUsers.mockResolvedValue({
            data: { users: mockUsers, pagination: mockPagination }
        });
        userService.getAllDoctors.mockResolvedValue({
            data: { doctors: [mockUsers[0]], pagination: mockPagination }
        });
        userService.getAllPatients.mockResolvedValue({
            data: { patients: [mockUsers[1]], pagination: mockPagination }
        });
        userService.getUserStats.mockResolvedValue({
            data: mockStats
        });
    });

    test('renders user management title', async () => {
        render(<MockedUserManagement />);
        
        await waitFor(() => {
            expect(screen.getByText('User Management')).toBeInTheDocument();
        });
    });

    test('displays user statistics', async () => {
        render(<MockedUserManagement />);
        
        await waitFor(() => {
            expect(screen.getByText('Total Users')).toBeInTheDocument();
            expect(screen.getByText('2')).toBeInTheDocument(); // Total users count
            expect(screen.getByText('Doctors')).toBeInTheDocument();
            expect(screen.getByText('Patients')).toBeInTheDocument();
        });
    });

    test('displays all users by default', async () => {
        render(<MockedUserManagement />);
        
        await waitFor(() => {
            expect(screen.getByText('Dr. John Doe')).toBeInTheDocument();
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
            expect(screen.getByText('john.doe@hospital.com')).toBeInTheDocument();
            expect(screen.getByText('jane.smith@email.com')).toBeInTheDocument();
        });
    });

    test('filters to show only doctors when doctors tab is clicked', async () => {
        render(<MockedUserManagement />);
        
        // Wait for initial load
        await waitFor(() => {
            expect(screen.getByText('Dr. John Doe')).toBeInTheDocument();
        });

        // Click on doctors tab
        const doctorsTab = screen.getByText('Doctors');
        fireEvent.click(doctorsTab);
        
        await waitFor(() => {
            expect(userService.getAllDoctors).toHaveBeenCalled();
        });
    });

    test('filters to show only patients when patients tab is clicked', async () => {
        render(<MockedUserManagement />);
        
        // Wait for initial load
        await waitFor(() => {
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        });

        // Click on patients tab
        const patientsTab = screen.getByText('Patients');
        fireEvent.click(patientsTab);
        
        await waitFor(() => {
            expect(userService.getAllPatients).toHaveBeenCalled();
        });
    });

    test('handles search functionality', async () => {
        render(<MockedUserManagement />);
        
        // Wait for initial load
        await waitFor(() => {
            expect(screen.getByText('Dr. John Doe')).toBeInTheDocument();
        });

        // Find search input and type
        const searchInput = screen.getByLabelText('Search users');
        fireEvent.change(searchInput, { target: { value: 'John' } });
        
        // Wait for API call with search parameter
        await waitFor(() => {
            expect(userService.getAllUsers).toHaveBeenCalledWith(
                expect.objectContaining({ search: 'John' })
            );
        });
    });

    test('handles role filter', async () => {
        render(<MockedUserManagement />);
        
        // Wait for initial load
        await waitFor(() => {
            expect(screen.getByText('Dr. John Doe')).toBeInTheDocument();
        });

        // Find and click role filter
        const roleFilter = screen.getByLabelText('Filter by Role');
        fireEvent.mouseDown(roleFilter);
        
        // Select doctor role
        const doctorOption = screen.getByText('Doctor');
        fireEvent.click(doctorOption);
        
        await waitFor(() => {
            expect(userService.getAllUsers).toHaveBeenCalledWith(
                expect.objectContaining({ role: 'doctor' })
            );
        });
    });

    test('displays loading state', () => {
        // Mock loading state
        userService.getAllUsers.mockReturnValue(new Promise(() => {})); // Never resolves
        userService.getUserStats.mockReturnValue(new Promise(() => {}));
        
        render(<MockedUserManagement />);
        
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    test('displays error state', async () => {
        // Mock error
        userService.getAllUsers.mockRejectedValue(new Error('Failed to fetch users'));
        userService.getUserStats.mockResolvedValue({ data: mockStats });
        
        render(<MockedUserManagement />);
        
        await waitFor(() => {
            expect(screen.getByText('Failed to fetch users')).toBeInTheDocument();
        });
    });

    test('displays no users message when list is empty', async () => {
        // Mock empty response
        userService.getAllUsers.mockResolvedValue({
            data: { users: [], pagination: { ...mockPagination, totalUsers: 0 } }
        });
        
        render(<MockedUserManagement />);
        
        await waitFor(() => {
            expect(screen.getByText('No users found')).toBeInTheDocument();
        });
    });

    test('refreshes data when refresh button is clicked', async () => {
        render(<MockedUserManagement />);
        
        // Wait for initial load
        await waitFor(() => {
            expect(screen.getByText('Dr. John Doe')).toBeInTheDocument();
        });

        // Clear previous calls
        jest.clearAllMocks();
        
        // Click refresh button
        const refreshButton = screen.getByText('Refresh');
        fireEvent.click(refreshButton);
        
        await waitFor(() => {
            expect(userService.getAllUsers).toHaveBeenCalled();
            expect(userService.getUserStats).toHaveBeenCalled();
        });
    });
});
