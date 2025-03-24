import PropTypes from "prop-types";

/**
 * A simple animated spinner component for loading states.
 *
 * @component
 * @param {Object} props
 * @param {string} [props.size="6"] - Size of the spinner (Tailwind width/height unit)
 * @param {string} [props.message] - Optional loading message to display
 * @param {string} [props.className] - Additional Tailwind classes
 * @returns {JSX.Element}
 */
function Loader({ size = "6", message, className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <div
        className={`w-${size} h-${size} border-4 border-blue-500 border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {message && <span className="text-sm text-gray-600 dark:text-gray-300">{message}</span>}
    </div>
  );
}

Loader.propTypes = {
  size: PropTypes.string,
  message: PropTypes.string,
  className: PropTypes.string,
};

export default Loader;