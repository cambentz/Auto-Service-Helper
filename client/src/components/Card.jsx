import PropTypes from "prop-types";

const variantClasses = {
  default: "bg-white text-black border-gray-300",
  info: "bg-blue-100 text-blue-800 border-blue-200",
  success: "bg-green-100 text-green-800 border-green-200",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
  danger: "bg-red-100 text-red-800 border-red-200",
};

/**
 * Card component for displaying grouped content with a title and optional description.
 *
 * @component
 * @param {Object} props
 * @param {string} props.title - Title text for the card.
 * @param {string} [props.description] - Description or supporting text.
 * @param {React.ReactNode} [props.children] - Additional elements inside the card.
 * @param {string} [props.className] - Additional Tailwind classes for styling.
 * @param {'default' | 'info' | 'success' | 'warning' | 'danger'} [props.variant='default'] - Visual style variant.
 */
const Card = ({ title, description, children, className = "", variant = "default" }) => {
  const variantStyle = variantClasses[variant] || variantClasses.default;

  return (
    <div className={`border rounded-lg p-4 shadow-md ${variantStyle} ${className}`}>
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      {description && <p className="text-sm mb-3">{description}</p>}
      {children}
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  variant: PropTypes.oneOf(["default", "info", "success", "warning", "danger"]),
};

export default Card;
