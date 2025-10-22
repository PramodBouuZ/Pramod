import React from 'react';
import type { BANTAnalysis, User } from '../types';
import ConversationalEnquiryForm from './ConversationalEnquiryForm';

interface RequirementFormProps {
  onFormSubmit: (analysis: BANTAnalysis) => void;
  user: User | null;
}

const RequirementForm: React.FC<RequirementFormProps> = ({ onFormSubmit, user }) => {
  return (
    <ConversationalEnquiryForm 
      onFormSubmit={onFormSubmit}
      user={user}
      isHomePage={false}
    />
  );
};

export default RequirementForm;