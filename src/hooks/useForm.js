import { useState } from 'react';

export const useForm = (initialData = {}) => {
  const [formData, setFormData] = useState(initialData);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle different input types
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name.startsWith('options[')) {
      // Handle array inputs like options[0], options[1], etc.
      const match = name.match(/\[(\d+)\]/);
      if (match && match[1]) {
        const index = parseInt(match[1], 10);
        setFormData(prev => {
          const newOptions = [...prev.options];
          newOptions[index] = value;
          return {
            ...prev,
            options: newOptions
          };
        });
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (validationRules = {}) => {
    const errors = {};
    let isValid = true;

    // If no validation rules provided, use default timetable validation
    if (Object.keys(validationRules).length === 0) {
      // Default timetable validation
      if (!formData.dayOfWeek) errors.dayOfWeek = 'Day is required';
      if (!formData.class) errors.class = 'Class is required';
      if (!formData.subject) errors.subject = 'Subject is required';
      if (!formData.teacher) errors.teacher = 'Teacher is required';
      if (!formData.startTime) errors.startTime = 'Start time is required';
      if (!formData.endTime) errors.endTime = 'End time is required';
      
      if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
        errors.endTime = 'End time must be after start time';
      }
    } else {
      // Apply custom validation rules
      Object.entries(validationRules).forEach(([field, rules]) => {
        if (rules.required && !formData[field]) {
          errors[field] = rules.message || `${field} is required`;
          isValid = false;
        }

        if (rules.minLength && formData[field]?.length < rules.minLength) {
          errors[field] = rules.message || `${field} must be at least ${rules.minLength} characters`;
          isValid = false;
        }

        if (rules.pattern && !rules.pattern.test(formData[field])) {
          errors[field] = rules.message || `${field} format is invalid`;
          isValid = false;
        }

        if (rules.custom && typeof rules.custom === 'function') {
          const customError = rules.custom(formData[field], formData);
          if (customError) {
            errors[field] = customError;
            isValid = false;
          }
        }
      });
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData(initialData);
    setFormErrors({});
  };

  return {
    formData,
    formErrors,
    isSubmitting,
    setIsSubmitting,
    handleInputChange,
    validateForm,
    resetForm
  };
};