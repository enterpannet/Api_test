import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import axios from 'axios';
import { DepartmentData } from '../interfaces/department-data.interface';
import { User } from '../interfaces/user.interface';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('UserService', () => {
  let service: UserService;

  const mockUsers = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      maidenName: '',
      age: 30,
      gender: 'male',
      email: 'john@example.com',
      hair: { color: 'Black', type: 'Straight' },
      address: {
        address: '123 Main St',
        city: 'Anytown',
        coordinates: { lat: 0, lng: 0 },
        postalCode: '12345',
        state: 'CA',
      },
      company: {
        address: {
          address: '456 Corp St',
          city: 'Business City',
          coordinates: { lat: 0, lng: 0 },
          postalCode: '54321',
          state: 'NY',
        },
        department: 'Engineering',
        name: 'TechCorp',
        title: 'Developer',
      },
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      maidenName: '',
      age: 28,
      gender: 'female',
      email: 'jane@example.com',
      hair: { color: 'Brown', type: 'Curly' },
      address: {
        address: '789 Oak Ave',
        city: 'Sometown',
        coordinates: { lat: 0, lng: 0 },
        postalCode: '67890',
        state: 'WA',
      },
      company: {
        address: {
          address: '555 Biz Blvd',
          city: 'Commerce City',
          coordinates: { lat: 0, lng: 0 },
          postalCode: '98765',
          state: 'CA',
        },
        department: 'Marketing',
        name: 'BrandCo',
        title: 'Manager',
      },
    },
    {
      id: 3,
      firstName: 'Alex',
      lastName: 'Johnson',
      maidenName: '',
      age: 35,
      gender: 'male',
      email: 'alex@example.com',
      hair: { color: 'Blond', type: 'Wavy' },
      address: {
        address: '321 Pine St',
        city: 'Othertown',
        coordinates: { lat: 0, lng: 0 },
        postalCode: '54321',
        state: 'TX',
      },
      company: {
        address: {
          address: '999 Corp Rd',
          city: 'Enterprise City',
          coordinates: { lat: 0, lng: 0 },
          postalCode: '11111',
          state: 'FL',
        },
        department: 'Engineering',
        name: 'TechCorp',
        title: 'Senior Developer',
      },
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    
    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should fetch users from API and cache them', async () => {
      // Mock API response
      mockedAxios.get.mockResolvedValueOnce({
        data: { users: mockUsers, total: 3, skip: 0, limit: 100 }
      });

      const result = await service.getAllUsers();
      
      expect(result).toEqual(mockUsers);
      expect(mockedAxios.get).toHaveBeenCalledWith('https://dummyjson.com/users?limit=100');
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      
      // Call again to test cache
      const cachedResult = await service.getAllUsers();
      expect(cachedResult).toEqual(mockUsers);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1); // Should not call API again
    });

    it('should handle API errors', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));
      
      await expect(service.getAllUsers()).rejects.toThrow('API Error');
    });
  });

  describe('getUsersByDepartment', () => {
    it('should transform users by department correctly', async () => {
      // Mock getAllUsers to return our test data
      jest.spyOn(service, 'getAllUsers').mockResolvedValueOnce(mockUsers as User[]);
      
      const result = await service.getUsersByDepartment();
      
      // Check expected result structure
      expect(result).toHaveProperty('Engineering');
      expect(result).toHaveProperty('Marketing');
      
      // Check Engineering department data
      expect(result.Engineering.male).toBe(2);
      expect(result.Engineering.female).toBe(0);
      expect(result.Engineering.ageRange).toBe('30-35');
      expect(result.Engineering.hair).toEqual({ Black: 1, Blond: 1 });
      expect(result.Engineering.addressUser).toEqual({
        JohnDoe: '12345',
        AlexJohnson: '54321'
      });
      
      // Check Marketing department data
      expect(result.Marketing.male).toBe(0);
      expect(result.Marketing.female).toBe(1);
      expect(result.Marketing.ageRange).toBe('28-28');
      expect(result.Marketing.hair).toEqual({ Brown: 1 });
      expect(result.Marketing.addressUser).toEqual({
        JaneSmith: '67890'
      });
    });
    
    it('should handle empty user data', async () => {
      jest.spyOn(service, 'getAllUsers').mockResolvedValueOnce([]);
      
      const result = await service.getUsersByDepartment();
      
      // Should return empty object
      expect(result).toEqual({});
    });
  });
}); 