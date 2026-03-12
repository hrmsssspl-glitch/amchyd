import { EmployeeMasterData } from '../types/employee';

const STORAGE_KEY = 'hrms_employees';

const INITIAL_EMPLOYEES: EmployeeMasterData[] = [
    {
        id: 'EMP001',
        createdDate: '2025-01-01',
        createdBy: 'superadmin',
        personal: {
            surname: 'Kumar',
            name: 'Ramesh',
            fatherName: 'Venkatesh Kumar',
            motherName: 'Lakshmi Kumar',
            nationality: 'Indian',
            religion: 'Hinduism',
            dob: '1985-06-15',
            gender: 'Male',
            maritalStatus: 'Married',
            physicalDisabilities: 'None',
            bloodGroup: 'B+'
        },
        contact: {
            personalNumber: '9988776655',
            alternateContactNumber: '9988776644',
            personalEmail: 'ramesh@example.com',
            officialEmail: 'ramesh.k@company.com',
            presentAddress: 'Flat 101, Residency, Hyderabad',
            permanentAddress: 'Vijayawada, AP',
            permanentAddressContactNumber: '9988776655'
        },
        kyc: {
            panNo: 'ABCDE1234F',
            aadharNo: '123412341234',
            drivingLicenseNo: 'DL-12345'
        },
        employment: {
            empNo: 'EMP001',
            doj: '2023-01-10',
            designation: 'Regional Sales Manager',
            department: 'SALES DEPARTMENT',
            branch: 'Hyderabad',
            reportingManager: 'Sales Head',
            rolls: 'On Roll'
        },
        bank: {
            bankName: 'SBI',
            accountNo: '300012345678',
            branch: 'Hitech City',
            ifscCode: 'SBIN0012345'
        },
        education: [
            { qualification: 'M.B.A', boardUniversityAddress: 'OU, Hyderabad', specialization: 'Marketing', yearOfPassing: '2010' }
        ],
        experience: [
            { employerName: 'Tech Corp', designation: 'Sales Executive', periodFrom: '2010-01-01', periodTo: '2022-12-31', periodTotal: '12 Years', jobDescription: 'Managed regional sales', salary: '12,00,000', referenceName: 'Manager X', referenceMobile: '9988776655' }
        ],
        family: [],
        emergency: [],
        medical: { allergic: 'None', bloodPressure: 'Normal', sugar: 'Normal', eyeSight: 'Normal', majorIllness: 'None' },
        languages: { telugu: true, english: true, hindi: true }
    }
];

export const employeeStorage = {
    getEmployees: (): EmployeeMasterData[] => {
        const stored = localStorage.getItem(STORAGE_KEY);
        // We try to catch parsing errors or structure changes by re-initializing if needed (for dev)
        try {
            return stored ? JSON.parse(stored) : INITIAL_EMPLOYEES;
        } catch (e) {
            return INITIAL_EMPLOYEES;
        }
    },

    saveEmployees: (employees: EmployeeMasterData[]) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    },

    addEmployee: (employee: EmployeeMasterData) => {
        const employees = employeeStorage.getEmployees();
        const updated = [...employees, employee];
        employeeStorage.saveEmployees(updated);
    },

    initialize: () => {
        if (!localStorage.getItem(STORAGE_KEY)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EMPLOYEES));
        }
    }
};
