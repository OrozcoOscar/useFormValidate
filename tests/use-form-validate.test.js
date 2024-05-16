import { renderHook, act } from '@testing-library/react';
import useFormValidate from '../useFormValidate';

describe('useFormValidate', () => {
    test('validates required fields', () => {
      const { result } = renderHook(() => useFormValidate());
  
      // Trigger validation with empty values for required fields
      act(() => {
        result.current.validate('username', '', { required: true });
        result.current.validate('password', '', { required: true });
        result.current.validate('email', '', { required: true, email: true });
      });
  
      // Assert error messages for required fields
      expect(result.current.getFieldError('username')).toBe(result.current.customErrorMessages.is_required);
      expect(result.current.getFieldError('password')).toBe(result.current.customErrorMessages.is_required);
      expect(result.current.getFieldError('email')).toBe(result.current.customErrorMessages.invalid_email);
    });


    test('validates phone number format', () => {
      const { result } = renderHook(() => useFormValidate());
  
      // Trigger validation with an invalid phone number format
      act(() => {
        result.current.validate('phoneNumber', '', {required:true, phone: true });
      });
      // Assert error message for invalid phone number format
      expect(result.current.getFieldError('phoneNumber')).toBe(result.current.customErrorMessages.invalid_phone);
    });
    
    test('resetForm should reset inputs and errors', () => {
      // Arrange
      const { result } = renderHook(() => useFormValidate());
  
      // Act: Realiza algunas interacciones, como llenar campos y establecer errores
      act(() => {
        result.current.updateInput('field1', { value: 'someValue', rules: {} });
        result.current.setError('field2', 'Some error message');
      });
  
      // Act: Resetea el formulario
      act(() => {
        result.current.resetForm();
      });
  
      // Assert: Verifica que los inputs y errores se hayan restablecido después del reset
      expect(result.current.inputs).toEqual({});
      expect(result.current.errors).toEqual({});
    });

    // //validates checkbox and radio
    test('validates checkbox and radio', () => {
      const { result } = renderHook(() => useFormValidate());
  
      // Trigger validation with empty values for required fields
      act(() => {
        result.current.validate('checkbox', '', { required: true,checkbox: true});
        result.current.validate('radio', '', { required: true,radio: true});
      });
  
      // Assert error messages for required fields
      expect(result.current.getFieldError('checkbox')).toBe(result.current.customErrorMessages.is_type_checkbox);
      expect(result.current.getFieldError('radio')).toBe(result.current.customErrorMessages.is_type_radio);
    });

  
});
