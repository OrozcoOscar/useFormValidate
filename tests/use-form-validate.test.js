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
      expect(result.current.getFieldError('username')).toBe('Campo obligatorio');
      expect(result.current.getFieldError('password')).toBe('Campo obligatorio');
      expect(result.current.getFieldError('email')).toBe('Campo obligatorio');
    });
  
    test('validates email format', () => {
      const { result } = renderHook(() => useFormValidate());
  
      // Trigger validation with invalid email format
      act(() => {
        result.current.validate('email', 'invalidEmail', { email: true });
      });
  
      // Assert error message for invalid email format
      expect(result.current.getFieldError('email')).toBe('Ingrese un correo electrónico válido');
    });
  
    test('validates password length', () => {
      const { result } = renderHook(() => useFormValidate());
  
      // Trigger validation with a short password
      act(() => {
        result.current.validate('password', 'short', { minLength: 6 });
      });
  
      // Assert error message for password length
      expect(result.current.getFieldError('password')).toBe('El campo debe tener al menos 6 caracteres');
    });

    test('validates phone number format', () => {
      const { result } = renderHook(() => useFormValidate());
  
      // Trigger validation with an invalid phone number format
      act(() => {
        result.current.validate('phoneNumber', '1234', { phone: true });
      });
      // Assert error message for invalid phone number format
      expect(result.current.getFieldError('phoneNumber')).toBe('Ingrese un numero telefónico válido');
    });
  // Add more test cases for other rules (max length, email, phone, etc.)
});
