import Navbar from "../components/Navbar";
import TeamSection from "../components/TeamSection";
import Footer from "../components/Footer";
import { useEffect } from "react";

const TeamPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#030712]">
            <Navbar />
            <div className="pt-20">
                <TeamSection />
            </div>
            <Footer />
        </div>
    );
};

export default TeamPage;
