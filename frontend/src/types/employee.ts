export type Gender = 'Male' | 'Female' | 'Other';
export type MaritalStatus = 'Single' | 'Married' | 'Divorced' | 'Widowed';
export type Nationality = 'Indian' | 'Foreign National';
export type EmploymentRolls = 'Off roll' | 'On Roll' | 'railway' | 'Contract';

export interface EmployeePersonalDetails {
  surname: string;
  name: string; // This is the first name
  fatherName: string;
  motherName: string;
  nationality: Nationality;
  religion: string;
  dob: string;
  gender: Gender;
  maritalStatus: MaritalStatus;
  dateOfMarriage?: string;
  physicalDisabilities: string;
  bloodGroup: string;
}

export interface EmployeeContactDetails {
  personalNumber: string;
  alternateContactNumber: string;
  personalEmail: string;
  officialEmail: string;
  presentAddress: string;
  permanentAddress: string;
  permanentAddressContactNumber: string;
}

export interface EmployeeKYCDetails {
  panNo: string;
  aadharNo: string;
  drivingLicenseNo?: string;
}

export interface EmployeeEmploymentDetails {
  empNo: string;
  doj: string;
  designation: string;
  department: string;
  branch: string;
  reportingManager: string;
  rolls: string; // Changed from enum for flexibility
}

export interface EmployeeBankDetails {
  bankName: string;
  accountNo: string;
  branch: string;
  ifscCode: string;
}

export interface Qualification {
  qualification: string;
  boardUniversityAddress: string;
  specialization: string;
  yearOfPassing: string;
}

export interface Experience {
  employerName: string;
  designation: string;
  periodFrom: string;
  periodTo: string;
  periodTotal: string;
  jobDescription: string;
  salary: string;
  referenceName: string;
  referenceMobile: string;
}

export interface FamilyMember {
  name: string;
  relationship: string;
  dob: string;
  occupation: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  address: string;
  mobile: string;
}

export interface MedicalDetails {
  allergic: string;
  bloodPressure: string;
  sugar: string;
  eyeSight: string;
  majorIllness: string;
}

export interface LanguageSkills {
  telugu: boolean;
  english: boolean;
  hindi: boolean;
}

export interface EmployeeDocuments {
  photo?: string;
  aadhaarCard?: string;
  panCard?: string;
  resume?: string; // This will also be used for Bio-Data
  bioData?: string; // Re-adding for clarity if needed
  familyPhoto?: string;
  educationalCertificates?: string;
  technicalCertificates?: string | string[];
  bankStatement?: string;
  docSizes?: { [key: string]: string };
}

export interface EmployeeTrainingDetails {
  cumminsTrainingType: 'LHP' | 'MHP' | 'HHP' | '';
  trainingStartDate?: string;
  trainingEndDate?: string;
  trainingResult?: 'Qualified' | 'Not Qualified' | '';
  cumminsTrainingCompletionId?: string;
  trainingCertificate?: string;
  trainingCertificateSize?: string;
  trainingCompletedDate?: string;
}

export interface EmployeeMasterData {
  id?: string; // System generated
  createdDate?: string; // System generated
  createdBy?: string; // Role of creator
  personal: EmployeePersonalDetails;
  contact: EmployeeContactDetails;
  employment: EmployeeEmploymentDetails;
  kyc: EmployeeKYCDetails;
  bank: EmployeeBankDetails;
  education: Qualification[];
  experience: Experience[];
  family: FamilyMember[];
  emergency: EmergencyContact[];
  medical: MedicalDetails;
  languages: LanguageSkills;
  documents?: EmployeeDocuments;
  training?: EmployeeTrainingDetails;
}
