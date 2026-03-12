import { EmployeeMasterData } from '../types/employee';

/**
 * Flattens nested EmployeeMasterData into a single level object for CSV export
 */
export const flattenEmployee = (employee: EmployeeMasterData) => {
    return {
        'Surname': employee.personal.surname,
        'Name': employee.personal.name,
        'Father Name': employee.personal.fatherName,
        'Mother Name': employee.personal.motherName,
        'Nationality': employee.personal.nationality,
        'Religion': employee.personal.religion,
        'DOJ': employee.employment.doj,
        'Designation': employee.employment.designation,
        'Department': employee.employment.department,
        'Personal Number': employee.contact.personalNumber,
        'Alternate Contact Number': employee.contact.alternateContactNumber,
        'Pan No': employee.kyc.panNo,
        'Personal Mail ID': employee.contact.personalEmail,
        'Emp No': employee.employment.empNo,
        'Branch': employee.employment.branch,
        'Official Mail ID': employee.contact.officialEmail,
        'Reporting manager': employee.employment.reportingManager,
        'Rolls': employee.employment.rolls,
        'Present Address': employee.contact.presentAddress,
        'Permanent Address': employee.contact.permanentAddress,
        'Date of Birth': employee.personal.dob,
        'Gender': employee.personal.gender,
        'Marital Status': employee.personal.maritalStatus,
        'Blood Group': employee.personal.bloodGroup,
        'Bank Name': employee.bank.bankName,
        'Bank Account No': employee.bank.accountNo,
        'Bank Branch': employee.bank.branch,
        'IFSC Code': employee.bank.ifscCode
    };
};

/**
 * Unflattens a single level object (from CSV) back into EmployeeMasterData
 */
export const unflattenEmployee = (flatData: any): EmployeeMasterData => {
    return {
        personal: {
            surname: flatData['Surname'] || '',
            name: flatData['Name'] || '',
            fatherName: flatData['Father Name'] || '',
            motherName: flatData['Mother Name'] || '',
            nationality: (flatData['Nationality'] as any) || 'Indian',
            religion: flatData['Religion'] || '',
            dob: flatData['Date of Birth'] || flatData['DOB'] || '',
            gender: (flatData['Gender'] as any) || 'Male',
            maritalStatus: (flatData['Marital Status'] as any) || 'Single',
            physicalDisabilities: 'None',
            bloodGroup: flatData['Blood Group'] || '',
        },
        contact: {
            personalNumber: flatData['Personal Number'] || '',
            alternateContactNumber: flatData['Alternate Contact Number'] || '',
            personalEmail: flatData['Personal Mail ID'] || '',
            officialEmail: flatData['Official Mail ID'] || '',
            presentAddress: flatData['Present Address'] || '',
            permanentAddress: flatData['Permanent Address'] || '',
            permanentAddressContactNumber: '',
        },
        kyc: {
            panNo: flatData['Pan No'] || '',
            aadharNo: flatData['Aadhar No'] || '',
            drivingLicenseNo: '',
        },
        employment: {
            empNo: flatData['Emp No'] || '',
            doj: flatData['DOJ'] || '',
            designation: flatData['Designation'] || '',
            department: flatData['Department'] || '',
            branch: flatData['Branch'] || '',
            reportingManager: flatData['Reporting manager'] || '',
            rolls: (flatData['Rolls'] as any) || 'On Roll',
        },
        bank: {
            bankName: flatData['Bank Name'] || '',
            accountNo: flatData['Bank Account No'] || '',
            branch: flatData['Bank Branch'] || '',
            ifscCode: flatData['IFSC Code'] || '',
        },
        education: [],
        experience: [],
        family: [],
        emergency: [],
        medical: {
            allergic: '',
            bloodPressure: '',
            sugar: '',
            eyeSight: '',
            majorIllness: '',
        },
        languages: {
            telugu: false,
            english: false,
            hindi: false,
        }
    };
};
