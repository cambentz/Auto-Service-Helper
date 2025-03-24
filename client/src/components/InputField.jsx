import PropTypes from "prop-types";

/**
 * A reusable input field component with optional label and Tailwind styling.
 *
 * @component
 * @param {Object} props
 * @param {string} [props.label] - Optional label text to display above the input
 * @param {string} [props.id] - HTML id of the input (required for accessibility with label)
 * @param {string} [props.name] - Input field name
 * @param {string} [props.type="text"] - Input type (e.g., text, email, password)
 * @param {string} [props.placeholder] - Placeholder text
 * @param {string|number} [props.value] - Current value of the input
 * @param {function} [props.onChange] - Change handler
 * @param {boolean} [props.disabled] - Disable the input
 * @param {boolean} [props.required] - Mark input as required
 * @param {string} [props.className] - Additional Tailwind classes for customization
 */
function InputField({
  label,
  id,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  className = ""
}) {
  return (
    <div className="mb-4">
      {label && id && (
        <label htmlFor={id} className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-white dark:border-gray-600 ${className}`}
      />
    </div>
  );
}

InputField.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
};

export default InputField;
