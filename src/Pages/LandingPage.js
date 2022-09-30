import LandingHeader from "../Components/LandingPage/LandingHeader";
import LandingMain from "../Components/LandingPage/LandingMain";
import LandingFooter from "../Components/LandingPage/LandingFooter";
const LandingPage = () => {
    return (
        <div className="d-flex animation-fade-in bg-landing-mask text-black">
            <LandingHeader />
            <LandingMain />
            <LandingFooter />
        </div>
    );
};
export default LandingPage;
