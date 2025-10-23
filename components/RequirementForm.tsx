import React from 'react';
import type { EnquiryFormData } from '../types';
import EnquiryForm from './EnquiryForm';

interface RequirementFormProps {
  onFormSubmit: (analysis: EnquiryFormData) => void;
}

const RequirementForm: React.FC<RequirementFormProps> = ({ onFormSubmit }) => {
  return (
    <EnquiryForm 
      onFormSubmit={onFormSubmit}
    />
  );
};

export default RequirementForm;