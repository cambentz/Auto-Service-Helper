import React, { useState } from "react";

/**
 * TicketModal displays a contact form for user support tickets.
 * Backend devs:
 * - Replace the `console.log()` in `handleSubmit` with an API call to store or email the ticket.
 * - Optionally validate and sanitize inputs server-side.
 */

const TicketModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        // Simulated submission — replace with actual POST request to backend
        console.log("Ticket submitted:", { email, message });

        // Clear fields before closing
        setEmail("");
        setMessage("");

        onClose();
    };

    const handleClose = () => {
        setEmail("");
        setMessage("");
        onClose();
    };


    return (
        <div
            className="fixed inset-0 z-50 bg-black/10 backdrop-blur-sm flex items-center justify-center"
            onClick={handleClose}>
            <div
                className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative"
                onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl cursor-pointer">
                    &times;
                </button>
                <h2 className="text-2xl font-semibold text-[#1A3D61] mb-4">Submit a Help Ticket</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full border rounded p-2 border-gray-300"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com" />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Message</label>
                        <textarea
                            required
                            rows={4}
                            className="w-full border rounded p-2 border-gray-300"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Tell us what you need help with..." />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#1A3D61] text-white py-2 rounded hover:bg-[#17405f] transition cursor-pointer">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TicketModal;
