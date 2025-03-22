export interface DepartmentData {
  [department: string]: {
    male: number;
    female: number;
    ageRange: string;
    hair: {
      [color: string]: number;
    };
    addressUser: {
      [key: string]: string;
    };
  };
} 