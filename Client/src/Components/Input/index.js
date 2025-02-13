import React from 'react';

const Input = ({
    label = '',
    name = '',
    type = 'text',
    className = '', 
    isRequired = false,
    placeholder = '',
    value = '',
    onChange = () => {}, // Default to a no-op function
}) => {
  return (
    <div className='mb-4'> {/* Added margin-bottom for spacing */}
        <label htmlFor={name} className='text-white text-xl'>{label}</label>
        <input 
            type={type}  
            name={name} // Added name attribute
            placeholder={placeholder} 
            className={`bg-gray-50 border rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 outline outline-1 outline-black ${className}`} 
            required={isRequired} // Use required instead of isRequired
            value={value} // Controlled input
            onChange={onChange} // Handle input changes
        />
    </div>
  );
}

export default Input;