import React from "react";
import { useNavigate } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "./DropdownMenu";
import Button from "./Button";
import { useAuth } from "../utils/AuthContext";
import { User, ChevronDown } from "lucide-react";

/**
 * UserDropdown displays a personalized greeting and dropdown menu for logged-in users.
 * Backend devs:
 * - `displayName` comes from AuthContext and localStorage — ensure your auth system supports this.
 * - `logout()` should be connected to your logout endpoint and also clear relevant user data client-side.
 */

const UserDropdown = ({ displayName = "User" }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <span className="flex items-center gap-1 text-[#1A3D61] hover:text-[#FFCC00] font-medium cursor-pointer">
                    <User size={18} className="translate-y-[1px]" />
                    Hi, {displayName}
                    <ChevronDown size={16} className="-ml-0.5 translate-y-[1px]" />
                </span>


            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={8}>
                <DropdownMenuItem onClick={() => navigate("/garage")}>My Garage</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/help")}>Help Center</DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>Log Out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    );
};

export default UserDropdown;
