import { Award, BagHappy, BoxTick, UserOctagon } from 'iconsax-reactjs';

const StatsCard = () => {

    const stats = [
        { icon: Award, color: "#EF30C5", text: "10+ Awards Rewarded" },
        { icon: UserOctagon, color: "#CCB910", text: "20+ Years of Experience" },
        { icon: BagHappy, color: "#F2742D", text: "20+ Years of Experience" },
        { icon: BoxTick, color: "#16BE6A", text: "100+ Product Sale" },
    ];

    return (
        <div
            className="
            flex flex-col sm:flex-row sm:flex-wrap w-full
            sm:items-center gap-4 sm:gap-6 justify-center sm:justify-between
            bg-black/20 p-4 border border-white/10 backdrop-blur-lg rounded-md">
            {stats.map(({ icon: Icon, color, text }, index) => (
                <div
                    key={index}
                    className="inline-flex items-center gap-x-2 min-w-[180px]">
                    <Icon size={35} className="variant-Bulk" style={{ color }} />
                    <p className="text-white text-xs">{text}</p>
                </div>
            ))}
        </div>
    );
};

export default StatsCard;

