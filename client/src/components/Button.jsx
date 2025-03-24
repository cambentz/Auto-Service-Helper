import PropTypes from "prop-types";

/**
 * Reusable button component for form actions and UI interactions.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content.
 * @param {() => void} [props.onClick] - Function to run on click.
 * @param {string} [props.type="button"] - Button type (e.g., "button", "submit").
 * @param {string} [props.className=""] - Additional Tailwind classes.
 * @param {boolean} [props.disabled=false] - Whether the button is disabled.
 * @param {string} [props.ariaLabel] - Accessibility label.
 * @param {string} [props.title] - Tooltip text for the button.
 */
const Button = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  ariaLabel,
  title,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={title}
      className={`px-4 py-2 rounded transition text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  ariaLabel: PropTypes.string,
  title: PropTypes.string,
};

export default Button;
