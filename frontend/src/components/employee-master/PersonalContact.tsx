import React from 'react';
import { EmployeePersonalDetails, EmployeeContactDetails, Nationality, Gender, MaritalStatus } from '../../types/employee';

interface Props {
    personal: EmployeePersonalDetails;
    contact: EmployeeContactDetails;
    updatePersonal: (data: Partial<EmployeePersonalDetails>) => void;
    updateContact: (data: Partial<EmployeeContactDetails>) => void;
}

const PersonalContact: React.FC<Props> = ({ personal, contact, updatePersonal, updateContact }) => {
    return (
        <div className="form-section">
            <h3 className="section-title">Personal Details</h3>
            <div className="form-grid">
                <div className="form-group">
                    <label>Surname</label>
                    <input type="text" value={personal.surname} onChange={(e) => updatePersonal({ surname: e.target.value })} placeholder="Enter Surname" />
                </div>
                <div className="form-group">
                    <label>Name (First Name)</label>
                    <input type="text" value={personal.name} onChange={(e) => updatePersonal({ name: e.target.value })} placeholder="Enter First Name" />
                </div>
                <div className="form-group">
                    <label>Father Name</label>
                    <input type="text" value={personal.fatherName} onChange={(e) => updatePersonal({ fatherName: e.target.value })} placeholder="Enter Father Name" />
                </div>
                <div className="form-group">
                    <label>Mother Name</label>
                    <input type="text" value={personal.motherName} onChange={(e) => updatePersonal({ motherName: e.target.value })} placeholder="Enter Mother Name" />
                </div>
                <div className="form-group">
                    <label>Nationality</label>
                    <select value={personal.nationality} onChange={(e) => updatePersonal({ nationality: e.target.value as Nationality })}>
                        <option value="Indian">Indian</option>
                        <option value="Foreign National">Foreign National</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Religion</label>
                    <input type="text" value={personal.religion} onChange={(e) => updatePersonal({ religion: e.target.value })} placeholder="Enter Religion" />
                </div>
                <div className="form-group">
                    <label>Date of Birth</label>
                    <input type="date" value={personal.dob} onChange={(e) => updatePersonal({ dob: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>Gender</label>
                    <select value={personal.gender} onChange={(e) => updatePersonal({ gender: e.target.value as Gender })}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Marital Status</label>
                    <select value={personal.maritalStatus} onChange={(e) => updatePersonal({ maritalStatus: e.target.value as MaritalStatus })}>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                    </select>
                </div>
                {personal.maritalStatus === 'Married' && (
                    <div className="form-group">
                        <label>Date of Marriage</label>
                        <input type="date" value={personal.dateOfMarriage} onChange={(e) => updatePersonal({ dateOfMarriage: e.target.value })} />
                    </div>
                )}
                <div className="form-group">
                    <label>Physical Disabilities</label>
                    <input type="text" value={personal.physicalDisabilities} onChange={(e) => updatePersonal({ physicalDisabilities: e.target.value })} placeholder="Specify if any, else None" />
                </div>
                <div className="form-group">
                    <label>Blood Group</label>
                    <input type="text" value={personal.bloodGroup} onChange={(e) => updatePersonal({ bloodGroup: e.target.value })} placeholder="e.g. O+" />
                </div>
            </div>

            <h3 className="section-title" style={{ marginTop: '30px' }}>Contact Details</h3>
            <div className="form-grid">
                <div className="form-group">
                    <label>Personal Mobile Number</label>
                    <input type="tel" value={contact.personalNumber} onChange={(e) => updateContact({ personalNumber: e.target.value })} placeholder="Enter Mobile No" />
                </div>
                <div className="form-group">
                    <label>Alternate Contact Number</label>
                    <input type="tel" value={contact.alternateContactNumber} onChange={(e) => updateContact({ alternateContactNumber: e.target.value })} placeholder="Enter Alternate No" />
                </div>
                <div className="form-group">
                    <label>Personal Email ID</label>
                    <input type="email" value={contact.personalEmail} onChange={(e) => updateContact({ personalEmail: e.target.value })} placeholder="Enter Email" />
                </div>
                <div className="form-group">
                    <label>Official Email ID</label>
                    <input type="email" value={contact.officialEmail} onChange={(e) => updateContact({ officialEmail: e.target.value })} placeholder="Enter Office Email" />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Present Address</label>
                    <textarea rows={3} value={contact.presentAddress} onChange={(e) => updateContact({ presentAddress: e.target.value })} placeholder="Enter Present Address"></textarea>
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Permanent Address</label>
                    <textarea rows={3} value={contact.permanentAddress} onChange={(e) => updateContact({ permanentAddress: e.target.value })} placeholder="Enter Permanent Address"></textarea>
                </div>
                <div className="form-group">
                    <label>Permanent Address Contact Number</label>
                    <input type="tel" value={contact.permanentAddressContactNumber} onChange={(e) => updateContact({ permanentAddressContactNumber: e.target.value })} placeholder="Enter Contact No" />
                </div>
            </div>
        </div>
    );
};

export default PersonalContact;
