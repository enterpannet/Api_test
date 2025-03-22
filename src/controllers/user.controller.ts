import { Controller, Get, Logger, Param, NotFoundException } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user.interface';
import { DepartmentData } from '../interfaces/department-data.interface';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    this.logger.log('GET /users - Fetching all users');
    return this.userService.getAllUsers();
  }

  @Get('by-department')
  async getUsersByDepartment(): Promise<DepartmentData> {
    this.logger.log('GET /users/by-department - Fetching users grouped by department');
    return this.userService.getUsersByDepartment();
  }

  @Get('departments/:department')
  async getUsersBySpecificDepartment(@Param('department') department: string) {
    this.logger.log(`GET /users/departments/${department} - Fetching users for specific department`);
    const allDepartments = await this.userService.getUsersByDepartment();
    
    if (!allDepartments[department]) {
      throw new NotFoundException(`Department '${department}' not found`);
    }
    
    return allDepartments[department];
  }
} 