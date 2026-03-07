import { PlusIcon } from "lucide-react";
import {Link} from "react-router-dom"
import LogoutButton from "../components/LogoutButton";



const Navbar = ({ onLogout, user }) =>{
    return (
        <header className="bg-base-300 border-b border-base-200">
            <div className="mx-auto mx-w-6xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold font-mono text-blue-300 tracking-tight cursor-pointer ">NoteMaker</h1>
                    <div className="flex item-center gap-4">
                        <Link to={"/create"} className="btn btn-primary">
                        <PlusIcon className="size-5"/>
                        <span>Create Note</span></Link>
                        <LogoutButton onLogout={onLogout} userEmail={user?.email} />
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;