import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as NodeCache from 'node-cache';
import { ApiResponse, User } from '../interfaces/user.interface';
import { DepartmentData } from '../interfaces/department-data.interface';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private readonly cache = new NodeCache({ stdTTL: 600 });
  private readonly API_URL = 'https://dummyjson.com/users';

  /**
   * Fetches all users from the API
   * @returns Promise<User[]>
   */
  async getAllUsers(): Promise<User[]> {
    try {
    
      const cachedUsers = this.cache.get<User[]>('users');
      if (cachedUsers) {
        this.logger.log('Retrieved users from cache');
        return cachedUsers;
      }

     
      const response = await axios.get<ApiResponse>(`${this.API_URL}?limit=100`);
      const users = response.data.users;
      
      
      this.cache.set('users', users);
      
      return users;
    } catch (error) {
      this.logger.error(`Failed to fetch users: ${error.message}`);
      throw error;
    }
  }

  /**
   * Transforms user data and groups by department
   * @returns Promise<DepartmentData>
   */
  async getUsersByDepartment(): Promise<DepartmentData> {
    const users = await this.getAllUsers();
    

    const departmentMap = new Map<string, {
      male: number;
      female: number;
      minAge: number;
      maxAge: number;
      hairColors: Map<string, number>;
      addressUsers: Map<string, string>;
    }>();


    for (const user of users) {
      const department = user.company.department;
      
      if (!departmentMap.has(department)) {
        departmentMap.set(department, {
          male: 0,
          female: 0,
          minAge: Infinity,
          maxAge: -Infinity,
          hairColors: new Map<string, number>(),
          addressUsers: new Map<string, string>()
        });
      }
      
      const deptData = departmentMap.get(department)!;
      

      if (user.gender === 'male') {
        deptData.male += 1;
      } else if (user.gender === 'female') {
        deptData.female += 1;
      }
      

      deptData.minAge = Math.min(deptData.minAge, user.age);
      deptData.maxAge = Math.max(deptData.maxAge, user.age);
      

      const hairColor = user.hair.color;
      deptData.hairColors.set(
        hairColor,
        (deptData.hairColors.get(hairColor) || 0) + 1
      );
      
   
      const fullName = `${user.firstName}${user.lastName}`;
      deptData.addressUsers.set(fullName, user.address.postalCode);
    }

    const result: DepartmentData = {};
    
    departmentMap.forEach((data, department) => {
      const hairColors: { [color: string]: number } = {};
      data.hairColors.forEach((count, color) => {
        hairColors[color] = count;
      });
      
      const addressUsers: { [name: string]: string } = {};
      data.addressUsers.forEach((postalCode, name) => {
        addressUsers[name] = postalCode;
      });
      
      result[department] = {
        male: data.male,
        female: data.female,
        ageRange: `${data.minAge}-${data.maxAge}`,
        hair: hairColors,
        addressUser: addressUsers
      };
    });
    
    return result;
  }
}