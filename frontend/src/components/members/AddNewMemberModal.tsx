import React, { useEffect, useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { AlertCircle } from 'lucide-react';
import type { Community } from '../../types/community';
export interface NewMemberFormData {
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  race: string;
  bmi: number;
  systolicBp: number;
  diastolicBp: number;
  inpatientVisits: number;
  urgentCareVisits: number;
  standardFips: string;
  primaryCondition: string;
  communityId: string;
}

interface AddNewMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewMemberFormData) => Promise<void>;
  communities?: Community[];
  isLoading?: boolean;
}

const CONDITIONS = ['Diabetes', 'Hypertension', 'COPD', 'Asthma', 'Heart Disease', 'Obesity', 'Chronic Kidney Disease'];
const GENDERS = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' },
];

const RACE_OPTIONS = [
  { label: 'White', value: 'White' },
  { label: 'Black', value: 'Black' },
  { label: 'Hispanic', value: 'Hispanic' },
  { label: 'Asian', value: 'Asian' },
  { label: 'Native American', value: 'Native American' },
  { label: 'Pacific Islander', value: 'Pacific Islander' },
  { label: 'Multi-racial', value: 'Multi-racial' },
  { label: 'Other', value: 'Other' },
];

export const AddNewMemberModal: React.FC<AddNewMemberModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  communities = [],
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<NewMemberFormData>({
    age: 30,
    gender: 'Female',
    race: 'White',
    bmi: 25,
    systolicBp: 120,
    diastolicBp: 80,
    inpatientVisits: 0,
    urgentCareVisits: 0,
    standardFips: '01005',
    primaryCondition: 'Diabetes',
    communityId: communities[0]?.communityId || '',
  });
  useEffect(() => {
  if (
    communities.length > 0 &&
    !formData.communityId
  ) {
    const firstCommunity = communities[0];

    setFormData(prev => ({
      ...prev,
      communityId: String(firstCommunity.communityId),
      standardFips: String(firstCommunity.fips),
    }));
  }
}, [communities, formData.communityId]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.age < 18 || formData.age > 120) {
      newErrors.age = 'Age must be between 18 and 120';
    }
    if (formData.bmi < 10 || formData.bmi > 60) {
      newErrors.bmi = 'BMI must be between 10 and 60';
    }
    if (formData.systolicBp < 70 || formData.systolicBp > 250) {
      newErrors.systolicBp = 'Systolic BP must be between 70 and 250';
    }
    if (formData.diastolicBp < 40 || formData.diastolicBp > 150) {
      newErrors.diastolicBp = 'Diastolic BP must be between 40 and 150';
    }
    if (formData.inpatientVisits < 0) {
      newErrors.inpatientVisits = 'Inpatient visits cannot be negative';
    }
    if (formData.urgentCareVisits < 0) {
      newErrors.urgentCareVisits = 'Urgent care visits cannot be negative';
    }
    if (!formData.standardFips.trim()) {
      newErrors.standardFips = 'FIPS code is required';
    }
    if (!formData.communityId) {
      newErrors.communityId = 'Community selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({
        age: 30,
        gender: 'Female',
        race: 'White',
        bmi: 25,
        systolicBp: 120,
        diastolicBp: 80,
        inpatientVisits: 0,
        urgentCareVisits: 0,
        standardFips: communities[0]?.fips || '',
        primaryCondition: 'Diabetes',
        communityId: communities[0]?.communityId || '',
      });
      onClose();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to add new member');
    }
  };

  const handleInputChange = (field: keyof NewMemberFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

const communityOptions = communities.map(c => ({
  label: c.name,
  value: c.communityId,
}));
  const conditionOptions = CONDITIONS.map(c => ({
    label: c,
    value: c,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Member"
      maxWidth="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isLoading}>
            Add Member
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        {submitError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Age *
            </label>
            <Input
              type="number"
              min="18"
              max="120"
              value={formData.age}
              onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
              error={errors.age}
              placeholder="e.g., 52"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Gender *
            </label>
            <Select
              options={GENDERS}
              value={formData.gender}
              onChange={(event) =>
                handleInputChange('gender', event.target.value)
              }
            />
          </div>

          {/* Race */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Race/Ethnicity *
            </label>
            <Select
              options={RACE_OPTIONS}
              value={formData.race}
              onChange={(event) =>
              handleInputChange('race', event.target.value)
            }
            />
          </div>

          {/* BMI */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              BMI *
            </label>
            <Input
              type="number"
              step="0.1"
              min="10"
              max="60"
              value={formData.bmi}
              onChange={(e) => handleInputChange('bmi', parseFloat(e.target.value))}
              error={errors.bmi}
              placeholder="e.g., 33.4"
            />
          </div>

          {/* Systolic BP */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Systolic BP (mmHg) *
            </label>
            <Input
              type="number"
              min="70"
              max="250"
              value={formData.systolicBp}
              onChange={(e) => handleInputChange('systolicBp', parseInt(e.target.value))}
              error={errors.systolicBp}
              placeholder="e.g., 148"
            />
          </div>

          {/* Diastolic BP */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Diastolic BP (mmHg) *
            </label>
            <Input
              type="number"
              min="40"
              max="150"
              value={formData.diastolicBp}
              onChange={(e) => handleInputChange('diastolicBp', parseInt(e.target.value))}
              error={errors.diastolicBp}
              placeholder="e.g., 92"
            />
          </div>

          {/* Inpatient Visits */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Inpatient Visits (12m) *
            </label>
            <Input
              type="number"
              min="0"
              value={formData.inpatientVisits}
              onChange={(e) => handleInputChange('inpatientVisits', parseInt(e.target.value))}
              error={errors.inpatientVisits}
              placeholder="e.g., 1"
            />
          </div>

          {/* Urgent Care Visits */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Urgent Care Visits (12m) *
            </label>
            <Input
              type="number"
              min="0"
              value={formData.urgentCareVisits}
              onChange={(e) => handleInputChange('urgentCareVisits', parseInt(e.target.value))}
              error={errors.urgentCareVisits}
              placeholder="e.g., 4"
            />
          </div>

          {/* FIPS Code */}
          <div>
  <label className="block text-sm font-medium text-slate-700 mb-1.5">
    FIPS Code
  </label>

  <Input
    type="text"
    value={formData.standardFips}
    readOnly
    disabled
    placeholder="Select a community"
  />

  <p className="text-xs text-slate-400 mt-1">
    Automatically assigned from the selected community.
  </p>
</div>

          {/* Primary Condition */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Primary Condition *
            </label>
            <Select
              options={conditionOptions}
              value={formData.primaryCondition}
              onChange={(event) =>
                handleInputChange('primaryCondition', event.target.value)
              }
            />
          </div>

          {/* Community */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Community *
            </label>
            <Select
  options={communityOptions}
  value={formData.communityId}
  onChange={(event) => {
    const selectedCommunity = communities.find(
      community =>
        String(community.communityId) === event.target.value
    );

    setFormData(prev => ({
      ...prev,
      communityId: event.target.value,
      standardFips: selectedCommunity
        ? String(selectedCommunity.fips)
        : '',
    }));

    if (errors.communityId) {
      setErrors(prev => ({
        ...prev,
        communityId: '',
      }));
    }

    if (errors.standardFips) {
      setErrors(prev => ({
        ...prev,
        standardFips: '',
      }));
    }
  }}
  error={errors.communityId}
/>
          </div>
        </div>
      </form>
    </Modal>
  );
};
