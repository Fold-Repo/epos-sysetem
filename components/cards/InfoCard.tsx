
import React from "react";

interface InfoCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
    variant?: "border_b" | "default";
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, description, color, variant = "default" }) => {

    return (
        <div className={`bg-white rounded-xl px-6 py-10 text-center cursor-pointer 
                ${variant === "border_b" ? "border-b-3 border-deep-purple" : "hover:border hover:border-yellow"}
            `}>

            <div className='relative mx-auto mb-7 flex items-center justify-center'
                style={{
                    width: 60,
                    height: 60,
                    backgroundColor: `${color}1A`,
                    clipPath:
                        "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                    boxShadow:
                        "0 0 20px 5px rgba(39, 87, 210, 0.15), 0 0 40px 10px rgba(39, 87, 210, 0.1), 0 0 60px 15px rgba(39, 87, 210, 0.05)",
                    borderRadius: "12px",
                }}>
                <div>{icon}</div>
            </div>

            <h3 className="text-base font-semibold mb-2">{title}</h3>
            <p className="text-gray-500 text-sm">{description}</p>

        </div>
    );
};

export default InfoCard;

